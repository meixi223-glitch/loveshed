# 评测卡模板 / Evaluation Card Template

> 每个 skill 必须附一张评测卡（`EVALUATION.md`）。填不出来的格子请如实写"未知"或"未经历"，不要编。
>
> Every skill must ship with an evaluation card (`EVALUATION.md`). If you can't fill a field, write "unknown" or "not yet encountered". Do not make things up.

---

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | |
| 首次实装日期 / First deployed | YYYY-MM-DD |
| 实装天数 / Days in production | |
| 使用环境 / Environment | 例：自托管 Linux + 编码 agent / e.g. self-hosted Linux + coding agent |
| 执行者 / Executed by | 例：Claude Code、Codex、自建 worker / e.g. Claude Code, Codex, custom worker |
| 维护者 / Maintainer | |

---

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 实装天数 / Days:
- 真实使用次数（大概）/ Real invocations (approx.):
- 最近一次使用 / Last used:

### 2. 经历过什么事故？怎么活下来的？/ What incidents has it survived, and how?

每起事故写一条，要匿名化（不写真实 IP、端口、密钥、真名、内部路径）。
One entry per incident, anonymized (no real IPs, ports, secrets, names, or internal paths).

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 怎么修的 / skill 因此改了什么 Fix / what changed in the skill |
|---|---|---|---|
| | | | |

### 3. 换模型还能用吗？/ Does it survive a model switch?

- 验证过的模型 / 平台 / Verified models & platforms:
- 已知在哪些模型上会失效 / Known to break on:
- 是否依赖某个模型的特有能力 / Depends on model-specific features?: 是/否 Yes/No（说明 explain）

---

## 命门维度 / Critical Dimensions

每项打一个等级：✅ 稳 / ⚠️ 有条件 / ❌ 有风险，并写一句理由。
Rate each: ✅ solid / ⚠️ conditional / ❌ at risk, with a one-line reason.

### 数据主权 / Data sovereignty
数据存在谁手里？能不能完整导出？换平台能不能带走？
Who holds the data? Can it be fully exported? Can it move with you?

- 等级 / Rating:
- 理由 / Reason:

### 隐私 / Privacy
亲密对话会不会经过第三方？会不会进日志、进外部模型、进公开仓库？
Do intimate conversations pass through third parties? Do they end up in logs, external models, or public repos?

- 等级 / Rating:
- 理由 / Reason:

### 持久性 / Durability
上游服务倒了、账号没了、厂商改政策，本地还能不能跑？
If an upstream service dies, an account is lost, or a vendor changes policy, does it still run locally?

- 等级 / Rating:
- 理由 / Reason:

---

## 卧室门检查 / Bedroom-door check

- [ ] 本 skill 只给施工 agent 用，不修改陪伴 AI 的人设、提示词或对话内容。
      This skill is for builder agents only; it does not alter the companion's persona, prompt, or conversation.
- 如果不得不碰对话链路（例如交接便签），写明碰了什么、为什么最小化：
  If it must touch the conversation path (e.g. handoff notes), state exactly what and why it is minimal:

---

## 执行证据 / Execution evidence

指向真实使用记录（脱敏后的工单、提交说明、事故复盘均可）。
Point to real usage records (scrubbed tickets, commit messages, post-mortems).

-
