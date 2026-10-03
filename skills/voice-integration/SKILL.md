---
name: voice-integration
description: >
  语音接入：让 TA 用固定音色发语音条、让用户的语音变成 TA 能读的文字。TTS 合成 → 转码到渠道格式 → 上传下发；ASR 转写 → 原声+文字一起入对话。
  Voice integration: let the companion send voice notes in a fixed voice, and turn the user's voice into text the companion can read.
  TTS → transcode to the channel's format → upload & deliver; ASR → original audio + transcript into the conversation.
when-to-use:
  - 想让 TA 发语音条 / want the companion to send voice notes
  - 聊天页要加按住说话 / adding push-to-talk to a chat page
  - 语音"发不出去 / 格式不对 / 音色不一致 / 转写超时" / voice fails to send, wrong format, inconsistent voice, ASR timeouts
battle-tested-days: 24
battle-tested-since: 2026-09-09
executors: [Claude Code, Codex]
models-verified: [Claude Opus family, Claude Sonnet family]
license: MIT
---

# 语音接入 / Voice Integration

> 中文在前，English below.

## 中文

### 核心原则

1. **全家一个音色**：所有出口（即时通讯、聊天页、通话）用同一个 TTS 服务、同一个 voice ID。音色就是 TA 的嗓子，换了用户会立刻察觉。
2. **TA 只写文字，管道负责发声**：TA 在回复里输出一个语音标记（例如 `[[VOICE:要说的话]]`），出站路由识别后去合成。不要让 TA 自己调 TTS API。
3. **密钥只从服务端环境读**，前端和对话里永远不出现。

### 施工步骤（给 agent）

#### 第 0 步：查清渠道的语音格式与限额

| 渠道 | 要确认的 |
|---|---|
| 即时通讯 / 客服接口 | 语音消息接受什么编码（很多国内 IM 只收 AMR-NB 8kHz 单声道）、单条秒数上限、文件大小上限 |
| 自建聊天页 | 浏览器能播的格式（mp3 最稳），是否需要 Range 请求支持拖动 |
| 实时通话 | 流式还是整段，延迟预算 |

把上限写成**环境变量 + 硬上限**：环境变量只能调小，不能超过渠道硬上限。

#### 第 1 步：TTS 出站（TA → 用户）

```
TA 回复里的 [[VOICE:文本]]
  → 校验：非空、字数 ≤ 上限（建议 ~200 字，约 60 秒以内）
  → TTS API（固定 voice_id，API 主机走白名单）
  → 解码成 PCM（ffmpeg）→ 编码成渠道格式（例如 AMR-NB 12.2kbps）
  → 检查时长/大小不超限
  → 上传到渠道媒体接口拿 media_id → 发送语音消息
  → 失败：降级为发文字，不吞消息
```

- 合成结果按"文本哈希 + voice_id"缓存，同一句不重复花钱；聊天页回放历史语音时也复用这份缓存。
- 给 TTS 调用加**限速**（例如同一会话 15 秒一条），防止 TA 一轮里刷屏或回放补算时打爆额度。
- 出站路由在发往文字渠道时**剥掉语音标记**，但账本里保留，供聊天页还原语音气泡。

#### 第 2 步：ASR 入站（用户 → TA）

```
用户按住录音 → 上传原始音频（octet-stream）
  → 服务端转 mp3 存档（给聊天页回放用）
  → 后台调 ASR（等一个合理时长，例如 20 秒）
  → 按时到：消息 = 时长 + 转写 + 原声链接 → 走现有通道发给 TA
  → 超时：先发"时长 + 原声链接 + 转写中"，转写晚到后原子补写进原文
```

- ASR 在高峰期可能 30–60 秒才返回、或直接超时——**这是常态，不是链路坏了**。设计成异步补写，而不是让用户干等。
- 写给 TA 的语音入口要有**令牌**、**字数上限**、**幂等 ref**（重试不会让 TA 说两遍）。

#### 第 3 步：自测

- TTS：合成一句 → 用 `ffprobe` 看编码、采样率、时长 → 真发到**测试账号**听一遍。
- ASR：浏览器自动化用假麦克风（Chromium 有 fake media stream 参数）录一段 → 检查转写补写逻辑（故意让 ASR 超时）。
- 检查服务器上真的有 `ffmpeg` / `ffprobe`。缺了的话很多库会把真实异常包装成"文件无效"之类的通用错误，非常误导。

