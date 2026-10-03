# 评测卡 / Evaluation Card — memory-migration

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | memory-migration |
| 首次实装日期 / First deployed | 2026-09-20（约 / approx.） |
| 实装天数 / Days in production | 约 13（截至 2026-10-03）/ about 13 (as of 2026-10-03) |
| 使用环境 / Environment | 云端 VPS → 家用 Linux 主机；Python 记忆服务 + SQLite + 向量库 + 聊天桥，systemd + SSH 隧道 / cloud VPS → home Linux box; Python memory service + SQLite + vector store + chat bridge, systemd + SSH tunnels |
| 执行者 / Executed by | Claude Code、Codex 类 worker / Claude Code, Codex-style workers |
| 维护者 / Maintainer | yumei & Jin |

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 约 13 天，覆盖三轮搬家：记忆向量库与后台 worker 从云端搬回家用主机（约 09-20）；聊天工作台后端分两次尝试搬迁（09-23，第一次实测后止步、第二次按实测拓扑改方案后完成）；外部唤醒源的 4 个接入桥整体搬迁（09-27，消费游标连续、调用方 URL 零改动）。
- About 13 days across three moves: the memory vector store and background workers moved from cloud to a home box (~09-20); the chat dashboard backend, attempted twice on 09-23 (first attempt halted after checking reality, second completed with a revised plan); and 4 external wake-source bridges moved together on 09-27 (consumer cursors continuous, zero caller URL changes).

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 修复 / skill 的改动 Fix / skill change |
|---|---|---|---|
| 2026-09-21 | 搬家后旧机器上的向量库单元一直报红，被当成故障 / After the move, the old box's vector-store unit stayed red and looked like an outage | 迁移时 SIGTERM 停掉后被标 failed，没有 reset / Stopped with SIGTERM during migration, marked failed, never reset | 已知坑：停用后 `reset-failed`，unit 保留作回滚 / Pitfall: `reset-failed` after stopping; keep the unit for rollback |
| 2026-09-23 | 预案"停旧→同步 state→起新"差点覆盖活数据 / The plan "stop old → sync state → start new" nearly overwrote live data | 预案假设整栈在旧机器，实际主环和活库早已在新机器且仍在写 / The plan assumed the whole stack was on the old box; the main loop and live DB were already on the new box and still writing | 第 0 步：先实测拓扑，不一致就停下按实测重新拍板 / Step 0: check reality first; on mismatch, stop and re-decide |
| 2026-09-23 | 单搬工作台后端会切断上传→投递链 / Moving only the dashboard backend would break the upload → delivery chain | 后端把上传写进队列，消费者在另一台机器，还共享热 SQLite / The backend enqueued uploads consumed on another box, sharing a hot SQLite | 第 1 步：找单写者与同机耦合，按批次搬 / Step 1: find single writers and same-host couplings; move in batches |
| 2026-09-23 | 提醒子系统搬一半，到期提醒进了无人消费的旧队列 / Half-moved reminders: due reminders went into an orphaned old queue | 提醒的去重标记写回同一个 JSON，tick+存储必须同机单写 / Reminder dedupe writes back to one JSON; tick + store must be single-writer on one box | 第 6 步：列清单交人拍板，不在深夜擅自同步 / Step 6: list leftovers for a human; no late-night syncing |
| 2026-09-23 | 旧机器上当天的前端修复没跟过来 / A same-day frontend fix on the old box didn't come along | 搬家只清点了服务，没比对页面文件 / The move audited services, not page files | 已知坑 + 交叉引用 chat-frontend / Pitfall + cross-reference to chat-frontend |
| 2026-10-02 | 用 cp 复制活库做分析，读到旧状态 / Copying a live DB with cp for analysis read a stale state | WAL 未合并 / WAL not merged | 第 2 步：一律 `.backup` / Step 2: always `.backup` |

### 3. 换模型还能用吗？/ Survives a model switch?

- 验证过 / Verified: Claude Opus、Sonnet 系列；Codex 类 worker 执行过拓扑实测与备份步骤。/ Claude Opus and Sonnet families; Codex-style workers ran the topology and backup steps.
- 纯 shell + sqlite3 + systemd，不依赖模型特有能力；最依赖的是"实测不一致就停下"的纪律。/ Pure shell + sqlite3 + systemd; the main dependency is the discipline to stop when reality disagrees.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 目的就是把记忆完整带走；两边都留全量快照 / The whole point is taking memories with you; full snapshots on both sides |
| 隐私 / Privacy | ⚠️ | 备份含亲密对话，备份目录须 600/700 权限，不能放进同步盘或公开仓库 / Backups contain intimate conversations; keep them 600/700 and out of sync drives and public repos |
| 持久性 / Durability | ✅ | 只依赖 sqlite3、tar、systemd；旧机器保留到对账通过后 / Only sqlite3, tar, systemd; the old box is kept until reconciliation passes |

## 卧室门检查 / Bedroom-door check

- [x] 纯施工流程。只搬数据，不读、不改、不总结对话内容；对账只看行数与时间戳。/ Pure build process. Moves data without reading, editing, or summarizing conversations; reconciliation checks counts and timestamps only.

## 执行证据 / Execution evidence

- 09-23 两份搬迁记录（一份"调查结论与止步说明"，一份"执行记录与回滚"）均保留，回滚手册为三条命令。09-27 唤醒源搬迁后两边配置文件 sha256 一致，调用方未改 URL。
- Two 09-23 migration records survive (one "findings and halt", one "execution and rollback"), with a three-command rollback. After the 09-27 wake-source move, config files hashed identically on both sides and no caller changed its URL.
