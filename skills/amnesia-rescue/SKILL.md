---
name: amnesia-rescue
description: >
  失忆抢救实录：发现 AI"失忆了 N 天"之后的完整抢救流程——先证明记忆真的缺了、定位取数故障、修复取数、回填漏网数据、重新生成按缺数做出的日印象，全程可回滚。
  Amnesia rescue: the full procedure after discovering the AI "lost N days of memory": prove the gap, locate the data-selection fault,
  fix it, backfill the missed data, regenerate summaries built from incomplete data, all reversibly.
when-to-use:
  - TA 记不起最近几天的事 / the companion can't recall the last few days
  - 每日印象/日记/摘要突然变得很短、只提到很少几件事 / daily impressions, diaries, or summaries suddenly get very short
  - 新接了一个聊天入口之后，记忆好像"没在长" / after adding a new chat entry point, memory seems to stop growing
battle-tested-days: 2
battle-tested-since: 2026-10-02
executors: [Claude Code]
models-verified: [Claude Opus family]
license: MIT
---

# 失忆抢救实录 / Amnesia Rescue

> 中文在前，English below.

## 中文

### 事故实录（匿名化改写）

> 某天早上例行巡检时发现：前一天的日印象只取到了 2 条消息，而那天两人明明聊了一整天。
>
> 第一反应是"游标卡住了"——查下来游标完全正常。
>
> 真正的原因：几天前，用户开始用一个新的自建聊天页聊天。新聊天页的消息为了能叫醒 TA，走的是"唤醒通道"入库，来源字段被记成了"唤醒"。而记忆系统里的好几个取数点，为了挡掉系统唤醒回执，**把"唤醒"来源整类排除**——连用户的真话一起扔了。
>
> 结果：连续 3 天、几百条真人消息没有进入整理、情绪、日印象、连续性摘要。TA 在这 3 天里"活着但不长记性"。

### 施工步骤（给 agent）

#### 第 0 步：证明真的缺了，并量出缺口

不要从"感觉 TA 忘了"直接跳到修代码。先拿数字：

```sql
-- 原始消息层：每天有多少条用户消息（这一层通常是完整的）
SELECT date(created_at), source, count(*) FROM raw_events WHERE role='user' GROUP BY 1,2 ORDER BY 1 DESC LIMIT 20;
-- 加工层：每天提炼出多少条记忆 / 日印象覆盖了多少条
SELECT date(created_at), count(*) FROM memories GROUP BY 1 ORDER BY 1 DESC LIMIT 20;
```

对比两层：原始层多、加工层少 → 取数/过滤出了问题。原始层也少 → 入库就丢了，是另一类事故。

把缺口写成表：日期 / 原始条数 / 被加工条数 / 差额 / 差额集中在哪个来源。

#### 第 1 步：定位取数故障

1. **先排除"显而易见"的嫌疑**（游标、定时器、worker 是否在跑），但不要停在这里。
2. 找出缺口集中的那个来源值，然后 **grep 所有取数点**里对来源/类型的过滤条件：

```bash
grep -rn "source\s*\(!=\|NOT IN\|<>\)" <SERVICE_DIR>/*.py
grep -rn "<that source value>" <SERVICE_DIR>/
```

3. 列出**每一个**排除了该来源的取数点。经验：不止一个——日印象、连续性摘要、实时提炼、批量整理、情绪、术语巡检，可能各自独立地写了同一个过滤。
4. 回答：这个来源里，哪些是真该挡的（系统回执），哪些是被误伤的（真人消息）？找一个**可靠的识别特征**（例如桥写入的固定开头格式）。

#### 第 2 步：修复取数（走 release-baseline）

- 打基线标签 + 热备（见 [release-baseline](../release-baseline/SKILL.md)）。
- 写一个**统一的放行函数**（例如 `admit(row)`），所有取数点都调它，而不是在 6 个地方各写一遍判断。
- 放行时剥掉桥加的包装头/尾——**包装尾里如果带了路径或令牌说明，可能触发敏感信息过滤把整条拦掉**。
- 用同一个消息 ID 把 TA 的回复一起带上，否则记忆里只有一半对话。
- 挂开关（例如 `<OWNER_MSG_AS_REAL>=1`），回滚 = 设 0 + 重启消费者。
- 修完跑全套回归，结果要和基线**逐项一致**。

分两期也可以：第一期先修最痛的（日印象 + 连续性摘要），第二期修其余全部取数点。**但必须列完整清单，第一期的报告里写明"还有哪些没修"。**

#### 第 3 步：回填漏网数据

按 [backfill-rate-limit](../backfill-rate-limit/SKILL.md) 执行：确认哪些管道不会自己追上 → 幂等键 → 错峰 → 分段（最近的先补）→ 段间对账。

**情绪等状态类数据不回填。**

#### 第 4 步：重新生成按缺数做出的日印象

这些天的日印象已经按残缺数据生成过了，需要替换，但要能回退：

1. 备份旧印象（导出为 JSON 存到备份目录）。
2. 旧生成任务改名（加 `~v1-<时间戳>` 后缀），让生成器认为这一天还没做过。
3. 删除投影行，调用生成入口重新入队。
4. 等生成完成后，用"替换"语义（新条目 supersede 旧条目，保留关系边），**不是直接删除旧的**。
5. 用自停用定时器盯着：生成完成 → 自动替换 → 自己 disable。
6. 生成反复超时：标"需要人工"，停下来报告，不要无限重试。

