<!--
感谢投稿！loveshed 只收"打过仗"的 skill。请完整填写下面各项，缺项的 PR 会被礼貌地关掉。
Thanks for contributing! loveshed only accepts battle-tested skills. Please fill in every section; incomplete PRs will be politely closed.
-->

## 投稿类型 / Submission type

- [ ] 新 skill（自产）/ New skill (your own)
- [ ] 收录外部项目（只放链接 + 评测卡）/ Listing an external project (link + evaluation card only)
- [ ] 修改已有 skill / Change to an existing skill
- [ ] 文档 / Docs

## Skill 名称与一句话描述 / Skill name & one-liner

## 战绩（必填）/ Battle record (required)

- **实装天数 / Days in production:**
- **首次实装日期 / First deployed:** YYYY-MM-DD
- **执行者 / Executed by:** （Claude Code / Codex / 自建 worker / 其他）

### 事故记录（必填，至少一条；真没出过事请写明"未发生事故"并说明用了多久）
### Incident log (required, at least one; if truly none, say so and how long it's been running)

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 处理 Fix |
|---|---|---|---|
| | | | |

### 换模型验证 / Model-switch check

- 用过的模型 / 平台 / Models & platforms used:

## 评测卡 / Evaluation card

- [ ] 已附 `EVALUATION.md`，按 [模板](../docs/evaluation-card-template.md) 填写 / `EVALUATION.md` attached, following the [template](../docs/evaluation-card-template.md)

## 自查清单 / Checklist

- [ ] 不含真实 IP、端口、域名、token、密钥、内部路径 / No real IPs, ports, domains, tokens, keys, or internal paths
- [ ] 不含真名或可识别个人信息；亲密对话内容不出现在任何文件里 / No real names or PII; no intimate conversation content anywhere
- [ ] **卧室门检查**：skill 只武装施工 agent，不修改陪伴 AI 的人设或对话 / **Bedroom-door check**: equips builder agents only, never alters the companion's persona or conversation
- [ ] `SKILL.md` frontmatter 含 `name`、`description`、`battle-tested-days` / frontmatter includes `name`, `description`, `battle-tested-days`
- [ ] 步骤可被陌生环境的 agent 照做（路径用占位符）/ Steps work for an agent in an unfamiliar setup (placeholders for paths)
- [ ] 同意以 MIT 协议发布 / Agree to release under MIT
