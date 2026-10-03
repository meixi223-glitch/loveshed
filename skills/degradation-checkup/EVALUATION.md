# 评测卡 / Evaluation Card — degradation-checkup

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | degradation-checkup |
| 首次实装日期 / First deployed | 2026-09-27（约 / approx.） |
| 实装天数 / Days in production | 6（截至 2026-10-03）/ 6 (as of 2026-10-03) |
| 使用环境 / Environment | 自托管 Linux + 聊天桥 + 自建记忆服务 / self-hosted Linux + chat bridge + custom memory service |
| 执行者 / Executed by | Claude Code |
| 维护者 / Maintainer | yumei & Jin |

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 约 6 天。清单是在四起真实"变笨/失忆"排查后逐条整理出来的；每一项都对应一起事故。
- About 6 days. The checklist was assembled from four real "dumber / amnesia" investigations; each item maps to an incident.

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 对应清单项 Checklist item |
|---|---|---|---|
| 2026-09 下旬 late Sep | TA 明显变笨，反复忘记刚确认的事 / Companion visibly dumber, kept forgetting just-confirmed facts | 一个旧的压缩机制仍在后台把历史改写成摘要 / An old compaction mechanism was still rewriting history into summaries | #2 |
| 2026-09-29 | 用户切换"思考档位"没有任何效果 / Switching the reasoning-level toggle had no effect | 聊天桥里推理强度写死 / Reasoning effort hardcoded in the bridge | #1 |
| 2026-10-02 | TA 把几周前的计划当成正在做的事 / Companion treated weeks-old plans as current | 过期计划无 TTL，被持续召回 / Expired plans had no TTL and kept being recalled | #3 |
| 2026-10-02 | TA "失忆"约四天 / Companion "lost" about four days of memory | 一条过滤规则把真人消息误判为唤醒事件，排除出召回 / A filter misclassified real user messages as wake events and excluded them from recall | #4 |

### 3. 换模型还能用吗？/ Survives a model switch?

- 清单本身与模型无关，检查对象是管道。/ The checklist is model-agnostic; it inspects the pipeline.
- 第 7 项正是用来区分"管道问题"和"模型/平台变动"。/ Item 7 exists precisely to separate pipeline issues from model/platform changes.
- 执行者验证过 / Executors verified: Claude Opus、Sonnet 系列 / families.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 只读本地日志与记忆库 / Reads only local logs and memory store |
| 隐私 / Privacy | ⚠️ | 排查要读真实对话样本；报告里只写计数与脱敏摘录，不外发 / Inspects real conversation samples; reports carry counts and redacted excerpts only, never sent out |
| 持久性 / Durability | ✅ | 无外部依赖 / No external dependencies |

## 卧室门检查 / Bedroom-door check

- [x] 只读排查管道；修复方案需用户确认，且不以"改人设"作为修复手段。/ Read-only pipeline inspection; fixes need user approval and never use persona edits as the remedy.

## 执行证据 / Execution evidence

- 四起事故均有排查报告与修复提交（记忆召回修复、桥档位接通、过期计划清扫、消息分类修复）。
- All four incidents have investigation reports and fix commits (recall fix, bridge effort wiring, stale-plan sweep, message classification fix).