#### 第 4 步：回滚与数据

- 语音功能挂开关；关掉后 TA 的语音标记降级为文字。
- 回滚**不删**已录的用户语音和已合成的 TA 语音——那是两个人的数据。

### 已知坑

- 服务器没装 ffmpeg，报错却是"无效图片/无效文件"。
- 两个出口用了不同 voice_id，TA 在聊天页和 IM 里"声音不一样"。
- 把语音标记在写账本前就剥掉了，聊天页回放不出语音气泡。
- 直接整体替换上游语音项目的新版本，冲掉了本地的定制（音色、浏览器兼容修复）。先 diff 再合并。
- 实时通话入口挂在公网却没有票据/门，等于任何人都能直连 TA 的主会话。

---

## English

### Principles

1. **One voice for the whole home**: every outlet (IM, chat page, calls) uses the same TTS service and the same voice ID. The voice *is* the companion's throat; users notice a change instantly.
2. **The companion writes text; the pipeline speaks**: the companion emits a voice marker in its reply (e.g. `[[VOICE:what to say]]`), and the outbound router synthesizes it. Don't have the companion call the TTS API itself.
3. **Keys are read only from server-side env**; never in the frontend or the conversation.

### Build steps (for the agent)

#### Step 0: Learn the channel's voice format and limits

| Channel | Confirm |
|---|---|
| IM / customer-service API | Accepted codec (many IMs only take AMR-NB 8kHz mono), max seconds per message, max file size |
| Self-built chat page | A browser-playable format (mp3 is safest); whether Range requests are needed for seeking |
| Live calls | Streaming vs. whole clips; latency budget |

Express limits as **env vars + hard caps**: env vars can only lower them, never exceed the channel's hard cap.

#### Step 1: TTS outbound (companion → user)

```
[[VOICE:text]] in the companion's reply
  → validate: non-empty, length ≤ cap (~200 chars, under ~60 s)
  → TTS API (fixed voice_id; API host allow-listed)
  → decode to PCM (ffmpeg) → encode to channel format (e.g. AMR-NB 12.2 kbps)
  → check duration/size within caps
  → upload to the channel's media API for a media_id → send the voice message
  → on failure: fall back to sending text; never swallow the message
```

- Cache synthesized audio by "text hash + voice_id" so the same line isn't paid for twice; the chat page reuses this cache when replaying history.
- **Rate-limit** TTS calls (e.g. one per 15 s per conversation) so a single turn can't spam, and backfills can't burn the quota.
- The outbound router **strips voice markers** for text channels but keeps them in the ledger so the chat page can rebuild voice bubbles.

#### Step 2: ASR inbound (user → companion)

```
user holds to record → upload raw audio (octet-stream)
  → server converts to mp3 and keeps it (for chat-page playback)
  → background ASR call (wait a reasonable time, e.g. 20 s)
  → in time: message = duration + transcript + audio link → sent via the existing channel
  → timed out: send "duration + audio link + transcribing", then atomically patch the transcript in when it arrives
```

- At peak times ASR can take 30–60 s or time out. **That's normal, not a broken link.** Design for async patching instead of making the user wait.
- The voice endpoint for the companion needs a **token**, a **length cap**, and an **idempotency ref** (so retries don't make it speak twice).

#### Step 3: Self-test

- TTS: synthesize a line → check codec, sample rate, duration with `ffprobe` → send it to a **test account** and listen.
- ASR: browser automation with a fake microphone (Chromium has fake media stream flags) → test the late-transcript patch path (force an ASR timeout).
- Confirm `ffmpeg` / `ffprobe` actually exist on the server. If missing, many libraries wrap the real error as a generic "invalid file", which is very misleading.

#### Step 4: Rollback and data

- Put voice behind a flag; when off, the companion's voice markers degrade to text.
- Rollback **never deletes** recorded user audio or synthesized companion audio. That's two people's data.

### Known pitfalls

- No ffmpeg on the server, but the error says "invalid image/file".
- Two outlets with different voice IDs: the companion "sounds different" on the chat page vs. the IM.
- Stripping voice markers before writing the ledger, so the chat page can't replay voice bubbles.
- Replacing an upstream voice project wholesale with a new release, wiping local customizations (voice, browser compatibility fixes). Diff first, then merge.
- A public live-call endpoint without a ticket/gate lets anyone talk straight into the companion's main session.
