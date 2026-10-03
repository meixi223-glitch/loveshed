# 评测卡 / Evaluation Card — release-baseline

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | release-baseline |
| 首次实装日期 / First deployed | 2026-09-22 |
| 实装天数 / Days in production | 11（截至 2026-10-03）/ 11 (as of 2026-10-03) |
| 使用环境 / Environment | 自托管 Linux，Python 记忆服务 + Node 聊天桥 + 前端，SQLite，systemd / self-hosted Linux, Python memory service + Node bridge + frontend, SQLite, systemd |
| 执行者 / Executed by | Claude Code、Codex 类 worker / Claude Code, Codex-style workers |
| 维护者 / Maintainer | yumei & Jin |

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 11 天。期间每次改记忆系统、聊天桥、前端都先走这套流程；一次多仓发版同时给 5 个仓库打了同一时间戳的基线标签。
- 11 days. Every change to the memory system, bridge, and frontend in that time went through this flow; one multi-repo release tagged 5 repos with the same timestamp.

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 修复 / skill 的改动 Fix / skill change |
|---|---|---|---|
| 2026-09-21 | 一次回滚后，整版改动永久丢失 / A rollback permanently lost a whole version of changes | 生产目录不是 git 仓库，"回滚"=拷回备份 / Production dir wasn't a git repo; "rollback" = copying backups over | 本 skill 诞生：第 0/1 步强制 git init + 基线标签 / This skill was born: steps 0/1 mandate git init + baseline tag |
| 2026-09 下旬 late Sep | 加列迁移后部分功能异常 / Partial breakage after an add-column migration | 只重启了主进程，多个消费者仍按旧 schema 运行 / Only the main process was restarted; consumers ran on the old schema | 第 5 步：加列必须主进程 + 全部消费者同批重启 / Step 5: restart main + all consumers together |
| 2026-09 下旬 late Sep | agent 重启服务时把自己也杀了，报告没写完 / Agent killed itself while restarting a service, mid-report | agent 跑在被重启服务的同一 cgroup 里 / Agent ran in the same cgroup as the restarted service | 第 5 步：脱离的延迟重启 + 先写完报告 / Step 5: detached delayed restart, report first |

自 2026-09-22 起，未再发生"回滚丢改动"。/ No "rollback lost changes" incident since 2026-09-22.

### 3. 换模型还能用吗？/ Survives a model switch?

- 验证过 / Verified: Claude Opus、Sonnet 系列；Codex 类 worker 执行过同样步骤。/ Claude Opus and Sonnet families; Codex-style workers have run the same steps.
- 纯 shell + git 流程，不依赖模型特有能力。/ Pure shell + git; no model-specific features.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 仓库与备份都在本地 / Repos and backups are local |
| 隐私 / Privacy | ⚠️ | `.gitignore` 漏写会把密钥/对话库提交进历史；第 1 步要求提交前人工检查 / A missing `.gitignore` entry can commit secrets/chat DBs; step 1 requires a review before commit |
| 持久性 / Durability | ✅ | 只依赖 git、sqlite3、systemd / Depends only on git, sqlite3, systemd |

## 卧室门检查 / Bedroom-door check

- [x] 纯施工流程，不接触陪伴 AI 的人设与对话。/ Pure build process; never touches the companion's persona or conversation.

## 执行证据 / Execution evidence

- 2026-09-22 起所有记忆系统改动的设计稿都以"第 0 步 git 基线"开头；2026-09-28 与 2026-10-02 两次多仓发版均按此打基线标签 + 热备。
- Since 2026-09-22 every memory-system design doc begins with "step 0: git baseline"; multi-repo releases on 2026-09-28 and 2026-10-02 both used baseline tags + hot backups.
