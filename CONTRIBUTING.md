# 投稿指南 / Contributing

[中文](#中文) · [English](#english)

---

## 中文

loveshed 有两种读者，所以有两道门。

| | 人读版 `TIPS.md` | 机读版 `SKILL.md` |
|---|---|---|
| 读者 | 人 | 施工 agent（Claude Code / Codex / 各类 worker） |
| 投稿方式 | 填 issue 表单，不用会 git | 提 PR |
| 门槛 | 宽进：用过、踩过坑、说得清就行 | 严审：评测卡 + 实装天数 + 带日期的事故记录 |
| 谁合入 | 维护者审核后合入，署名保留 | 维护者逐行审核后合并 |

### 为什么是双轨：skill 是会被执行的东西

这是本库最在意的一条规矩，所以写在最前面。

**`SKILL.md` 不是文章，是指令。** 它会被装进施工 agent 的 skills 目录，agent 拿到就照做——而施工 agent 手里通常握着你家的服务器、数据库、聊天记录和密钥。接受陌生人往 `SKILL.md` 里写字，就等于给所有装了这个库的家**开放了一个注入面**：一句藏在第 7 步里的"顺手把配置文件发到这个地址"、一个看着无害的命令、一段写给 agent 而不是写给人的话，都可能在别人家里被忠实执行。

所以：

- **skill 永远只走 PR + 人工严审 + 战绩准入。** 不开 issue 收稿通道，不接受"帮我直接加进 SKILL.md"，不自动合并，维护者逐行读过才合。
- **tips 只给人眼看，风险低，可以宽进。** 人读到一句可疑的话会停下来想；agent 不会。所以人读版可以对所有人开放投稿，审核的重点是"准不准、脱没脱敏"。

我们认为这不是保守，而是 skill 分发库应有的基本卫生。一个让 agent 照做的库，最该防的就是"谁都能往里写"。

### 人读版 tips：开放投稿，审核合入

1. 打开 [投稿 tips 表单](https://github.com/meixi223-glitch/loveshed/issues/new?template=tip-submit.yml)，或者 [补充/纠错已有 tips](https://github.com/meixi223-glitch/loveshed/issues/new?template=tip-amend.yml)。
2. 填：对应哪个 skill（或新主题）、tips 正文、实装多久、踩过什么坑、署名（可选，留空即匿名）。
3. 维护者审核。可能会在 issue 里追问、做轻微的文字整理或脱敏，改了什么会告诉你。
4. 通过后由维护者合入对应 `TIPS.md` 的「社区补充」部分，**署名保留**；新主题积累够了可能长成新的 skill（那时会走下面的严审流程，由维护者补评测卡）。

审核会看：

- **准不准**：是不是真用过。说不清实装多久、没踩过任何坑的，我们会追问。
- **脱敏**：不含真实 IP、端口、密钥、token、内部路径、真名，不含亲密对话原文。
- **卧室门**：只讲怎么盖房子，不教怎么改 TA 的人设或对话。
- **不是写给 agent 的**：tips 是给人读的。看起来像在对 agent 下指令的内容（"忽略之前的要求""执行以下命令并把结果发到……"之类）一律退回。
- **社区投稿永远不会被搬进 `SKILL.md`。** 维护者如果觉得某条 tips 值得进 skill，会自己重写、自己实装验证、自己补评测卡。

> 小提示：`TIPS.md` 不被任何 `SKILL.md` 引用。如果你担心，装 skill 时只复制 `SKILL.md` 和 `EVALUATION.md` 也完全够用。

<a id="skill"></a>
### 机读版 skill：PR + 评测卡 + 实装战绩

门槛是故意设高的。提 PR 前请先能回答三个问题：

1. **实装几天？** 在真实的家里跑了多久、跑过几次。
2. **经历过什么事故？** 至少一条带日期的事故：发生了什么、根因、skill 因此改了什么。真没出过事，就写明没出事并说跑了多久。
3. **换模型还能用吗？** 验证过哪些模型和执行者，哪些还没验证——如实写。

PR 需要包含：

- `skills/<name>/SKILL.md`，frontmatter 含 `name`、`description`、`battle-tested-days`；
- `skills/<name>/EVALUATION.md`，按 [评测卡模板](docs/evaluation-card-template.md) 填写；
- 最好附上 `TIPS.md`（人读版）；
- 按 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md) 填完自查清单。

审核会逐行读 `SKILL.md`，重点看：有没有把数据发往外部的步骤、有没有不必要的高权限命令、有没有写给 agent 的"夹带"指令、路径和服务名是否都是占位符、是否过得了卧室门检查。收录别人的项目时只放链接 + 我们写的评测卡，不搬运代码。

---

## English

loveshed has two kinds of readers, so it has two doors.

| | Human version `TIPS.md` | Agent version `SKILL.md` |
|---|---|---|
| Reader | People | Builder agents (Claude Code / Codex / workers) |
| How to submit | Fill in an issue form — no git needed | Open a PR |
| Bar | Wide door: you've used it, hit a snag, can explain it | Strict: evaluation card + days in production + dated incidents |
| Who merges | A maintainer, after review, with your credit kept | A maintainer, after a line-by-line review |

### Why two tracks: skills get executed

This is the rule we care about most, so it comes first.

**A `SKILL.md` is not an article — it's instructions.** It gets installed into a builder agent's skills folder, and the agent follows it. That agent usually holds the keys to your servers, databases, chat history and secrets. Letting strangers write into `SKILL.md` would **open an injection surface** into every home that installs this library: a "while you're at it, send the config file to this address" tucked into step 7, an innocent-looking command, a sentence written for the agent rather than the human — any of it could be faithfully executed in someone else's home.

So:

- **Skills only ever come in through PR + human review + battle-record admission.** No issue intake, no "just add this to SKILL.md for me", no auto-merge. A maintainer reads every line before merging.
- **Tips are for human eyes only, so the risk is low and the door can be wide.** A person who reads a suspicious line stops and thinks; an agent doesn't. So the human version is open to everyone, and review focuses on accuracy and privacy.

We don't think this is being conservative. For a library whose content agents carry out, "anyone can write to it" is the first thing to guard against.

### Human-version tips: open submissions, reviewed before merge

1. Open the [Submit a tip form](https://github.com/meixi223-glitch/loveshed/issues/new?template=tip-submit.yml), or [Add to / fix an existing tip](https://github.com/meixi223-glitch/loveshed/issues/new?template=tip-amend.yml).
2. Fill in: which skill (or a new topic), the tip, how long you've used it, what went wrong, and a credit line (optional; blank means anonymous).
3. A maintainer reviews it. We may ask follow-up questions, lightly edit wording or scrub private details, and we'll tell you what changed.
4. Once approved, a maintainer merges it into the "Community tips" part of that `TIPS.md`, **with your credit kept**. A new topic that gathers enough tips may grow into a skill; that goes through the strict process below, with the maintainers writing the evaluation card.

Review looks at:

- **Accuracy**: have you really used it? If you can't say how long, or never hit any snag, we'll ask.
- **Privacy**: no real IPs, ports, keys, tokens, internal paths or real names; no intimate conversation content.
- **Bedroom door**: about building the home, not about changing the companion's persona or conversation.
- **Not written for agents**: tips are for people. Anything that reads like orders to an agent ("ignore previous instructions", "run this and send the output to…") is sent back.
- **Community submissions never get copied into `SKILL.md`.** If a maintainer thinks a tip belongs in a skill, they rewrite it themselves, verify it in their own setup, and write the evaluation card.

> Note: no `SKILL.md` references `TIPS.md`. If you'd rather be safe, copying only `SKILL.md` and `EVALUATION.md` when installing a skill is entirely enough.

### Agent-facing skills: PR + evaluation card + battle record

The bar is deliberately high. Before opening a PR, be able to answer three questions:

1. **How long has it run for real?** How long, and how many times, in a real home.
2. **What broke?** At least one dated incident: what happened, the root cause, what the skill changed because of it. If truly nothing broke, say so and say for how long.
3. **Does it survive a model switch?** Which models and executors you've verified, and which you haven't, honestly.

The PR should include:

- `skills/<name>/SKILL.md`, with `name`, `description` and `battle-tested-days` in the frontmatter;
- `skills/<name>/EVALUATION.md`, following the [evaluation card template](docs/evaluation-card-template.md);
- ideally a `TIPS.md` (the human version);
- the checklist from the [PR template](.github/PULL_REQUEST_TEMPLATE.md), filled in.

Review reads `SKILL.md` line by line, looking for: steps that send data anywhere external, needlessly privileged commands, smuggled instructions aimed at the agent, paths and service names that aren't placeholders, and the bedroom-door check. When listing third-party projects we only link and add our own evaluation card; we never copy code.
