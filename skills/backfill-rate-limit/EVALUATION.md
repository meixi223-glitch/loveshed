# 评测卡 / Evaluation Card — backfill-rate-limit

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | backfill-rate-limit |
| 首次实装日期 / First deployed | 2026-10-02 |
| 实装天数 / Days in production | 2（截至 2026-10-03）/ 2 (as of 2026-10-03) |
| 使用环境 / Environment | 自托管 Python 记忆服务 + SQLite 任务队列 + 单个串行消费者，外部小模型做提炼 / self-hosted Python memory service + SQLite job queue + one serial consumer, external small model for extraction |
| 执行者 / Executed by | Claude Code |
| 维护者 / Maintainer | yumei & Jin |

> 实装天数短，如实标注。打法只经历过一次大回填（3 段），规模和结果见下。
> Short track record, stated honestly. The playbook has been through one large backfill (3 segments); scale and results below.

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 2 天，一次完整回填：435 个任务分 3 段（96 / 132 / 207），spacing 20 秒；最终 435 全部 done，新写入记忆 311 条（72 / 91 / 148），0 重复、0 最终失败。第 2→3 段由自停用定时器接力，完成后自动停用。
- 2 days, one full backfill: 435 jobs in 3 segments (96 / 132 / 207), spacing 20 s; all 435 done, 311 new memories written (72 / 91 / 148), 0 duplicates, 0 final failures. Segment 2→3 was chained by a self-disabling timer that turned itself off when finished.

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 修复 / skill 的改动 Fix / skill change |
|---|---|---|---|
| 2026-10-02 | 修好取数后，漏掉的数据没有自动补上 / After fixing selection, missed data didn't backfill itself | 批量游标已越过故障期，那段任务已按"无有效内容"标 done；实时通道入库时根本没入队 / The batch cursor had passed the outage; those jobs were marked done as "no valid content"; real-time never enqueued them | 第 0 步：逐条管道确认会不会自己追上 / Step 0: check each pipeline for self-catch-up |
| 2026-10-02 | 回填推迟了每日印象的生成 / Backfill delayed daily-impression generation | 队列认领时提炼任务优先于印象任务 / The queue claimed extraction before impressions | 第 6 步：汇总类任务等回填完再重生成 / Step 6: regenerate summaries after backfill |
| 2026-10-03 | 实际约 32 秒/任务，比 20 秒间隔慢，积压推迟了新聊天的实时提炼 / ~32 s per job vs 20 s spacing; backlog delayed real-time extraction of new chats | 认领按创建时间排序 / Claims ordered by creation time | 第 2 步：先测真实耗时再定 spacing；第 6 步 / Step 2: measure before setting spacing; step 6 |
| 2026-10-03 | 4 个任务超时/坏 JSON 重试 / 4 jobs retried after timeouts / bad JSON | 外部模型偶发慢与格式错 / Occasional slow or malformed model output | 第 4 步：逐条记录，重试后全部完成 / Step 4: logged per ID; all completed on retry |

### 3. 换模型还能用吗？/ Survives a model switch?

- 验证过 / Verified: Claude Opus 系列执行。/ Executed by the Claude Opus family.
- 未经历 / Not yet: 其他执行者。流程是 SQL + 一个 CLI 脚本，预计不依赖模型特有能力，但没有实测。/ Other executors. The flow is SQL + a CLI script and shouldn't depend on model-specific features, but that's untested.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 队列、结果、日志都在本地库 / Queue, results, and logs all in the local DB |
| 隐私 / Privacy | ⚠️ | 回填会把历史对话再发给外部提炼模型一遍；和实时处理用的是同一服务商，没有新增去处 / Backfill sends historical conversation to the external extraction model again; same provider as real-time, no new destination |
| 持久性 / Durability | ✅ | 幂等键 + 急停 SQL + 热备，任何时刻可停可退 / Idempotency keys + stop SQL + hot backup; stop or roll back anytime |

## 卧室门检查 / Bedroom-door check

- [x] 只补"记录与事实"，不补情绪状态，不改写任何对话原文。/ Backfills records and facts only; never mood state; never rewrites conversation text.

## 执行证据 / Execution evidence

- 回填执行日志为逐事件 JSONL：入队、段完成（done/created/skipped/影子拦截数）、单任务报错与重试、定时器安装与自停用，全部带时间戳。
- The execution log is per-event JSONL: enqueue, segment completion (done/created/skipped/shadow-blocked), per-job errors and retries, timer install and self-disable, all timestamped.
