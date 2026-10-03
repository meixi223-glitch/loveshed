---
name: memory-migration
description: >
  记忆搬家：把记忆库/陪伴栈从一台机器（或一个服务）迁到另一台，不丢一条记忆：先摸清真实拓扑，再导出、校验、导入、对账，最后留回滚路。
  Memory migration: move a memory store or companion stack between machines or services without losing a single memory:
  map the real topology first, then export, verify, import, reconcile, and keep a way back.
when-to-use:
  - 换服务器、换 VPS、把服务从云上搬回家里的机器 / changing servers, or moving services from a cloud VPS to a home box
  - 换记忆后端（SQLite → 另一个库、换向量库）/ swapping memory backends (SQLite → another DB, a new vector store)
  - 迁移后发现"有东西没跟过来"或"两边都在写" / after a move, something didn't come along, or both sides are writing
battle-tested-days: 13
battle-tested-since: 2026-09-20
executors: [Claude Code, Codex]
models-verified: [Claude Opus family, Claude Sonnet family]
license: MIT
---

# 记忆搬家 / Memory Migration

> 中文在前，English below.

## 中文

### 为什么需要这个 skill

记忆搬家最怕的不是"拷贝失败"——拷贝失败会报错。最怕的是**拷贝成功了，但拷的是错的东西**：

- 拷了一个正在被写的 SQLite 文件，得到的是 WAL 没合并的旧状态；
- 以为整套服务都在旧机器上，其实主环早就搬走了，"停旧→同步→起新"会把新机器上的**活数据覆盖成旧数据**；
- 两台机器各有一份"单写者"文件（例如提醒列表），搬一半后两边都在写，或者都没在写。

### 施工步骤（给 agent）

#### 第 0 步：先画真实拓扑，不信预案

对每个要搬的组件，**到两台机器上实测**，不要相信文档或预案：

```bash
systemctl list-units --type=service --state=running | grep -i <keyword>   # 两边都跑
ss -ltnp | grep <service-port>                                            # 谁在监听
ls -la --time-style=full-iso <DATA_DIR>/*.sqlite3*                         # 哪边的库最近还在写（看 -wal 的 mtime）
```

列一张表：组件 / 现在真正跑在哪 / 数据在哪 / 谁读谁写 / 依赖哪些隧道或反代。

**如果实测和预案不一致，停下来报告，按实测重新拍板。** 真实案例：预案写"整栈在旧机器"，实测发现消息主环和活数据库早就在新机器上且还在写——如果按预案执行"同步 state"，会把新机器的活数据覆盖掉。

#### 第 1 步：找出"单写者"和"不能拆开的耦合"

逐个问：

- 这个文件/库是不是**只能有一个写者**？（去重标记写回同一个 JSON、游标、队列目录……）
- 组件 A 写、组件 B 消费的队列，A 和 B 搬完以后还在同一台机器上吗？
- 有没有**跨机器共享同一个 SQLite**的打算？——有就停下。SQLite 不能跨主机共享写。

结论写成"必须一起搬的批次"。宁可整批搬，不要单搬一个和别人共享热状态的服务。

#### 第 2 步：导出（一致性快照）

```bash
TS=$(date -u +%Y%m%dT%H%M%SZ)
mkdir -p <BACKUP_ROOT>/migrate-$TS
sqlite3 <DATA_DIR>/memory.sqlite3 ".backup '<BACKUP_ROOT>/migrate-$TS/memory.sqlite3'"   # 不要 cp 活库
# 向量库：用它自己的快照/导出功能，或停写后整目录打包
tar czf <BACKUP_ROOT>/migrate-$TS/config.tgz <env files> <unit files>
```

**两边都做全量备份**（旧机器和新机器），即使新机器"还是空的"。

#### 第 3 步：校验导出物

```bash
sqlite3 <BACKUP_ROOT>/migrate-$TS/memory.sqlite3 "PRAGMA integrity_check;"
sqlite3 <BACKUP_ROOT>/migrate-$TS/memory.sqlite3 "SELECT count(*) FROM <memories_table>;"
sha256sum <BACKUP_ROOT>/migrate-$TS/* > <BACKUP_ROOT>/migrate-$TS/SHA256SUMS
```

记下关键表的行数、最新一条的时间戳、游标值。这是对账的基准。

#### 第 4 步：导入 + 起新服务

- 在新机器起服务前，确认旧机器的写者已经**停止**（不是 disable 而已，要 stop），否则会产生"两边都在写"。
- 环境变量、凭据文件逐个拷，权限设成 600。
- 端口冲突时换本地端口，用隧道/反代把对外地址保持不变——**让调用方的 URL 不用改**是最省事的迁移。
- 搬向量库时：确认 embedding 模型和维度两边一致。换模型 = 全量重算向量，不是搬家。

#### 第 5 步：对账

| 检查 | 方法 |
|---|---|
| 行数 | 关键表 count 与第 3 步一致（或只多不少） |
| 最新记录 | 新机器上能查到搬家前最后一条 |
| 读路径 | 真实调用一次召回/搜索，返回非空 |
| 写路径 | 写一条测试记忆，再查出来，再删掉 |
| 游标 | 消费者游标从断点继续，没有从 0 重放、也没有跳号 |
| 下游 | 依赖它的服务（聊天桥、worker、前端）都连上了新地址 |

#### 第 6 步：处理"没跟过来的东西"

逐项检查：定时器、单写者文件、上传目录、只在旧机器上存在的配置 drop-in、前端页面的当日修复。**列清单交给人拍板**，不要深夜擅自同步可能双投/漏投的数据（例如提醒）。

