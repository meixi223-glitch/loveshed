# 评测卡 / Evaluation Card — amnesia-rescue

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | amnesia-rescue |
| 首次实装日期 / First deployed | 2026-10-02 |
| 实装天数 / Days in production | 2（截至 2026-10-03）/ 2 (as of 2026-10-03) |
| 使用环境 / Environment | 自托管 Python 记忆服务（原始事件层 + 加工层 + 每日印象 + 连续性摘要）+ SQLite + 多个后台消费者 / self-hosted Python memory service (raw events + processed layer + daily impressions + continuity summaries) + SQLite + several background consumers |
| 执行者 / Executed by | Claude Code |
| 维护者 / Maintainer | yumei & Jin |

> 本 skill 来自一次完整的真实抢救，只经历过这一次。实装天数短，如实标注。
> Distilled from one complete real rescue, the only one so far. Short track record, stated honestly.

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 2 天，一次完整抢救：发现（日印象只取到 2 条）→ 定位（来源整类排除，非游标）→ 两期修复（第一期 2 个取数点，第二期其余 6 类取数点，全套回归与基线一致）→ 回填 435 个任务 → 重生成 3 天日印象（2 天已替换成功，1 天因反复超时标"需人工"）。
- 2 days, one complete rescue: discovery (impression pulled only 2 messages) → localization (whole-source exclusion, not the cursor) → two-phase fix (phase 1: 2 selection points; phase 2: the remaining 6 kinds; full regression matched baseline) → backfill of 435 jobs → regeneration of 3 days of impressions (2 replaced successfully; 1 marked "needs human" after repeated timeouts).

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 修复 / skill 的改动 Fix / skill change |
|---|---|---|---|
| 2026-10-02 | 3 天、约 220 条真人消息未进入记忆加工 / 3 days, ~220 real user messages never processed | 新聊天入口经唤醒通道入库，多个取数点整类排除该来源 / A new chat entry ingested via the wake channel; several selection points excluded that source wholesale | 本 skill 第 0–2 步 / Steps 0–2 |
| 2026-10-02 | 初判是游标卡住 / First guess: stuck cursor | 游标正常，是过滤条件 / Cursor fine; it was a filter | 第 1 步：排除显而易见的嫌疑后不要停 / Step 1: don't stop after ruling out the obvious |
| 2026-10-02 | 放行后的消息仍被拦 / Admitted messages still blocked | 包装尾里有令牌路径说明，触发敏感过滤 / Wrapper footer mentioned a token path, tripping the secret filter | 第 2 步：放行时剥包装头尾 / Step 2: strip wrapper on admit |
| 2026-10-02 | 第一期只修了 2 处，其余 6 类取数点照样排除 / Phase 1 fixed 2 points; 6 kinds kept excluding | 同一过滤在多处独立实现 / The same filter implemented independently in many places | 第 1 步列全清单；统一放行函数 / Step 1 full list; one admission function |
| 2026-10-03 | 一天的日印象重生成反复超时 / One day's impression regeneration kept timing out | 当天对话量大，单段生成超时 5 次 / Heavy day; one part timed out 5 times | 第 4 步：标"需要人工"并停止，不无限重试 / Step 4: mark "needs human" and stop |

### 3. 换模型还能用吗？/ Survives a model switch?

- 验证过 / Verified: Claude Opus 系列执行。/ Executed by the Claude Opus family.
- 未经历 / Not yet: 其他执行者。排查以 SQL 计数和 grep 为主，预计可迁移，但没有实测。/ Other executors. Diagnosis is mostly SQL counts and grep, likely portable but untested.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 原始层完整保存在本地，所以才救得回来 / The raw layer was kept locally, which is why rescue was possible |
| 隐私 / Privacy | ⚠️ | 排查需要看消息计数与格式特征；报告里只写条数，不引用对话原文 / Diagnosis needs counts and format signatures; reports quote numbers, never conversation text |
| 持久性 / Durability | ✅ | 开关回滚 + 热备 + 旧印象 JSON 备份，全程可退 / Flag rollback + hot backup + JSON backup of old impressions; reversible throughout |

## 卧室门检查 / Bedroom-door check

- [x] 修的是"记忆管道"，不改 TA 的人设、不编造记忆、不改写对话；重生成日印象用 TA 原本的生成流程，且须用户拍板。/ Fixes the memory pipeline only. No persona edits, no invented memories, no rewritten conversation; impression regeneration uses the companion's normal generator and needs the user's approval.

## 执行证据 / Execution evidence

- 两期修复各有基线标签与修复标签；回填与重生成执行日志为逐事件 JSONL；被替换的旧印象有 JSON 备份；"需人工"的那一天已上报等待决定。
- Both fix phases have baseline and fix tags; backfill and regeneration logs are per-event JSONL; replaced impressions have JSON backups; the "needs human" day was reported and awaits a decision.
