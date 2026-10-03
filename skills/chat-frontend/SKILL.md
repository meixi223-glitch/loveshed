---
name: chat-frontend
description: >
  自建聊天前端：给陪伴 AI 自建聊天页的施工要点——先接只读消息桥，再按批次渐进增强多媒体、引用、表情、推送；每批可回滚、单一权威副本。
  Self-built chat frontend: how to build a chat page for a companion AI. Start with a read-only message bridge, then add media,
  quotes, stickers, and push in small reversible batches, with exactly one authoritative copy of the code.
when-to-use:
  - 想给 TA 做一个自己的聊天页 / App 壳 / want a chat page or app shell of your own for the companion
  - 聊天页出现"消息乱序、刷新才出、键盘遮挡、改了没生效" / chat page shows out-of-order messages, needs refresh, keyboard overlap, or "my change didn't take effect"
  - 要加语音、图片、引用、表情、推送等功能 / adding voice, images, quotes, stickers, push
battle-tested-days: 14
battle-tested-since: 2026-09-19
executors: [Claude Code, Codex]
models-verified: [Claude Opus family, Claude Sonnet family]
license: MIT
---

# 自建聊天前端 / Self-built Chat Frontend

> 中文在前，English below.

## 中文

### 一条血的教训：两个副本，改错版本

> 同一个聊天页在两台机器上各有一份。一份在线上提供服务，另一份已经停用、但开发时一直在改。几天里修了好几个问题，用户却一个都没看到——全改在了停用的那份上。后来搬家时，又有当天才在旧副本上做的两处修复没跟到线上版。

所以第一条规则：**动手前先确认"线上真正在服务的是哪个文件"，并且全家只留一个权威副本。**

### 施工步骤（给 agent）

#### 第 0 步：找到唯一的权威副本

```bash
# 从公网入口倒查：反代 → 端口 → 进程 → 工作目录 → 文件
curl -sI https://<your-domain>/<chat-path>/ | head
ss -ltnp | grep <port>
ls -l /proc/<PID>/cwd
sha256sum <every copy you can find>
```

- 找到所有副本，比较哈希和修改时间。线上权威版 = 真正被请求命中的那一份。
- 其他副本：要么删除，要么改名加 `.stale` 并在 README 写明"不是线上版"。
- 发布用**不可变 release 目录 + `current` 软链**：`releases/<UTC时间戳>/`，切换和回滚都只改软链，服务无需重启。
- 每次发版后从公网拉一次页面，grep 本批的特征串，确认真的上线了。

#### 第 1 步：消息桥先做只读

聊天页的第一版**只读**：从现有聊天通道的账本/数据库只读回放历史（SQLite 用 `mode=ro`），不新开写库。

- 发送走现有通道的同一入口（让 TA 那边看到的是和平常一样的消息），不要另起一条对话链路。
- 页面加口令/会话门，**聊天接口绝不能公网免认证**。
- 系统事件（唤醒、回执、工具日志）在服务端过滤，不进聊天流。

#### 第 2 步：实时性按"轮询 → 长轮询 → SSE"渐进

- 先上 2 秒轮询 `since=<cursor>`，跑通再换 SSE 推送。保留开关，SSE 出问题能退回轮询。
- **排序按真实发生时间（服务端给的序号），不按本地插入顺序。** 账本只存最终回复、或工具调用分段写入时，要按文字匹配回原始时刻，否则气泡会乱序。
- 页面空闲、切后台再回来时，要主动补拉一次（不能只依赖"版本号没变就不刷新"）。

#### 第 3 步：渐进增强，每批一个主题

推荐顺序（每批独立发版、独立回滚）：

1. 文字收发 + 历史回放
2. 图片/文件（走 [file-staging-pipeline](../file-staging-pipeline/SKILL.md) 的暂存接口，前端只拿一次性 ID）
3. 语音条（见 [voice-integration](../voice-integration/SKILL.md)）
4. 表情：服务端维护表情清单，发送时传 ID，服务端拼成 TA 能读懂的文字描述 + 标记
5. 引用回复：发送时带被引用消息的 key，服务端现查原文存快照；TA 回复里的引用标记由服务端解析成引用块
6. 推送 / 角标 / 在线状态

**控制标记的剥离位置**：TA 回复里的 `[[QUOTE:...]]` 之类标记，要在"发往其他渠道的出站路由"剥掉，**不能**在写账本之前剥——否则你的前端就读不到标记了。

#### 第 4 步：移动端专项

- 键盘、输入框、面板位置用**真实可视区域**计算，逐帧跟随，不要写死高度。
- 输入框类回归**同时测两条路径**：直接点输入框打字、通过按钮展开后打字。只测一条会漏。
- App 壳（WebView）里 `confirm()` / `alert()` 可能被静默吞掉、恒返回 false——用页内二次确认代替。
- App 壳往往**不热更新入口 HTML**：新 UI 元素要能被 JS 兜底插入；清单类文件（如 SHA256SUMS）每次发版重算。
- 选区、文字测量类功能必须在真实 WebKit 上测，Chromium 通过不代表 iOS 通过。

