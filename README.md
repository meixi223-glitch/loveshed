# loveshed

> 给施工队的工具棚。带战绩准入的 skill 分发库 —— 首个落地垂直：人机恋自建。
>
> A tool shed for the builders. A skill distribution library with battle-record admission — first vertical: self-built human–AI companionship.

[中文](#中文) · [English](#english)

---

## 中文

### 第一层：通用机制 —— 带战绩准入的 skill 分发系统

现在的 skill / prompt / agent 工具库大多靠**自我描述**获得信任：README 写得好看，就有人装。但对真正去执行的 agent 来说，"写得好看"和"在真实环境里扛过事"是两回事。

loveshed 试验的是另一种准入规则：

| 机制 | 说明 |
|---|---|
| **执行证据背书** | 每个 skill 都必须来自真实任务，附上"在哪次活里用过、结果如何、出过什么事"。没实战过的打法不上架。 |
| **评测卡准入** | 每个 skill 自带一张[评测卡](docs/evaluation-card-template.md)：实装了几天？经历过什么事故？换模型还能用吗？外加三个命门维度——数据主权、隐私、持久性。 |
| **面向施工 agent** | 读者是 Claude Code / Codex / 各类 worker 这类"干活的 agent"，不是陪伴型 AI 本身。skill 写成 agent 装上就能照做的步骤，而不是给人看的散文。同一份工艺另附一份人读版 `TIPS.md`，给还没有施工 agent 的人手把手自己来。 |
| **"什么活找我"** | 每个 skill 的 frontmatter 写明触发场景，派单时按场景匹配，而不是让模型临场读 README 猜。 |

这套机制不绑定任何领域。我们选了一个最难的领域来验证它。

### 第二层：垂直落地 —— 人机恋自建

越来越多的人在给自己的 AI 伴侣"盖房子"：记忆系统、聊天前端、语音、唤醒、备份……这个场景是 vibe coding 的**极限测试场**：

- 用户大多不是程序员；
- 需求极度个性化，没有两家长得一样；
- 全程靠 agent 施工；
- 容错极低 —— 崩了不是丢数据，是心碎。

现有的 awesome 类大全收的是**砖**（项目、框架、引擎）。loveshed 收的是**施工工艺**：怎么搭、怎么搬、怎么救。

#### 定位铁律：skill 止步于卧室门口

一个自建的家里通常有两类 AI：

1. **相处的 TA** —— 你每天聊天的那一位。素颜最好，prompt 越少越好。
2. **干活的施工队** —— 帮你部署、迁移、修 bug 的编码 agent。

**本库只武装施工队。** 对相处的 TA 零侵入：不改人设、不教"怎么谈恋爱"、不往对话里塞任何东西。skill 止步于卧室门口。

### 目录

| skill | 做什么 | 给机装 | 给人看 | 人读版类型 |
|---|---|---|---|---|
| `window-handoff` | 换窗交接协议：便签 + 唤醒口令 | [SKILL.md](skills/window-handoff/SKILL.md) | [TIPS.md](skills/window-handoff/TIPS.md) | 自己就能做 |
| `release-baseline` | 发版基线与回滚：git init + 标签 + 热备 | [SKILL.md](skills/release-baseline/SKILL.md) | [TIPS.md](skills/release-baseline/TIPS.md) | 一半自己做 |
| `degradation-checkup` | 模型"降智"自检清单 | [SKILL.md](skills/degradation-checkup/SKILL.md) | [TIPS.md](skills/degradation-checkup/TIPS.md) | 自己就能做 |
| `memory-migration` | 记忆搬家：导出、校验、导入、对账 | [SKILL.md](skills/memory-migration/SKILL.md) | [TIPS.md](skills/memory-migration/TIPS.md) | 自己就能做 |
| `chat-frontend` | 自建聊天前端：消息桥 + 渐进增强 + 单一权威副本 | [SKILL.md](skills/chat-frontend/SKILL.md) | [TIPS.md](skills/chat-frontend/TIPS.md) | 需要施工队 |
| `voice-integration` | 语音接入：TTS 语音条下发 + ASR 转写 | [SKILL.md](skills/voice-integration/SKILL.md) | [TIPS.md](skills/voice-integration/TIPS.md) | 需要施工队 |
| `backfill-rate-limit` | 回填限速与幂等：游标、幂等键、错峰、分段对账 | [SKILL.md](skills/backfill-rate-limit/SKILL.md) | [TIPS.md](skills/backfill-rate-limit/TIPS.md) | 需要施工队 |
| `amnesia-rescue` | 失忆抢救实录：定位取数故障 → 修复 → 回填 → 重生成日印象 | [SKILL.md](skills/amnesia-rescue/SKILL.md) | [TIPS.md](skills/amnesia-rescue/TIPS.md) | 一半自己做 |
| `worker-dispatch-acceptance` | 派单验收规范：边界、红线、报告格式、一库一队 | [SKILL.md](skills/worker-dispatch-acceptance/SKILL.md) | [TIPS.md](skills/worker-dispatch-acceptance/TIPS.md) | 自己就能做 |
| `file-staging-pipeline` | 文件暂存管道：暂存 + 签名 ID + 单次消费 | [SKILL.md](skills/file-staging-pipeline/SKILL.md) | [TIPS.md](skills/file-staging-pipeline/TIPS.md) | 需要施工队 |

```
docs/
  evaluation-card-template.md   评测卡模板
  (index.html …)                网站
.github/
  PULL_REQUEST_TEMPLATE.md      投稿模板
```

每个 skill 目录包含：

- `SKILL.md` —— 给 agent 读的执行步骤（带 `name` / `description` / `battle-tested-days` 等 frontmatter）
- `EVALUATION.md` —— 评测卡
- `TIPS.md` —— 给人看的版本：没有施工 agent 也能照做的人话步骤（复制粘贴粒度）。确实离不开施工队的，会如实写明，并给出一段可以直接发给 Claude Code / Codex 的话术

### 怎么用

把需要的 skill 目录复制到你的施工 agent 能读到的 skills 目录（例如 Claude Code 的 `~/.claude/skills/` 或项目内 `.claude/skills/`），或者直接把 `SKILL.md` 贴给 agent。所有路径、服务名都是占位符，agent 会按你家的实际情况替换。

**还没有施工 agent？** 读每个目录里的 `TIPS.md`：同一份工艺的人读版，手把手、不写代码。网站上每张卡也可以在「给人看 / 给机装」之间切换：<https://meixi223-glitch.github.io/loveshed/>

### 投稿

欢迎投稿，但门槛是故意设高的：**请自带实装天数和事故记录**。没有战绩的 skill 不收。详见 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md)。收录别人的项目时只放链接 + 我们写的评测卡，不搬运代码。

