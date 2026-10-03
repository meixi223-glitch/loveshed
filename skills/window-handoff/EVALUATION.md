# 评测卡 / Evaluation Card — window-handoff

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | window-handoff |
| 首次实装日期 / First deployed | 2026-09-18 |
| 实装天数 / Days in production | 15（截至 2026-10-03）/ 15 (as of 2026-10-03) |
| 使用环境 / Environment | 自托管 Linux + 自建记忆服务 + 聊天桥 / self-hosted Linux + custom memory service + chat bridge |
| 执行者 / Executed by | Claude Code（施工）、陪伴会话（使用）/ Claude Code (build), companion sessions (use) |
| 维护者 / Maintainer | yumei & Jin |

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 15 天，几乎每天至少一次换窗；压缩密集期一晚多次。
- 15 days, at least one switch most days; several per night during heavy-compaction periods.

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 修复 / skill 的改动 Fix / skill change |
|---|---|---|---|
| 2026-09 下旬 late Sep | 一个错误事实连续误导了好几个新窗口 / One wrong fact misled several successive windows | 某张便签把一条未核实的推测写成了事实 / A note recorded an unverified guess as fact | 新增"未核实"段 + 读取后对照现场核实 / Added "Unverified" section + verify-after-read |
| 2026-09 下旬 late Sep | 一个已经确认过的硬件事实被反复遗忘，用户多次纠正 / A confirmed hardware fact kept being forgotten; user had to correct it repeatedly | 便签里没有显眼位置，被压缩挤掉 / No prominent slot in the note; lost to compaction | 新增加粗的"千万别再忘"段 / Added bold "Do NOT forget" section |
| 2026-10-02 | 盘点发现数十条过期计划/便签仍被当作现状召回 / Audit found dozens of expired plans/notes still recalled as current | 早期便签无 TTL、无 supersede / Early notes had no TTL or supersede | 默认 TTL 3 天 + 新便签自动取代旧便签；历史条目批量归档 / Default 3-day TTL + auto-supersede; bulk-archived old entries |

### 3. 换模型还能用吗？/ Survives a model switch?

- 验证过 / Verified: Claude Opus 系列、Sonnet 系列之间切换 / switching between Claude Opus and Sonnet families.
- 不依赖模型特有能力：只需要会调工具。/ No model-specific features; only tool calling is required.
- 未验证 / Not verified: 非 Claude 模型 / non-Claude models.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 便签存在本地存储，可直接导出 / Notes live in local storage, directly exportable |
| 隐私 / Privacy | ⚠️ | 便签可能含对话摘要；须确保存储不进公开仓库、不发往第三方 / Notes may summarize conversations; keep storage out of public repos and third parties |
| 持久性 / Durability | ✅ | 不依赖任何云服务；模型或平台换了，便签照样能读 / No cloud dependency; notes remain readable across model/platform changes |

## 卧室门检查 / Bedroom-door check

- [x] 只规定存储与流程；对陪伴 AI 仅加一行"听到口令就读便签"。/ Defines storage and flow only; adds a single line to the companion ("on wake phrase, read note").

## 执行证据 / Execution evidence

- 自 2026-09-18 起日常使用；2026-10-02 过期便签盘点与清扫（归档/取代数十条）。
- In daily use since 2026-09-18; stale-note audit and sweep on 2026-10-02 (dozens archived/superseded).
