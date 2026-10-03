---
name: backfill-rate-limit
description: >
  回填限速与幂等：大批量补算历史（补提炼、补整理、补印象）时，用确定性幂等键、错峰入队、分段推进、逐批汇总对账，避开 429、不重复写、随时可急停。
  Backfill with rate limits and idempotency: when re-processing a large history (re-extracting, re-curating, regenerating summaries),
  use deterministic idempotency keys, staggered enqueueing, segmented rollout, and per-batch reconciliation, so you avoid 429s, never double-write, and can stop at any time.
when-to-use:
  - 修好一条管道后，要把故障期间漏处理的数据补回来 / after fixing a pipeline, re-processing what it missed
  - 要对几百上千条历史记录调用模型 / calling a model on hundreds or thousands of historical rows
  - 回填跑到一半报 429、超时、或怀疑写了重复数据 / a backfill hits 429s, timeouts, or may have written duplicates
battle-tested-days: 2
battle-tested-since: 2026-10-02
executors: [Claude Code]
models-verified: [Claude Opus family]
license: MIT
---

# 回填限速与幂等 / Backfill Rate-limit & Idempotency

> 中文在前，English below.

## 中文

### 实战规模

一次真实回填：修复一条"真人消息被当成系统消息排除"的取数故障后，补提炼 3 天的漏网对话，共 **435 个任务**（首批 96 + 第二批 339），分 3 段、两天内跑完，**0 条重复写入、0 条最终失败**，中途零人工干预。打法如下。

### 施工步骤（给 agent）

#### 第 0 步：先确认积压不会自己追上

不要默认"修好了就会自动补"。逐个检查每条下游管道：

- 游标是否已经越过故障期？（越过了 = 不会回头处理）
- 故障期间的任务是不是已经被标成 done（例如"无有效内容"）？
- 实时通道在入库时是否根本没入队？

只回填**确实不会自己追上**的那几条；会自然追上的不要碰。

#### 第 1 步：回填工具的五个硬要求

1. **默认 dry-run**：不加 `--apply` 只统计（按段、按角色出数字）。
2. **确定性幂等键**：任务 ID = `backfill-<kind>:<源记录ID>`。重跑同一段只会撞键跳过，不会写第二份。
3. **走正规通道**：用和实时处理完全相同的入口与规则（包括现有的质量门、影子模式开关），不要写一条"回填专用"的捷径。
4. **错峰入队**：给每个任务的 `next_at` 依次加 `--spacing` 秒，由现有的单个消费者串行处理。不要另起并发 worker。
5. **逐批落日志**：每批写一行 JSONL（段、任务数、插入数、跳过数），作为对账依据。

#### 第 2 步：算好速度，再定 spacing

- 先跑一小批，测**真实单任务耗时**（实测往往比你设的间隔慢：设 20 秒，实际约 32 秒一个）。
- spacing ≥ 真实耗时，否则队列只会越积越长。
- 估算每段时长 = 任务数 × max(spacing, 真实耗时)，写进计划。
- 外部模型 API 有速率上限的，spacing 还要满足 `60 / spacing < 每分钟上限 × 安全系数(0.5)`。

#### 第 3 步：分段推进，段间对账

- 按时间切段（例如按天），**最近的先补**（最影响当下体验），旧的后补。
- 第一段跑完先停下对账，人确认后再继续；后续段可以用**自停用定时器**接力：上一段清零 → 自动入队下一段 → 全部完成后自己 disable，并设一个截止时间兜底。
- 对账查询：

```sql
SELECT status, count(*) FROM jobs WHERE id LIKE 'backfill-<kind>:%' GROUP BY 1;
```

  汇总每段：done / created / skipped / 仍在报错的 ID 列表。

#### 第 4 步：错误处理

- 单任务报错（超时、模型返回坏 JSON）走现有重试；日志逐条记 ID + attempts。
- 同一任务反复超时到上限：**标记"需要人工"并停止该项**，不要无限重试。
- 收到 429：加大 spacing，不要缩短。

#### 第 5 步：急停与回滚

写在计划里，开工前就准备好：

```sql
-- 急停：删掉还没开始的回填任务（已完成的不动）
DELETE FROM jobs WHERE id LIKE 'backfill-<kind>:%' AND status='queued';
```

- 回滚已写入的结果：凭证据表（结果 → 源记录 ID）找到回填产生的条目，归档而不是删除。
- 开工前做一次数据库热备（`.backup`）。

#### 第 6 步：注意对实时流量的挤占

回填任务和实时任务共用一个队列时，**积压会推迟新消息的处理**（认领按创建时间排序时尤其明显）。