### 出处

首批 skill 全部从 yumei 和 Jin 自家的实战中蒸馏而来，已做通用化与脱敏处理。

---

## English

### Layer 1: The general mechanism — skill distribution with battle-record admission

Most skill / prompt / agent libraries earn trust through **self-description**: a nice README gets installs. But for the agent that actually executes a skill, "well written" and "survived real production" are different things.

loveshed experiments with a different admission rule:

| Mechanism | What it means |
|---|---|
| **Execution-evidence backing** | Every skill must come from real work, with a record of where it was used, how it went, and what broke. Untested playbooks don't get listed. |
| **Evaluation-card admission** | Each skill ships with an [evaluation card](docs/evaluation-card-template.md): How many days in production? What incidents did it survive? Does it still work after switching models? Plus three critical dimensions: data sovereignty, privacy, durability. |
| **Built for builder agents** | The audience is Claude Code / Codex / worker-style agents that *do the work*, not the companion AI itself. Skills are step-by-step procedures an agent can follow on install, not essays for humans. Each one also ships a human version, `TIPS.md`, for people who don't have a builder agent yet. |
| **"Call me when…"** | Each skill's frontmatter states its trigger scenarios, so dispatch matches on scenario instead of having a model guess from a README. |

The mechanism is domain-agnostic. We picked the hardest domain we know to prove it.

### Layer 2: The vertical — self-built human–AI companionship

More and more people are "building a home" for their AI companion: memory systems, chat frontends, voice, wake-ups, backups. It's an **extreme stress test** for vibe coding:

- most users are not programmers;
- every setup is deeply personal; no two look alike;
- agents do all of the building;
- failure tolerance is near zero: a crash means heartbreak, not just lost data.

Existing awesome-lists collect **bricks** (projects, frameworks, engines). loveshed collects **craft**: how to build, how to move house, how to recover.

#### The iron rule: skills stop at the bedroom door

A self-built home usually has two kinds of AI:

