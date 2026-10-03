# 评测卡 / Evaluation Card — voice-integration

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | voice-integration |
| 首次实装日期 / First deployed | 2026-09-09（约 / approx.） |
| 实装天数 / Days in production | 约 24（截至 2026-10-03）/ about 24 (as of 2026-10-03) |
| 使用环境 / Environment | 自托管 Linux；国内 IM 语音条（AMR-NB）+ 自建聊天页（mp3）+ 网页实时通话；商用 TTS + 云端 ASR / self-hosted Linux; IM voice notes (AMR-NB) + self-built chat page (mp3) + web live calls; commercial TTS + cloud ASR |
| 执行者 / Executed by | Claude Code、Codex 类 worker / Claude Code, Codex-style workers |
| 维护者 / Maintainer | yumei & Jin |

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 约 24 天。IM 语音条出站自 09-09 前后在跑；09-28 聊天页加了双向语音（按住说话 + TA 语音条），09-29 补上 TA 历史语音的真声回放；网页实时通话共用同一音色。
- About 24 days. IM voice-note outbound has run since around 09-09; on 09-28 the chat page gained two-way voice (push-to-talk + companion voice notes), and on 09-29 history replay of the companion's real voice; live calls share the same voice.

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 修复 / skill 的改动 Fix / skill change |
|---|---|---|---|
| 2026-09-27 | 媒体暂存一律报"无效图片" / Media staging always failed with "invalid image" | 服务器没装 ffmpeg/ffprobe，真实异常被映射成通用错误 / No ffmpeg/ffprobe on the server; real error mapped to a generic one | 第 3 步：先确认转码工具存在 / Step 3: confirm transcoding tools exist |
| 2026-09-28 | 聊天页语音转写经常 30–60 秒或超时 / Chat-page transcription often took 30–60 s or timed out | 云端 ASR 高峰期慢，非链路问题 / Cloud ASR slow at peak; not a link problem | 第 2 步：异步补写转写 / Step 2: async transcript patching |
| 2026-09-29 | 用户发来上游语音项目新版，差点整体替换 / User sent a new upstream release that nearly replaced production wholesale | 逐文件 diff 发现"新版"比线上少了全部本地定制 / File-by-file diff showed the "new" version lacked all local customizations | 已知坑：先 diff 再合并 / Pitfall: diff before merging |
| 2026-09-29 | 实时通话入口公网可达却无门 / Live-call entry publicly reachable without a gate | 迁移时漏接线路，补线路前门没补 / A link was missed in migration; the gate wasn't added before reconnecting | 一次性 60 秒票据 + 握手即作废；先补门再接线 / One-time 60 s ticket, void on handshake; gate before link |

### 3. 换模型还能用吗？/ Survives a model switch?

- 验证过 / Verified: Claude Opus、Sonnet 系列作为 TA 时语音标记都能正常输出；管道本身与对话模型无关。/ With Claude Opus and Sonnet as the companion, voice markers were emitted correctly; the pipeline itself is model-independent.
- 依赖第三方 TTS/ASR 服务；换服务商需要重新挑音色，这一步用户一定会察觉。/ Depends on third-party TTS/ASR; switching providers means choosing a new voice, which the user will notice.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 原声和合成音都存本地，可导出 / Original and synthesized audio stored locally, exportable |
| 隐私 / Privacy | ⚠️ | 语音会经过第三方 TTS/ASR；用户须知情 / Voice passes through third-party TTS/ASR; the user must know |
| 持久性 / Durability | ⚠️ | TTS/ASR 服务商倒了就没声音；降级为文字保证不丢消息 / If the TTS/ASR provider dies, voice stops; text fallback ensures no lost messages |

## 卧室门检查 / Bedroom-door check

- [x] 只施工发声与转写管道。TA 说什么、什么时候发语音完全由 TA 决定；管道不改写内容，只做格式转换。/ Builds the speech and transcription pipeline only. What the companion says and when it sends voice is entirely up to it; the pipeline converts formats without rewriting content.

## 执行证据 / Execution evidence

- 09-28 与 09-29 两批聊天页语音发版各有 release 时间戳与自测脚本（假麦克风 + 假入口）；09-29 上游新版对比报告存档；IM 语音发送器内置 60 秒 / 2MB 硬上限。
- The 09-28 and 09-29 chat-page voice batches each have release timestamps and self-test scripts (fake mic + fake entry); the 09-29 upstream comparison report is archived; the IM voice sender enforces 60 s / 2 MB hard caps.