- 选用户不活跃的时段跑，或给回填任务更低的优先级。
- 有"汇总类"任务（如每日印象）依赖回填结果的，要等回填完成后再重新生成，否则会按缺数生成。

### 不要回填的东西

- **状态类数据**（例如当前情绪、当前在线状态）：补算旧事件会把过时的波动叠加到现在。只回填"事实与记录"，不回填"状态"。

### 已知坑

- 假设"修好就会自动追上"，结果游标早已越过故障期。
- spacing 按理想值设，真实处理更慢，队列持续变长。
- 回填积压挤占实时队列，新消息的提炼被推迟。
- 用 `cp` 复制活库做 dry-run，读到 WAL 未合并的旧数据，统计数不准。

---

## English

### Real-world scale

One real backfill: after fixing a data-selection bug that excluded the user's real messages as "system messages", we re-extracted 3 days of missed conversation: **435 jobs** (first batch 96 + second batch 339), in 3 segments over two days, with **0 duplicate writes, 0 final failures**, and no manual intervention mid-run. Here's the playbook.

### Build steps (for the agent)

#### Step 0: Confirm the backlog won't catch up on its own

Don't assume "fixed means it'll backfill itself". Check every downstream pipeline:

- Has its cursor already passed the outage window? (If so, it won't go back.)
- Were outage-window jobs already marked done (e.g. "no valid content")?
- Did the real-time path never enqueue them at ingest?

Backfill **only** the pipelines that truly won't catch up. Leave the self-healing ones alone.

#### Step 1: Five hard requirements for the backfill tool

1. **Dry-run by default**: without `--apply`, only count (per segment, per role).
2. **Deterministic idempotency key**: job ID = `backfill-<kind>:<source record ID>`. Re-running a segment collides and skips; it never writes twice.
3. **Use the normal path**: same entry point and rules as real-time processing (including existing quality gates and shadow-mode flags). No "backfill-only" shortcut.
4. **Staggered enqueue**: offset each job's `next_at` by `--spacing` seconds and let the existing single consumer process them serially. Don't spin up concurrent workers.
5. **Log every batch**: one JSONL line per batch (segment, job count, inserted, skipped) as the reconciliation record.

#### Step 2: Measure, then set spacing

- Run a small batch first and measure **real per-job time** (it's often slower than your interval: set 20 s, actual ~32 s).
- spacing ≥ real per-job time, or the queue only grows.
- Estimate each segment = jobs × max(spacing, real time); put it in the plan.
- For external model APIs with rate limits, also require `60 / spacing < per-minute limit × 0.5 safety factor`.

#### Step 3: Segment and reconcile between segments

- Split by time (e.g. per day). **Most recent first** (it affects the present most), older later.
- Stop after the first segment, reconcile, and get a human's OK. Later segments can chain via a **self-disabling timer**: previous segment drains → next segment enqueued → timer disables itself when all are done, with a hard deadline as a backstop.
- Reconciliation:

```sql
SELECT status, count(*) FROM jobs WHERE id LIKE 'backfill-<kind>:%' GROUP BY 1;
```

  Summarize each segment: done / created / skipped / IDs still erroring.

#### Step 4: Errors

- Per-job errors (timeouts, bad JSON from the model) use the existing retry; log each ID + attempts.
- A job that keeps timing out until the cap: **mark it "needs human" and stop that item**. No infinite retries.
- On 429: increase spacing, never decrease.

#### Step 5: Emergency stop and rollback

Write these in the plan before starting:

```sql
-- emergency stop: delete backfill jobs not yet started (leave finished ones)
DELETE FROM jobs WHERE id LIKE 'backfill-<kind>:%' AND status='queued';
```

- Roll back written results via the evidence table (result → source record ID): archive, don't delete.
- Take a hot DB backup (`.backup`) before starting.

#### Step 6: Watch out for starving real-time traffic

When backfill and real-time jobs share a queue, **the backlog delays new messages** (especially when claims are ordered by creation time).

- Run when the user is inactive, or give backfill jobs lower priority.
- Summary jobs (e.g. daily impressions) that depend on backfill results must be regenerated after the backfill finishes, or they'll be built from incomplete data.

### What not to backfill

- **State data** (e.g. current mood, current presence): replaying old events stacks stale swings onto the present. Backfill facts and records, not state.

### Known pitfalls

- Assuming "fixed means it catches up" while the cursor had already passed the outage.
- Setting spacing to the ideal value while real processing is slower; the queue keeps growing.
- Backfill backlog crowding out the real-time queue, delaying extraction of new messages.
- Dry-running against a `cp` of the live DB, reading a stale pre-WAL state and getting wrong counts.