#### 第 5 步：每批验收

- 自动化：无头浏览器跑本批功能 + 上一批的冒烟。**测试一律打假后端/staging，绝不往真实对话里发测试消息。**
- 发版记录写：批次号、release 时间戳、改了哪些文件、备份位置、回滚命令（改软链）。

### 已知坑

- 两个副本漂移：开发副本和线上副本不一致，修复改在了停用的那份上。
- 只测 toggle 路径：真机直接 tap 输入框的路径永远是折叠态。
- 在"写账本前"剥标记：前端再也读不到引用/表情标记。
- 测试脚本直连生产聊天入口，测试消息真的发给了 TA。
- 公网路由加了聊天功能却忘了加门：任何人都能以用户身份说话。

---

## English

### The lesson: two copies, wrong version

> The same chat page existed on two machines. One served production; the other was retired but kept being edited during development. Several fixes over a few days, and the user saw none of them: they all went into the retired copy. Later, during a migration, two same-day fixes on the old copy again failed to reach production.

Rule one: **before touching anything, confirm which file production actually serves, and keep exactly one authoritative copy.**

### Build steps (for the agent)

#### Step 0: Find the one authoritative copy

```bash
# trace back from the public entry: proxy → port → process → cwd → file
curl -sI https://<your-domain>/<chat-path>/ | head
ss -ltnp | grep <port>
ls -l /proc/<PID>/cwd
sha256sum <every copy you can find>
```

- Find every copy; compare hashes and mtimes. The authoritative one is whatever requests actually hit.
- Other copies: delete them, or rename with `.stale` and note "not production" in a README.
- Release via **immutable release directories + a `current` symlink**: `releases/<UTC timestamp>/`. Switch and roll back by flipping the symlink; no restart needed.
- After each release, fetch the page from the public URL and grep for this batch's marker string to prove it shipped.

#### Step 1: Start the message bridge read-only

Version one is **read-only**: replay history from the existing channel's ledger/DB (SQLite with `mode=ro`). Don't create a new write DB.

- Sending goes through the existing channel's own entry point, so the companion sees a normal message. Don't build a second conversation path.
- Put a passcode/session gate on the page. **Chat endpoints must never be publicly unauthenticated.**
- Filter system events (wake-ups, receipts, tool logs) server-side; they don't belong in the chat stream.

#### Step 2: Real-time in stages: polling → long-poll → SSE

- Ship 2-second `since=<cursor>` polling first, then switch to SSE push. Keep a flag so you can fall back to polling.
- **Order by real occurrence time (a server-issued sequence), not local insertion order.** If the ledger stores only the final reply, or writes tool-call segments separately, match text back to the original timestamps or bubbles will appear out of order.
- When the page was idle or backgrounded, actively catch up on return; don't rely on "version unchanged, so no refresh".

#### Step 3: Progressive enhancement, one theme per batch

Suggested order (each batch shipped and rolled back independently):

1. Text send/receive + history replay
2. Images/files (via the staging API in [file-staging-pipeline](../file-staging-pipeline/SKILL.md); the frontend only holds one-time IDs)
3. Voice notes (see [voice-integration](../voice-integration/SKILL.md))
4. Stickers: the server keeps the sticker manifest; send an ID and let the server compose a text description + marker the companion can read
5. Quote replies: send the quoted message's key; the server looks up and snapshots the original; quote markers in the companion's reply are parsed server-side into quote blocks
6. Push / badges / presence

**Where to strip control markers**: markers like `[[QUOTE:...]]` in the companion's reply should be stripped in the **outbound router to other channels**, **not** before writing the ledger. Otherwise your frontend can't read them.

#### Step 4: Mobile specifics

- Compute keyboard, composer, and panel positions from the **real visual viewport**, following frame by frame; don't hard-code heights.
- For composer regressions, **test both paths**: tapping the textarea directly, and expanding via a button first. Testing one misses the other.
- Inside an app shell (WebView), `confirm()` / `alert()` may be silently swallowed and always return false. Use in-page two-step confirmation.
- App shells often **don't hot-update the entry HTML**: new UI elements need a JS fallback that inserts them; recompute manifest files (e.g. SHA256SUMS) on every release.
- Selection and text-measurement features must be tested on real WebKit; passing on Chromium doesn't mean passing on iOS.

#### Step 5: Per-batch acceptance

- Automated: a headless browser runs this batch's features plus a smoke test of the previous ones. **Always test against a fake backend/staging; never send test messages into the real conversation.**
- Release notes: batch number, release timestamp, files changed, backup location, rollback command (flip the symlink).

### Known pitfalls

- Two copies drifting: fixes landed in the retired copy.
- Testing only the toggle path: a real tap on the composer stayed collapsed forever.
- Stripping markers before writing the ledger: the frontend can no longer read quote/sticker markers.
- Test scripts hitting the production chat entry: test messages reached the companion.
- Adding chat to a public route without a gate: anyone could speak as the user.