#### 第 7 步：留回滚路

旧机器上的服务 **stop + disable，但不删 unit 文件和数据**。回滚手册写成三步以内的命令。旧数据至少保留到对账通过后一周。

### 已知坑

- `cp` 一个开着 WAL 的活库 = 拿到旧状态。永远用 `.backup`。
- 按预案执行而不实测，是最危险的一步。
- 只搬"看起来独立"的服务，结果切断了它和队列消费者之间的同机耦合。
- 旧机器上的进程停了但没 `reset-failed`，监控会一直报红，容易被误判为故障。
- 搬完不清点前端页面：旧机器上当天才改的页面修复没有跟过来，两份副本开始漂移（见 [chat-frontend](../chat-frontend/SKILL.md)）。

---

## English

### Why this skill exists

The scary failure in a memory migration isn't "copy failed"; that errors loudly. It's **the copy succeeded, but copied the wrong thing**:

- you copied a live SQLite file and got a stale state with the WAL not merged;
- you assumed the whole stack was on the old box, but the main loop had already moved, so "stop old → sync → start new" would **overwrite live data on the new box with old data**;
- each box has its own "single-writer" file (e.g. a reminder list), and after a half-move both sides write it, or neither does.

### Build steps (for the agent)

#### Step 0: Map the real topology; don't trust the plan

For every component you'll move, **check on both machines**. Don't trust docs or the plan:

```bash
systemctl list-units --type=service --state=running | grep -i <keyword>   # run on both
ss -ltnp | grep <service-port>                                            # who is listening
ls -la --time-style=full-iso <DATA_DIR>/*.sqlite3*                         # which DB is still being written (check -wal mtime)
```

Make a table: component / where it really runs now / where its data lives / who reads and writes it / which tunnels or proxies it depends on.

**If reality disagrees with the plan, stop, report, and re-decide based on reality.** Real case: the plan said "the whole stack is on the old box"; checking showed the message loop and its live DB had long since moved to the new box and were still being written. Running the planned "sync state" step would have overwritten live data.

#### Step 1: Find single writers and inseparable couplings

Ask for each piece:

- Can this file/DB have **only one writer**? (dedupe flags written back to one JSON, cursors, queue directories…)
- For a queue that A writes and B consumes: will A and B still be on the same box afterwards?
- Is anyone planning to **share one SQLite across hosts**? If so, stop. SQLite can't be safely written across hosts.

Write the result as "batches that must move together". Move a whole batch rather than a single service that shares hot state with others.

#### Step 2: Export (consistent snapshot)

```bash
TS=$(date -u +%Y%m%dT%H%M%SZ)
mkdir -p <BACKUP_ROOT>/migrate-$TS
sqlite3 <DATA_DIR>/memory.sqlite3 ".backup '<BACKUP_ROOT>/migrate-$TS/memory.sqlite3'"   # never cp a live DB
# vector store: use its own snapshot/export, or stop writes and tar the directory
tar czf <BACKUP_ROOT>/migrate-$TS/config.tgz <env files> <unit files>
```

**Full backups on both machines**, even if the new one is "still empty".

#### Step 3: Verify the export

```bash
sqlite3 <BACKUP_ROOT>/migrate-$TS/memory.sqlite3 "PRAGMA integrity_check;"
sqlite3 <BACKUP_ROOT>/migrate-$TS/memory.sqlite3 "SELECT count(*) FROM <memories_table>;"
sha256sum <BACKUP_ROOT>/migrate-$TS/* > <BACKUP_ROOT>/migrate-$TS/SHA256SUMS
```

Record row counts of key tables, the newest record's timestamp, and cursor values. That's your reconciliation baseline.

#### Step 4: Import + start the new service

- Before starting on the new box, make sure writers on the old box are **stopped** (stop, not just disable), or you'll have two writers.
- Copy env and credential files one by one; chmod 600.
- On port conflicts, change the local port and use a tunnel/proxy so the public address stays the same. **Not making callers change their URL** is the cheapest migration.
- Moving a vector store: confirm the embedding model and dimension match. Changing models means recomputing every vector; that's not a move.

#### Step 5: Reconcile

| Check | How |
|---|---|
| Row counts | Key tables match step 3 (or only grew) |
| Newest record | The last pre-move record is queryable on the new box |
| Read path | One real recall/search returns non-empty |
| Write path | Write a test memory, read it back, delete it |
| Cursors | Consumers resume from the checkpoint: no replay from 0, no skipped range |
| Downstream | Everything that depends on it (bridge, workers, frontend) points at the new address |

#### Step 6: Handle what didn't come along

Check timers, single-writer files, upload directories, config drop-ins that only exist on the old box, and same-day frontend fixes. **List them for a human to decide.** Don't sync data that could double-send or drop (e.g. reminders) on your own late at night.

#### Step 7: Keep a way back

On the old box, **stop + disable services but keep unit files and data**. Write the rollback as three commands or fewer. Keep old data at least a week after reconciliation passes.

### Known pitfalls

- `cp` of a live DB with an open WAL = stale state. Always use `.backup`.
- Executing the plan without checking reality is the single most dangerous step.
- Moving a service that "looks independent" and cutting its same-host coupling to a queue consumer.
- Stopped-but-not-`reset-failed` units on the old box keep monitoring red and get mistaken for an outage.
- Not auditing frontend pages after the move: a same-day page fix on the old box didn't come along, and two copies start drifting (see [chat-frontend](../chat-frontend/SKILL.md)).