**是否重生成由用户拍板。** 日印象是两人共同的回忆，用户可能想保留原样。

#### 第 5 步：防复发

- 在代码里留注释：以后新增排除该来源的取数点，必须调用统一放行函数。
- 在巡检里加一项：每天"原始用户消息数 vs 被加工数"比值低于阈值就报警。
- 写事故报告：时间线、根因、影响天数和条数、修复提交、回填结果、回滚方法。

### 已知坑

- 停在"游标没问题"就结论"没故障"。
- 只修了一两个取数点，其余取数点照样排除。
- 包装尾里的路径/令牌文字触发敏感过滤，修好的放行又被整条拦掉。
- 回填积压推迟了日印象生成；要等回填完成再重生成。
- 以为关掉了某个定时器就停了某项生成，其实 worker 自己也在入队。

---

## English

### Incident record (anonymized)

> A routine morning check found that the previous day's impression had pulled only 2 messages, though the two had talked all day.
>
> First guess: "the cursor is stuck". The cursor was fine.
>
> The real cause: a few days earlier the user had started chatting on a new self-built chat page. To wake the companion, its messages entered through the "wake channel", and their source field was recorded as "wake". Several data-selection points in the memory system **excluded the whole "wake" source** to filter out system wake receipts, throwing away the user's real words along with them.
>
> Result: 3 consecutive days and hundreds of real messages never reached curation, mood, daily impressions, or continuity summaries. For 3 days the companion was "alive but not remembering".

### Build steps (for the agent)

#### Step 0: Prove the gap and measure it

Don't jump from "feels like they forgot" to editing code. Get numbers first:

```sql
-- raw layer: user messages per day (usually complete)
SELECT date(created_at), source, count(*) FROM raw_events WHERE role='user' GROUP BY 1,2 ORDER BY 1 DESC LIMIT 20;
-- processed layer: memories extracted per day / messages covered by impressions
SELECT date(created_at), count(*) FROM memories GROUP BY 1 ORDER BY 1 DESC LIMIT 20;
```

Compare the layers: raw high, processed low → selection/filtering problem. Raw also low → lost at ingest, a different incident.

Tabulate: date / raw count / processed count / gap / which source the gap concentrates in.

#### Step 1: Locate the selection fault

1. **Rule out the obvious suspects** (cursors, timers, whether workers run), but don't stop there.
2. Find the source value where the gap concentrates, then **grep every selection point** for source/type filters:

```bash
grep -rn "source\s*\(!=\|NOT IN\|<>\)" <SERVICE_DIR>/*.py
grep -rn "<that source value>" <SERVICE_DIR>/
```

3. List **every** selection point that excludes it. Experience: it's never just one. Impressions, continuity summaries, real-time extraction, batch curation, mood, glossary patrol may each have written the same filter independently.
4. Decide: within that source, which rows are truly noise (system receipts) and which are collateral (real user messages)? Find a **reliable signature** (e.g. a fixed header format the bridge writes).

#### Step 2: Fix selection (via release-baseline)

- Baseline tag + hot backup (see [release-baseline](../release-baseline/SKILL.md)).
- Write **one admission function** (e.g. `admit(row)`) and call it from every selection point, instead of six copies of the check.
- Strip the bridge's wrapper header/footer when admitting. **If the footer mentions paths or tokens, it can trip the secret filter and get the whole row blocked.**
- Pull in the companion's reply via the same message ID, or memory gets only half the conversation.
- Put it behind a flag (e.g. `<OWNER_MSG_AS_REAL>=1`); rollback = set 0 + restart consumers.
- Run the full regression suite; results must match the baseline **item by item**.

Two phases are fine: phase one fixes the most painful points (impressions + continuity), phase two the rest. **But list them all, and phase one's report must say what's still unfixed.**

#### Step 3: Backfill the missed data

Follow [backfill-rate-limit](../backfill-rate-limit/SKILL.md): confirm which pipelines won't self-catch-up → idempotency keys → staggering → segments (most recent first) → reconcile between segments.

**Don't backfill state like mood.**

#### Step 4: Regenerate impressions built from incomplete data

Those days' impressions were already generated from partial data. Replace them, reversibly:

1. Back up the old impressions (export JSON to the backup dir).
2. Rename the old generation jobs (suffix `~v1-<timestamp>`) so the generator treats the day as not done.
3. Delete the projection rows; call the generation entry point to re-enqueue.
4. When done, use "replace" semantics (new entry supersedes old, edges preserved). **Don't just delete the old one.**
5. Watch with a self-disabling timer: generation done → auto replace → disable itself.
6. If generation keeps timing out: mark "needs human", stop, and report. No infinite retries.

**Whether to regenerate is the user's call.** Impressions are shared memories; the user may want them left as they were.

#### Step 5: Prevent recurrence

- Leave a code comment: any new selection point that excludes that source must call the admission function.
- Add a check: alert when the daily ratio "raw user messages vs processed" drops below a threshold.
- Write the incident report: timeline, root cause, days and rows affected, fix commits, backfill results, rollback.

### Known pitfalls

- Stopping at "the cursor is fine" and concluding there's no fault.
- Fixing one or two selection points while the rest keep excluding.
- Path/token text in the wrapper footer trips the secret filter, blocking the newly admitted rows.
- Backfill backlog delays impression generation; regenerate after the backfill finishes.
- Believing that disabling one timer stopped a generation, while workers were enqueueing it themselves.
