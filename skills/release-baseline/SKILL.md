---
name: release-baseline
description: >
  发版基线与回滚：动任何线上组件前，先 git init + 基线标签 + 数据热备 + 开关，保证"回滚不丢改动、出事秒级退"。
  Release baseline & rollback: before touching any live component, git init + baseline tag + hot data backup + feature flag,
  so rollback never loses work and failures can be reverted in seconds.
when-to-use:
  - 要改正在运行的记忆服务、聊天桥、前端等组件 / about to modify a running memory service, bridge, frontend, etc.
  - 发现生产目录不是 git 仓库 / a production directory is not under git
  - 需要写回滚方案 / a rollback plan is needed
battle-tested-days: 11
battle-tested-since: 2026-09-22
executors: [Claude Code, Codex]
models-verified: [Claude Opus family, Claude Sonnet family]
license: MIT
---

# 发版基线与回滚 / Release Baseline & Rollback

> 中文在前，English below.

## 中文

### 一条血的教训

> 某次回滚之后，之前一整版的改动全没了。原因很简单：那个生产目录**根本不是 git 仓库**。"回滚"就是把备份文件拷回去，备份之后做的所有改动一起被覆盖，再也找不回来。

所以本 skill 的第一条规则是：**没有 git 基线，不许动线上代码。**

### 施工步骤（给 agent）

#### 第 0 步：确认现场

对每个要改的目录 `<SERVICE_DIR>`：

```bash
git -C <SERVICE_DIR> rev-parse --is-inside-work-tree   # 失败 = 不是 git，先做第 1 步
git -C <SERVICE_DIR> status --short                   # 有未提交改动？先记录，别丢
```

同时列出：这个组件的数据库/数据目录 `<DATA_DIR>`、systemd 单元或启动方式、依赖它的其他进程（消费者、worker）。

#### 第 1 步：纳入 git（如果还不是）

```bash
cd <SERVICE_DIR>
git init
cat >> .gitignore <<'IGN'
__pycache__/
*.pyc
*.db
*.sqlite3
*.bak-*
backups/
.env
*.token
IGN
git add -A && git commit -m "baseline: production as-is"
```

**先 `git status` 检查一遍要提交的文件**：密钥、令牌、数据库、日志绝不能进仓库。

#### 第 2 步：打基线标签

```bash
git tag pre-<change>-baseline-$(date -u +%Y%m%dT%H%M%SZ)
```

多个仓库一起改时，**所有仓库打同一个时间戳的标签**，回滚点一目了然。

#### 第 3 步：数据热备

```bash
mkdir -p <BACKUP_ROOT>/<change>-<timestamp>
sqlite3 <DATA_DIR>/<db>.sqlite3 ".backup '<BACKUP_ROOT>/<change>-<timestamp>/<db>.sqlite3'"   # 在线一致性备份，别直接 cp 正在写的库
tar czf <BACKUP_ROOT>/<change>-<timestamp>/config.tgz <config files>
```

在备份目录放一个 `README`：备份了什么、对应哪个标签、怎么还原。

#### 第 4 步：改动走分支 + 开关

- 新建分支 `feature/<change>`，合并后打标签 `<change>`。
- 行为变化挂在**环境变量开关**后面，默认关闭（或 shadow 模式：只记录不生效）。开关 = 秒级回滚，不用动 git。
- 数据库只做**加法迁移**（加表、加列），回滚时不需要删任何东西。

#### 第 5 步：重启要整批、要安全

- 给表加了列，就要**把主进程和所有读写这张表的消费者同批重启**，否则旧进程会拿旧 schema 写坏数据。
- 如果你（agent）自己就跑在要重启的服务里（同一个 cgroup / 进程树），直接重启会把你自己杀掉。用**脱离的延迟重启**：
  ```bash
  systemd-run --on-active=30s --unit=delayed-restart-<change> systemctl restart <unit>
  ```
  并在重启前先把报告写完。

#### 第 6 步：写回滚手册

在报告里按三档写清楚：

