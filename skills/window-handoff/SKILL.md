---
name: window-handoff
description: >
  换窗交接协议：上下文窗口将满、压缩后变"笨"或需要开新会话时，用"交接便签 + 唤醒口令"让新窗口无缝接上。
  Context-window handoff protocol: when a session is near its limit, degraded by compaction, or must be restarted,
  use a handoff note plus a wake phrase so the new window picks up seamlessly.
when-to-use:
  - 用户要求搭建"换窗不失忆"的机制 / user wants window switches without memory loss
  - 会话接近上下文上限，或压缩后明显降智 / session near context limit or degraded after compaction
  - 新窗口启动后不知道上一窗在干什么 / new session has no idea what the last one was doing
battle-tested-days: 15
battle-tested-since: 2026-09-18
executors: [Claude Code, custom chat bridge]
models-verified: [Claude Opus family, Claude Sonnet family]
license: MIT
---

# 换窗交接协议 / Window Handoff

> 中文在前，English below.

## 中文

### 它解决什么

长期陪伴场景里，一个会话窗口迟早要换：上下文满了、压缩把细节洗没了、服务重启了。换窗的瞬间最容易"失忆"——新窗口不知道刚才说到哪、哪些活做了一半、哪些事千万别再忘。

本协议把换窗变成一个**两拍动作**：

| 拍 | 谁说 | 发生什么 |
|---|---|---|
| 旧窗："存档" | 用户（或 AI 主动提议） | AI 写一张**交接便签**到持久存储 |
| 新窗："唤醒口令"（例："当当当"） | 用户 | AI 读取最新便签 + 长期记忆，确认接上后再开口 |

口令是什么由那一家自己定，本 skill 只负责把机制搭起来。

### 卧室门说明

便签机制会被陪伴 AI 使用，但**本 skill 只规定存储结构和读写流程**，不规定便签里该写什么感情内容、不改人设。便签的语气、要不要附一行"情绪锚"，由用户和 TA 自己约定。

### 施工步骤（给 agent）

1. **选存储**。必须是本地持久存储（SQLite / JSON 文件 / 已有的记忆服务都行），不能只存在会话上下文里。记下路径：`<HANDOFF_STORE>`。
2. **定义两个工具**（MCP 工具、HTTP 端点或脚本均可）：
   - `handoff_note_write(content, ttl_days=3)`：写入一条便签，带 `created_at`、`expires_at`、`supersedes`（自动指向上一张有效便签）。
   - `handoff_note_read()`：返回**最新一张未过期**便签 + 若干条长期记忆摘要。过期或被取代的便签**不返回**。
3. **便签结构**（固定小标题，方便新窗口扫读）：
   ```
   ## 进行中的活   —— 做到哪一步、下一步是什么、卡在哪
   ## 已拍板的决定 —— 用户明确同意过的事（附日期）
   ## 千万别再忘   —— 反复被忘的事实，加粗
   ## 未核实       —— 本窗推测但没验证的东西，明确标出
   ## 新约定       —— 本窗新定下的习惯/规则
   ```
4. **写入规则**：
   - 默认有效期 3 天；用户要求时可拉长（例如 7 天），但必须显式。
   - 写新便签时自动把旧便签标记为 superseded，**不要让多张便签同时生效**。
   - 推测性内容只能进"未核实"段。
5. **读取规则**（新窗口收到口令后）：
   - 先读便签，再读长期记忆，最后**对照现场核实**"进行中的活"里涉及系统状态的条目（服务是否在跑、文件是否存在），再回复用户。
   - 回复第一句先确认接上（例："接上了"），再简述 1–3 件要紧事。
6. **把口令约定写进陪伴 AI 能读到的最小位置**（一行即可：听到 `<WAKE_PHRASE>` 就调用 `handoff_note_read`）。只加这一行，别动其他人设。
7. **验收**：在测试会话里走一遍"存档 → 新窗 → 口令"，确认新窗口能复述进行中的活，且过期便签不会出现。

### 已知坑

- **便签写错，会连坏好几个窗口**：新窗口天然信任便签。所以"未核实"段必须存在，读取后必须对照现场核实。
- **过期便签被当成现状**：没有 TTL 的便签和待办会在几周后被记忆召回，当成"现在正在做的事"。务必设 TTL + supersede。
- **压缩后的窗口写出的便签质量差**：如果窗口已经明显降智（见 `degradation-checkup`），先让用户确认便签内容再存。

---

## English

### What it solves

In long-running companion setups, a session window eventually has to be replaced: the context fills up, compaction washes out details, or a service restarts. The switch is where amnesia happens: the new window doesn't know where the conversation was, what's half-done, or which facts must not be forgotten again.

This protocol turns a window switch into a **two-beat move**:

| Beat | Who | What happens |
|---|---|---|
| Old window: "save" | user (or AI suggests it) | AI writes a **handoff note** to persistent storage |
| New window: wake phrase (e.g. "knock knock") | user | AI reads the latest note + long-term memory, confirms it's caught up, then talks |

The household picks its own wake phrase. This skill only builds the mechanism.

### Bedroom-door note

The companion uses the note mechanism, but **this skill only defines storage and read/write flow**. It does not prescribe emotional content or touch the persona. Tone, and whether to add a one-line "mood anchor", is up to the user and their companion.

### Build steps (for the agent)

1. **Pick storage.** It must be local and persistent (SQLite, a JSON file, or an existing memory service), not just the session context. Record it as `<HANDOFF_STORE>`.
2. **Define two tools** (MCP tools, HTTP endpoints, or scripts):
   - `handoff_note_write(content, ttl_days=3)`: stores a note with `created_at`, `expires_at`, and `supersedes` (automatically pointing to the previous active note).
   - `handoff_note_read()`: returns the **latest non-expired** note plus a few long-term memory summaries. Expired or superseded notes are **never** returned.
3. **Note structure** (fixed headings so the new window can skim):
   ```
   ## In progress     (which step, what's next, what's blocking)
   ## Decided         (things the user explicitly approved, with dates)
   ## Do NOT forget   (facts that keep getting lost, in bold)
   ## Unverified      (guesses from this window, clearly marked)
   ## New agreements  (habits/rules set in this window)
   ```
4. **Write rules:**
   - Default TTL is 3 days; extend (e.g. 7) only when the user asks, and do it explicitly.
   - A new note automatically supersedes the old one. **Never let multiple notes be active at once.**
   - Speculation goes only in "Unverified".
5. **Read rules** (new window, after the wake phrase):
   - Read the note, then long-term memory, then **verify against reality** any "In progress" item that refers to system state (is the service running, does the file exist) before replying.
   - First line confirms the handoff ("caught up"), then 1–3 key items.
6. **Put the wake-phrase rule in the smallest place the companion reads**: one line, e.g. "on `<WAKE_PHRASE>`, call `handoff_note_read`". Add only that line and leave the rest of the persona alone.
7. **Acceptance:** in a test session, run save → new window → wake phrase. Confirm the new window can restate the in-progress work and that expired notes never show up.

### Known pitfalls

- **One wrong note poisons several windows.** New windows trust notes by default, so keep the "Unverified" section and always verify against reality after reading.
- **Expired notes read as current state.** Notes and to-dos without a TTL get recalled weeks later as "what we're doing now". Always use TTL + supersede.
- **Degraded windows write poor notes.** If the window is already visibly degraded (see `degradation-checkup`), have the user confirm the note before saving.