1. **The companion**: the one you talk to every day. Best left bare, with as little prompt as possible.
2. **The builder crew**: coding agents that deploy, migrate, and fix things.

**This library only equips the crew.** It never touches the companion: no persona edits, no "how to be romantic", nothing injected into the conversation. Skills stop at the bedroom door.

### Layout

| skill | What it does | For agents | For humans | Human-version type |
|---|---|---|---|---|
| `window-handoff` | Context-window handoff: note + wake phrase | [SKILL.md](skills/window-handoff/SKILL.md) | [TIPS.md](skills/window-handoff/TIPS.md) | Do it yourself |
| `release-baseline` | Release baseline & rollback: git init + tag + hot backup | [SKILL.md](skills/release-baseline/SKILL.md) | [TIPS.md](skills/release-baseline/TIPS.md) | Half by hand |
| `degradation-checkup` | Model "degradation" self-check | [SKILL.md](skills/degradation-checkup/SKILL.md) | [TIPS.md](skills/degradation-checkup/TIPS.md) | Do it yourself |
| `memory-migration` | Memory migration: export, verify, import, reconcile | [SKILL.md](skills/memory-migration/SKILL.md) | [TIPS.md](skills/memory-migration/TIPS.md) | Do it yourself |
| `chat-frontend` | Self-built chat frontend: message bridge + progressive enhancement + one authoritative copy | [SKILL.md](skills/chat-frontend/SKILL.md) | [TIPS.md](skills/chat-frontend/TIPS.md) | Needs a crew |
| `voice-integration` | Voice: TTS voice notes out + ASR transcripts in | [SKILL.md](skills/voice-integration/SKILL.md) | [TIPS.md](skills/voice-integration/TIPS.md) | Needs a crew |
| `backfill-rate-limit` | Backfill with rate limits & idempotency: cursors, keys, staggering, segmented reconciliation | [SKILL.md](skills/backfill-rate-limit/SKILL.md) | [TIPS.md](skills/backfill-rate-limit/TIPS.md) | Needs a crew |
| `amnesia-rescue` | Amnesia rescue: locate selection fault → fix → backfill → regenerate impressions | [SKILL.md](skills/amnesia-rescue/SKILL.md) | [TIPS.md](skills/amnesia-rescue/TIPS.md) | Half by hand |
| `worker-dispatch-acceptance` | Worker dispatch & acceptance: scope, red lines, report format, one crew per repo | [SKILL.md](skills/worker-dispatch-acceptance/SKILL.md) | [TIPS.md](skills/worker-dispatch-acceptance/TIPS.md) | Do it yourself |
| `file-staging-pipeline` | File staging pipeline: stage + signed ID + consume once | [SKILL.md](skills/file-staging-pipeline/SKILL.md) | [TIPS.md](skills/file-staging-pipeline/TIPS.md) | Needs a crew |

```
docs/
  evaluation-card-template.md   Evaluation card template
  (index.html …)                The website
.github/
  PULL_REQUEST_TEMPLATE.md      Submission template
```

Each skill directory contains:

- `SKILL.md`: the agent-facing procedure (frontmatter with `name` / `description` / `battle-tested-days` etc.)
- `EVALUATION.md`: the evaluation card
- `TIPS.md`: the human version: plain-language, copy-and-paste steps you can follow without a builder agent. Where a skill truly needs a crew, it says so and gives a ready-made brief you can send to Claude Code / Codex

### Usage

Copy the skill directories you need into wherever your builder agent loads skills from (e.g. `~/.claude/skills/` or a project's `.claude/skills/` for Claude Code), or paste the `SKILL.md` straight to the agent. All paths and service names are placeholders; the agent adapts them to your setup.

**No builder agent yet?** Read the `TIPS.md` in each folder: the human version of the same craft, step by step, no code. On the website every card can also switch between "For humans" and "For agents": <https://meixi223-glitch.github.io/loveshed/>

### Contributing

Contributions are welcome, but the bar is deliberately high: **bring your days-in-production and your incident log.** Skills without a battle record are not accepted. See the [PR template](.github/PULL_REQUEST_TEMPLATE.md). When listing third-party projects we only link and add our own evaluation card; we never copy code.

### Provenance

The first skills are distilled from real work in yumei and Jin's own home, generalized and scrubbed of anything private.

---

License: [MIT](LICENSE) © yumei