| 档 | 动作 | 耗时 |
|---|---|---|
| 开关级 | `<FLAG>=0` + 重启 | 秒级 |
| 代码级 | `git checkout <baseline-tag>` + 重启 | 分钟级 |
| 数据级 | 从热备还原数据库 | 分钟级，最后手段 |

#### 第 7 步：验收

跑一遍"不回归"检查（健康检查端点、关键功能冒烟），并**实际演练一次开关回滚**，确认能退。

### 已知坑

- 备份 ≠ 版本控制。只有备份，回滚会覆盖掉备份后的所有改动。
- `.gitignore` 漏写会把密钥提交进历史；一旦推到公开仓库，只能吊销密钥。
- 只重启主进程、忘了消费者，是加列迁移最常见的事故。

---

## English

### The lesson that started this

> After one rollback, an entire version's worth of changes was gone. The reason was simple: the production directory **wasn't a git repository**. "Rollback" meant copying backup files over the live ones, which overwrote every change made after the backup, permanently.

So rule one of this skill: **no git baseline, no touching live code.**

### Build steps (for the agent)

#### Step 0: Survey

For each directory `<SERVICE_DIR>` you'll change:

```bash
git -C <SERVICE_DIR> rev-parse --is-inside-work-tree   # fails = not git, do step 1 first
git -C <SERVICE_DIR> status --short                   # uncommitted changes? record them, don't lose them
```

Also list the component's database/data directory `<DATA_DIR>`, its systemd unit or launch method, and every other process that depends on it (consumers, workers).

#### Step 1: Put it under git (if it isn't)

```bash
cd <SERVICE_DIR>
git init
cat >> .gitignore <<'IGN'
__pycache__/
*.pyc
*.db
*.sqlite3
*.bak-*
backups/
.env
*.token
IGN
git add -A && git commit -m "baseline: production as-is"
```

**Review `git status` before committing.** Secrets, tokens, databases, and logs must never enter the repo.

#### Step 2: Tag the baseline

```bash
git tag pre-<change>-baseline-$(date -u +%Y%m%dT%H%M%SZ)
```

When several repos change together, **tag them all with the same timestamp** so the rollback point is obvious.

#### Step 3: Hot-backup the data

```bash
mkdir -p <BACKUP_ROOT>/<change>-<timestamp>
sqlite3 <DATA_DIR>/<db>.sqlite3 ".backup '<BACKUP_ROOT>/<change>-<timestamp>/<db>.sqlite3'"   # consistent online backup; don't cp a DB that's being written
tar czf <BACKUP_ROOT>/<change>-<timestamp>/config.tgz <config files>
```

Add a `README` in the backup directory: what's in it, which tag it matches, how to restore.

#### Step 4: Branch + feature flag

- Work on `feature/<change>`; after merging, tag `<change>`.
- Put behavior changes behind an **environment-variable flag**, off by default (or shadow mode: log only, no effect). A flag gives you rollback in seconds without touching git.
- Database migrations are **additive only** (new tables, new columns), so rollback never needs to delete anything.

#### Step 5: Restart in batches, safely

- If you added a column, **restart the main process and every consumer of that table together**. Otherwise old processes write with the old schema and corrupt data.
- If you (the agent) are running inside the service you're restarting (same cgroup/process tree), a direct restart kills you. Use a **detached delayed restart**:
  ```bash
  systemd-run --on-active=30s --unit=delayed-restart-<change> systemctl restart <unit>
  ```
  Finish writing your report before triggering it.

#### Step 6: Write the rollback runbook

Three tiers in the report:

| Tier | Action | Time |
|---|---|---|
| Flag | `<FLAG>=0` + restart | seconds |
| Code | `git checkout <baseline-tag>` + restart | minutes |
| Data | restore DB from hot backup | minutes, last resort |

#### Step 7: Acceptance

Run a no-regression check (health endpoint, smoke test of key features), and **actually rehearse one flag rollback** to prove you can go back.

### Known pitfalls

- A backup is not version control. With backups alone, rollback overwrites everything done after the backup.
- A missing `.gitignore` entry commits secrets into history; once pushed publicly, the only fix is revoking the secret.
- Restarting the main process but forgetting the consumers is the most common add-column incident.
