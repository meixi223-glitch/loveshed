# 评测卡 / Evaluation Card — worker-dispatch-acceptance

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | worker-dispatch-acceptance |
| 首次实装日期 / First deployed | 2026-09-21（约 / approx.） |
| 实装天数 / Days in production | 约 12（截至 2026-10-03）/ about 12 (as of 2026-10-03) |
| 使用环境 / Environment | 主 agent 通过派单服务把工单交给后台 worker（Claude Code / Codex 类），worker 跑在同一台自托管主机上 / a lead agent dispatches tickets via a dispatch service to background workers (Claude Code / Codex-style) on the same self-hosted box |
| 执行者 / Executed by | Claude Code（派单与验收）、Claude Code / Codex 类 worker（施工）/ Claude Code (dispatch & acceptance), Claude Code / Codex-style workers (building) |
| 维护者 / Maintainer | yumei & Jin |

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 约 12 天，日常每天多张工单。最密集的一天，聊天前端连续发了十几批，每批一张工单、一份带回滚的报告；记忆系统几次大修的每一期也都是"工单 → 报告 → 验收 → 告诉用户"。
- About 12 days, several tickets daily. On the busiest day the chat frontend shipped more than ten batches, each with its own ticket and a report with rollback; every phase of several memory-system overhauls also went "ticket → report → acceptance → tell the user".

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 修复 / skill 的改动 Fix / skill change |
|---|---|---|---|
| 2026-09 下旬 late Sep | worker 重启服务时把自己杀了，报告没写完 / A worker killed itself restarting a service, mid-report | worker 和被重启服务在同一 cgroup / Worker shared a cgroup with the service | 第五节：脱离的延迟重启 + 先写报告 / Section 5: detached delayed restart, report first |
| 2026-09 下旬 late Sep | 长任务被墙钟超时截断，看起来像"失败" / Long tasks cut off by wall-clock limits, looking like failures | 派单服务有多层超时，worker 不知道 / The dispatch service has layered timeouts the worker didn't know about | 第五节：设墙钟上限，超时先查现场再决定重派 / Section 5: wall-clock cap; inspect the site before re-dispatching |
| 2026-09 下旬 late Sep | 测试脚本可能把测试消息发给 TA / Test scripts risked sending test messages to the companion | 工单没写假入口在哪 / Ticket didn't say where the fake entry was | 第一节：红线写明"不往真实对话发测试消息"，并指定 staging / Section 1: red line + named staging |
| 未记录具体日期 / not dated | "一行报告"与"同库两队" / "one-line reports" and "two crews, one repo" | 规则由维护者拍板写入；本库作者手头没有带日期的完整事故报告，故不编造 / Rules set by the maintainers; we have no dated incident report for these, so we don't invent one | 第二、四节 / Sections 2 and 4 |

### 3. 换模型还能用吗？/ Survives a model switch?

- 验证过 / Verified: Claude Opus、Sonnet 系列派单与验收；Codex 类 worker 按此格式交过报告。/ Claude Opus and Sonnet as dispatcher/acceptor; Codex-style workers have reported in this format.
- 是纯流程规范，不依赖模型特有能力；但不同 worker 对"报告格式"的遵守度不同，所以第四节的"打回"是必须的。/ A pure process spec with no model-specific features; but workers vary in how well they follow the report format, which is why section 4's send-back is mandatory.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 工单与报告都是本地 markdown / Tickets and reports are local markdown |
| 隐私 / Privacy | ⚠️ | 工单里可能写到真实路径和服务名；报告不得包含密钥原文，凭据最小化 / Tickets may contain real paths and service names; reports must never include raw secrets; minimal credentials |
| 持久性 / Durability | ✅ | 不依赖任何特定派单服务，换成手动复制粘贴也能用 / Not tied to any dispatch service; works even by copy-paste |

## 卧室门检查 / Bedroom-door check

- [x] 只规范施工队之间的协作。红线里明确禁止 worker 往真实对话里发测试消息。/ Governs collaboration among builders only. Red lines explicitly forbid workers from sending test messages into the real conversation.

## 执行证据 / Execution evidence

- 工作目录里的执行报告普遍包含"改动清单 / 证据 / 回滚 / 备份位置"各节；每期发版都有基线标签与回滚命令。
- Execution reports in the work directory consistently include changes / evidence / rollback / backup sections; every release phase has a baseline tag and rollback commands.
