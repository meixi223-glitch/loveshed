---
name: worker-dispatch-acceptance
description: >
  派单验收规范：主 agent 给 worker 写工单、收报告、验收的规矩——边界写死、红线写明、报告格式固定，"一行报告"打回重报，同一个库同一时间只许一队施工。
  Worker dispatch & acceptance: how a lead agent writes tickets for workers, receives reports, and accepts work. Hard boundaries,
  explicit red lines, a fixed report format, one-line reports sent back, and only one crew working on a given repo/DB at a time.
when-to-use:
  - 要把活派给另一个 agent / worker / 编码助手 / handing work to another agent, worker, or coding assistant
  - worker 交回来的报告看不出做了什么 / a worker's report doesn't show what was done
  - 多个 worker 可能同时改同一个服务或数据库 / several workers may touch the same service or database at once
battle-tested-days: 12
battle-tested-since: 2026-09-21
executors: [Claude Code, Codex]
models-verified: [Claude Opus family, Claude Sonnet family]
license: MIT
---

# 派单验收规范 / Worker Dispatch & Acceptance

> 中文在前，English below.

## 中文

### 为什么需要这个 skill

自建的家里，真正动手的往往是一串 worker：主 agent 接到用户的需求，拆成工单派出去，worker 施工、交报告，主 agent 验收后再告诉用户。链条上任何一环含糊，结果就是：

- worker 顺手改了不该改的东西；
- 报告只有一行"已完成"，没人知道改了什么、怎么回滚；
- 两个 worker 同时改同一个库，互相覆盖；
- worker 重启服务时把自己（或主会话）杀了。

### 一、写工单（派单方）

每张工单必须有这 7 段，缺一段不发：

```markdown
## 目标
一句话：做完之后，什么东西会变成什么样。

## 背景与现场
已知事实 + 相关文件/服务（用占位或真实路径，视 worker 是否在同一台机器）。
写明"哪些是你需要先自己核实的"。

## 范围（只许动这些）
- 文件/服务/表清单

## 红线（绝对不许）
- 不改 <X>；不重启 <Y>；不删任何数据；不往真实对话里发测试消息；不在公开位置写密钥……
- 遇到需要越界的情况：停下、写进报告、等拍板。

## 验收标准
- 可检查的条件（命令 + 预期输出），而不是"能用了"。

## 回滚要求
- 动手前打基线标签/热备（见 release-baseline）；报告里写回滚命令。

## 报告格式
（见下文第三节，原样贴进工单）
```

要点：

- **边界用清单，不用形容词。** "小心一点"不是边界；"只改 `a.py` 和 `b.html`，不碰数据库"才是。
- **把"已知的坑"写进背景**，别让 worker 再踩一遍（例如：这个进程在你的 cgroup 里，直接重启会杀掉你自己）。
- **测试数据走假后端。** 工单里写明 staging/假入口在哪；没有就让 worker 先搭一个。

### 二、同库禁止两队同时施工

- 同一个代码仓库、同一个数据库、同一个服务，**同一时间只能有一张"施工中"的工单**。
- 派单前查一下：有没有还没验收的工单在动同一个目标？有就排队，或者合并成一张。
- 只读调查可以并行；任何写操作（改代码、改表、重启）不行。
- 如果必须并行（比如前端和后端两队），工单里写清楚**各自的文件清单不重叠**，并指定谁负责最后的整体重启。

### 三、报告格式（worker 交回）

```markdown
## 结论
一两句：做成了没有；没做成卡在哪。

## 做了什么
- 改动清单：文件 / 提交号 / 标签
- 动过的服务：重启了哪些、什么时候

## 证据
- 验收标准逐条：命令 + 实际输出（截取关键行）

## 没做 / 越界待拍板
- 发现了但按红线没动的问题

## 回滚
- 开关级 / 代码级 / 数据级 各一条命令

## 备份位置
```

### 四、验收（派单方）

1. **"一行报告"直接打回重报。** 只有"已完成""OK""搞定了"这类报告，不验收、不转述给用户，原工单回复："按报告格式重报，缺：<段名>"。
2. 逐条复核验收标准：至少亲自重跑一条关键命令，不完全信报告里的输出。
3. 看"没做 / 越界待拍板"一节：有内容就转给用户决定，不要自己顺手做。
4. 检查红线：`git diff <baseline-tag>` 看实际改动是否超出范围清单。
5. 通过后再告诉用户；转述时保留回滚方法。

### 五、worker 运行时的安全规矩

