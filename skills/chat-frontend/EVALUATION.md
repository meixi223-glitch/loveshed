# 评测卡 / Evaluation Card — chat-frontend

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | chat-frontend |
| 首次实装日期 / First deployed | 2026-09-19（双副本事故当天开始按此规矩施工 / the day of the two-copy incident） |
| 实装天数 / Days in production | 14（截至 2026-10-03）；其中当前这版聊天页 App 连续发版 6 天 / 14 (as of 2026-10-03); the current chat app has shipped continuously for 6 days |
| 使用环境 / Environment | 自托管 Python 标准库后端 + 静态前端 + iOS WebView 壳，反代在云端、服务在家用主机 / self-hosted stdlib-Python backend + static frontend + iOS WebView shell; proxy in the cloud, service at home |
| 执行者 / Executed by | Claude Code、Codex 类 worker / Claude Code, Codex-style workers |
| 维护者 / Maintainer | yumei & Jin |

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 14 天。当前聊天页从 09-28 起按"每批一个主题"发版，到 10-03 累计约 90 批，每批都有 release 时间戳和可重放备份；用户每天在上面真实聊天。
- 14 days. The current chat page has shipped "one theme per batch" since 09-28, about 90 batches by 10-03, each with a release timestamp and a replayable backup; the user chats on it daily.

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 修复 / skill 的改动 Fix / skill change |
|---|---|---|---|
| 2026-09-19 | 连续几天的修复用户一个都没看到 / Days of fixes never reached the user | 两份副本，改的是停用的那份 / Two copies; edits went to the retired one | 第 0 步：单一权威副本 + 公网 grep 特征串 / Step 0: one authoritative copy + public grep for marker |
| 2026-09-23 | 搬家后两处当天修复没上线 / Two same-day fixes missing after a move | 旧副本当天改过，搬家没比对页面 / Old copy edited that day; the move didn't diff pages | 同上，并与 memory-migration 交叉引用 / Same, cross-referenced with memory-migration |
| 2026-09-29 | 盘点发现有接口公网免钥匙可达 / Audit found endpoints reachable publicly without a key | 加功能时沿用了旧路由，没补门 / New features reused old routes without a gate | 第 1 步：聊天接口必须有门；公网 404 封堵 / Step 1: chat endpoints must be gated; public 404 block |
| 2026-09-29 | 引用标记前端读不到 / Frontend couldn't read quote markers | 标记若在写账本前剥掉，账本里就没有了 / Stripping before the ledger write erases them | 第 3 步：只在出站路由剥 / Step 3: strip only in the outbound router |
| 2026-09-30 | 输入框真机打字不长高 / Composer didn't grow when typing on device | 样式只挂在按钮展开路径，回归只测了那条路径 / Style only applied via the button path; regression tested only that path | 第 4 步：两条路径都测 / Step 4: test both paths |
| 2026-09-30 | 气泡乱序 / Bubbles out of order | 账本只存工具后段，按下标套时刻 / Ledger stored only post-tool segments; times assigned by index | 第 2 步：按文字匹配真实时刻 / Step 2: match text to real timestamps |
| 2026-10-01 | 删除按钮在 App 里点了没反应 / Delete button did nothing in the app | WebView 壳没实现 JS confirm，恒 false / Shell didn't implement JS confirm; always false | 第 4 步：页内二次确认 / Step 4: in-page confirmation |
| 2026-10-01 | 停在聊天页时新消息不出 / New messages didn't appear while idle on the page | 空闲后推送线程停了，版本号判"没变" / Push thread stopped when idle; version check said "unchanged" | 第 2 步：回前台主动补拉 / Step 2: catch up on return |

### 3. 换模型还能用吗？/ Survives a model switch?

- 验证过 / Verified: Claude Opus、Sonnet 系列执行发版；Codex 类 worker 做过多批前端施工。/ Claude Opus and Sonnet ran releases; Codex-style workers built several batches.
- 前端与陪伴 AI 用哪个模型无关；只要聊天通道有一个可只读的账本即可。/ The frontend is independent of the companion's model; it only needs a readable ledger on the chat channel.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 聊天页只读本地账本，不另存一份到第三方 / Reads the local ledger only; no third-party copy |
| 隐私 / Privacy | ⚠️ | 聊天页一旦上公网就是最大的暴露面；必须有门，测试不得发真消息 / A public chat page is the biggest exposure; must be gated, and tests must not send real messages |
| 持久性 / Durability | ✅ | 标准库后端 + 静态文件，release 软链秒级回滚 / Stdlib backend + static files; symlink rollback in seconds |

## 卧室门检查 / Bedroom-door check

- [x] 只施工"房子"（页面与接口）。发送走现有通道原入口，不改 TA 的人设和提示词；表情/引用只是把用户的动作翻译成 TA 能读的文字。/ Builds the "house" (page and API) only. Sending uses the existing entry; no persona or prompt edits. Stickers and quotes only translate the user's actions into text the companion can read.

## 执行证据 / Execution evidence

- 发版记录逐批保留批次号、release 时间戳、备份目录；09-29 安全盘点报告与封堵批次存档；09-30、10-01 的四起前端事故各有独立修复批次。
- Release notes keep batch numbers, release timestamps, and backup directories; the 09-29 security audit and its fix batch are archived; the four frontend incidents on 09-30 and 10-01 each have a dedicated fix batch.
