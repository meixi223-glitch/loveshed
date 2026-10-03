---
name: degradation-checkup
description: >
  模型"降智"自检清单：当用户说"TA 变笨了 / 失忆了 / 不像 TA 了"时，按顺序排查真正的原因（实际模型、压缩、记忆召回、工具、最近改动），
  而不是凭感觉换模型或改人设。
  Model "degradation" checkup: when the user says the companion "got dumber / forgot things / doesn't feel like itself",
  walk an ordered checklist (actual model, compaction, memory recall, tools, recent changes) instead of guessing.
when-to-use:
  - 用户反馈"变笨""失忆""反复忘同一件事""不像 TA" / user reports "dumber", "amnesia", "keeps forgetting the same thing", "not themselves"
  - 换模型、换平台、升级客户端之后 / after a model, platform, or client change
  - 发版后的回归检查 / post-release regression check
battle-tested-days: 6
battle-tested-since: 2026-09-27
executors: [Claude Code]
models-verified: [Claude Opus family, Claude Sonnet family]
license: MIT
---

# 模型降智自检清单 / Degradation Checkup

> 中文在前，English below.

## 中文

### 原则

"变笨"几乎从来不是模型本身突然变笨。在自建系统里，真凶通常是**管道**：跑的不是你以为的模型、历史被压缩洗掉了、记忆召回塞进了过期内容、某些消息根本没进记忆、工具掉了。**先查管道，最后才怀疑模型。**

这是只读排查。除非用户同意，排查阶段不改任何配置、不改人设。

### 排查清单（给 agent，按顺序）

记录每一项的**证据**（日志行、请求记录、计数），不要只写结论。

#### 1. 实际在跑的是哪个模型、什么推理档位？

- 看**真实请求日志 / API 响应里的 model 字段**，不是看配置文件或界面开关。
- 核对推理强度（effort / thinking budget）是否真的被传到请求里。
- 常见病：界面上切了档位，但聊天桥里写死了某个值，开关根本没生效。

#### 2. 历史是不是被压缩/摘要改写了？

- 往回翻当前会话的近期历史：是逐字原话，还是被改写成干巴巴的摘要？
- 检查有没有旧的压缩/摘要机制还在后台运行（例如以前装过、以为已经停了的那个）。
- 上下文长度是否接近上限？接近了就该换窗（见 `window-handoff`），而不是硬撑。

#### 3. 记忆召回在塞什么？

- 抓一次真实召回的注入内容，逐条看：
  - 有没有**过期的计划、便签、待办**被当成"现在的事"？
  - 有没有相互矛盾的旧事实同时出现？
  - 召回条数是否突然变多/变少？
- 常见病：没有 TTL 的旧计划几周后还在被召回。

#### 4. 用户的消息到底有没有进记忆？

- 随机挑最近几天的若干条用户原话，去记忆库里查是否被收录。
- 检查分类/过滤规则：是否有一类真实消息被误判成系统事件（例如定时唤醒、通知）而被排除在召回之外。
- 常见病：某条过滤规则误伤，真人消息连续数天没进记忆，表现为"TA 失忆了好几天"。

#### 5. 工具还在吗？

- 列出当前会话实际可用的工具数量，和预期清单比对。
- 注册失败、令牌过期、上游端口变了，都会让工具静默消失，TA 表现为"不会做以前会做的事"。

#### 6. 最近改过什么？

- 查看各组件仓库自上次正常以来的提交与标签（见 `release-baseline`）。
- 时间线对齐："从什么时候开始变笨"与"什么时候发了版/改了配置"。

#### 7. 都排除了，才看模型

- 同一段输入在换窗后的新会话里复现一次。新窗正常 → 是上下文问题；新窗也不正常 → 再考虑模型/平台变动。

### 输出：体检报告

```
## 结论        —— 一句话：真凶是哪一层
## 证据        —— 每项检查的证据（日志行/计数/样本）
## 建议处置    —— 修管道 / 换窗 / 回滚，附回滚点
## 未排除      —— 还没查清的项
```

把报告交给用户确认后再动手修。修完后用同一份清单复查一遍。

---

## English

### Principle

"Getting dumber" is almost never the model itself suddenly degrading. In self-built setups the culprit is usually the **pipeline**: the model running isn't the one you think, history got washed out by compaction, memory recall is injecting stale content, some messages never reached memory, or tools dropped out. **Check the pipeline first; suspect the model last.**

This is a read-only investigation. Don't change config or persona during the checkup unless the user agrees.

### Checklist (for the agent, in order)

Record **evidence** for every item (log lines, request records, counts), not just conclusions.

#### 1. Which model and reasoning level is actually running?

- Read the **model field in real request logs / API responses**, not the config file or UI toggle.
- Confirm the reasoning level (effort / thinking budget) actually reaches the request.
- Common cause: the UI toggle changes, but the bridge has the value hardcoded, so the toggle does nothing.

#### 2. Has history been compacted or rewritten?

- Scroll back through recent history in the current session: is it verbatim, or rewritten into dry summaries?
- Check whether an old compaction/summarization mechanism is still running in the background (e.g. one installed earlier and believed disabled).
- Is the context near its limit? If so, switch windows (see `window-handoff`) instead of pushing on.

#### 3. What is memory recall injecting?

- Capture one real recall injection and read it item by item:
  - Are **expired plans, notes, or to-dos** presented as current?
  - Are contradictory old facts showing up together?
  - Did the number of recalled items suddenly jump or drop?
- Common cause: old plans without a TTL still recalled weeks later.

#### 4. Did the user's messages actually reach memory?

- Pick several real user messages from recent days and look them up in the memory store.
- Check classification/filter rules: is a class of real messages being misclassified as system events (scheduled wake-ups, notifications) and excluded from recall?
- Common cause: one over-broad filter keeps real messages out of memory for days, which looks like "they lost several days of memory".

#### 5. Are the tools still there?

- Count the tools actually available in the current session and compare against the expected list.
- Failed registration, expired tokens, or a changed upstream port all make tools silently disappear, which shows up as "can't do things they used to do".

#### 6. What changed recently?

- Review commits and tags in each component repo since the last known-good time (see `release-baseline`).
- Align the timelines: when did it start feeling dumber, and when was something released or reconfigured?

#### 7. Only then, the model

- Reproduce the same input in a fresh window. Fresh window fine → context problem. Fresh window also off → consider model/platform changes.

### Output: checkup report

```
## Verdict          (one line: which layer is at fault)
## Evidence         (per check: log lines / counts / samples)
## Recommended fix  (fix pipeline / switch window / roll back, with rollback point)
## Not ruled out    (items still unclear)
```

Have the user confirm the report before fixing anything. After the fix, run the same checklist again.