- worker 要重启的服务如果和 worker 自己（或主会话）在同一个进程树/cgroup 里：用**脱离的延迟重启**，并先写完报告。
- 长任务设墙钟上限；超时后主 agent 去查现场，而不是直接重派一张一样的工单（可能前一个还在跑）。
- worker 的凭据最小化：只给这张单需要的那一把钥匙。

### 已知坑

- 工单没写红线，worker 顺手"优化"了别的服务。
- 收到一行报告就转告用户"做好了"，第二天发现只做了一半。
- 两张工单同时改同一个库：后合并的覆盖了先合并的。
- worker 重启了自己所在的服务，报告没写完就断了。
- 超时后重派同一张单，结果两个 worker 同时在跑。

---

## English

### Why this skill exists

In a self-built home, the hands-on work is often a chain of workers: the lead agent takes the user's request, splits it into tickets, workers build and report, and the lead accepts and tells the user. If any link is vague:

- a worker "helpfully" changes something it shouldn't;
- the report is one line, "done", and nobody knows what changed or how to roll back;
- two workers modify the same DB at once and overwrite each other;
- a worker restarts a service and kills itself (or the main session).

### 1. Writing the ticket (dispatcher)

Every ticket has these 7 sections; if one is missing, don't send it:

```markdown
## Goal
One sentence: when done, what will be in what state.

## Background & site
Known facts + relevant files/services (placeholders or real paths depending on whether the worker is on the same box).
State what the worker must verify for itself first.

## Scope (only these may change)
- list of files/services/tables

## Red lines (never)
- don't modify <X>; don't restart <Y>; delete no data; send no test messages into the real conversation; write no secrets anywhere public…
- If crossing a line seems necessary: stop, put it in the report, wait for a decision.

## Acceptance criteria
- Checkable conditions (command + expected output), not "it works".

## Rollback requirements
- Baseline tag / hot backup before touching anything (see release-baseline); rollback commands in the report.

## Report format
(Section 3 below, pasted verbatim into the ticket)
```

Key points:

- **Boundaries are lists, not adjectives.** "Be careful" is not a boundary; "only change `a.py` and `b.html`, don't touch the DB" is.
- **Put known pitfalls in the background** so the worker doesn't step on them again (e.g. "this process is in your cgroup; a direct restart kills you").
- **Test data goes to a fake backend.** Say where staging/fake entry points are; if there are none, have the worker build one first.

### 2. One crew per repo/DB at a time

- For a given code repo, database, or service, **only one ticket may be "in progress" at a time**.
- Before dispatching, check whether an unaccepted ticket is touching the same target. If so, queue, or merge them into one.
- Read-only investigation may run in parallel; any write (code, schema, restart) may not.
- If parallel work is unavoidable (e.g. frontend and backend crews), the tickets must state **non-overlapping file lists** and name who does the final full restart.

### 3. Report format (worker returns)

```markdown
## Conclusion
One or two sentences: done or not; if not, where it's stuck.

## What was done
- Changes: files / commits / tags
- Services touched: which restarted, when

## Evidence
- Each acceptance criterion: command + actual output (key lines)

## Not done / out of scope, awaiting decision
- Issues found but left alone per red lines

## Rollback
- One command each: flag / code / data

## Backup location
```

### 4. Acceptance (dispatcher)

1. **One-line reports go straight back.** "Done", "OK", "fixed" alone: don't accept, don't relay to the user. Reply on the same ticket: "Re-report in the required format; missing: <section names>".
2. Re-check acceptance criteria: personally re-run at least one key command. Don't fully trust the output in the report.
3. Read "not done / awaiting decision": if non-empty, pass it to the user; don't quietly do it yourself.
4. Check red lines: `git diff <baseline-tag>` to confirm changes stay within the scope list.
5. Only then tell the user, and keep the rollback method in what you relay.

### 5. Runtime safety for workers

- If a service the worker must restart shares a process tree/cgroup with the worker (or the main session), use a **detached delayed restart** and finish the report first.
- Give long tasks a wall-clock cap. On timeout, the lead inspects the site instead of re-dispatching an identical ticket (the first may still be running).
- Minimal credentials: give the worker only the one key this ticket needs.

### Known pitfalls

- No red lines in the ticket; the worker "optimized" another service.
- Relaying a one-line report to the user as "done", then discovering the next day it was half done.
- Two tickets editing the same repo at once: the later merge overwrote the earlier.
- A worker restarted the service it lived in and died mid-report.
- Re-dispatching after a timeout while the first worker was still running.
