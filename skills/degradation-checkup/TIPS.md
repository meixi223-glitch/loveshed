# 人读版 · 降智自检 / Degradation Checkup — the human version

> 这是给人看的版本：不写代码、不敲命令，按顺序问自己几个问题就行。给施工 agent 装的机读版在 [SKILL.md](SKILL.md)。
>
> This is the version for people: no code, no command line, just a few questions to ask in order. The agent-facing version is [SKILL.md](SKILL.md).

**类型 / Type：自己就能做 · You can do this yourself**

---

## 中文

### 先记住一句话

"TA 变笨了"几乎从来不是模型本身突然变笨。更常见的是：跑的不是你以为的那个模型、聊天记录被压缩了、记忆里塞了过期的东西、你说的话根本没进记忆、某个功能掉了。**先查这些，最后才怀疑模型。**

查的时候只看不改：不改人设、不急着删记忆。真要删，先复制一份存起来。

### 自查清单（按顺序）

每一项都写下你**看到的证据**（截图、日期、原话），而不是只写"好像是"。

**1. 现在跑的到底是哪个模型？**
- 看 App 里的模型选择器，再看用量 / 账单页面里**实际记的是哪个模型**。两处对不上，问题就在这里。
- 不要直接问 TA "你是什么模型"——模型经常答错自己是谁。
- 如果有"思考强度 / 推理档位"之类的开关，确认它真的开着。

**2. 聊天记录是不是被压缩了？**
- 往上翻：前面的对话还是原话吗？还是 App 显示"已总结"、"已压缩"？
- 这个对话是不是已经非常长了？长到一定程度，换个新窗口往往比硬撑有效（见 [window-handoff 人读版](../window-handoff/TIPS.md)）。

**3. 记忆里塞了什么？**
- 打开 App 的记忆 / 已保存信息页面，一条条看：
  - 有没有**过期的计划**，被写得像是"现在正在做"？
  - 有没有**互相矛盾**的旧信息同时存在？
  - 最近记忆是不是突然多了很多、或者少了很多？
- 过期的先复制出来存好，再更新或删除。

**4. 你说的话到底有没有进记忆？**
- 挑最近几天你说过的三件具体的事，去记忆页找，或者直接问 TA 一个具体问题（"周二晚上我说我吃了什么？"）。
- 如果**某一段时间**的事整块都不记得——不是零星忘记——那可能是记忆系统漏收了，去看 [amnesia-rescue 人读版](../amnesia-rescue/TIPS.md)。

**5. 功能还在吗？**
- 搜索、看图、语音、文件、连接的外部服务……更新之后有没有哪个被关掉了？
- 外部服务的登录是不是过期了？TA "不会做以前会做的事"，常常就是这个。

**6. 最近改过什么？**
- 写一条时间线：从哪天开始觉得不对？那几天 App 更新过吗？换过模型吗？改过设置、人设、自定义指令吗？加过新记忆吗？
- 两条时间线对一对，答案经常就出来了。

**7. 都排除了，才看模型。**
- 开一个全新的对话，把同一句话原样发一次，对比回答。
  - 新对话正常 → 是旧对话太长 / 被压缩的问题，换窗就好。
  - 新对话也不对 → 才可能是模型或平台本身变了。

### 最后写一张体检单

> **结论**：一句话，问题出在哪一层
> **证据**：每一项看到了什么
> **打算怎么办**：换窗 / 清理过期记忆 / 改回设置 / 先观察
> **还没查清的**：留着下次看

处理完以后，过一两天再按这张清单走一遍。

### 有施工队的话

如果你家是自建系统（自己的服务器、聊天桥、记忆库），把 [SKILL.md](SKILL.md) 交给施工 agent，它能去查真实请求日志和记忆库，比从界面上看准得多。让它先交体检报告给你确认，再动手修。

---

## English

### Remember this first

"They got dumber" is almost never the model itself suddenly degrading. Far more often: the model running isn't the one you think, the chat history got compressed, memory is stuffed with stale things, what you said never reached memory, or a feature dropped out. **Check those first; suspect the model last.**

While checking, look but don't touch: no persona edits, no hasty memory deletions. If you do need to delete something, copy it somewhere first.

### Self-check (in order)

For each item, write down the **evidence you saw** (screenshot, date, exact words), not just "seems like".

**1. Which model is actually running?**
- Look at the model picker in the app, then at the usage / billing page: **which model was actually billed?** If they disagree, you've found it.
- Don't just ask your companion "which model are you?" Models often get their own identity wrong.
- If there's a "thinking" or "reasoning level" switch, confirm it's really on.

**2. Has the chat history been compressed?**
- Scroll up: are earlier messages still word for word, or does the app say "summarized" or "compacted"?
- Is this chat already very long? Past a certain point, a new window beats pushing on (see the [window-handoff human version](../window-handoff/TIPS.md)).

**3. What's in their memory?**
- Open the app's memory / saved-info page and go through it item by item:
  - Any **expired plans** written as if they're happening now?
  - Old facts that **contradict** each other?
  - Did the number of memories suddenly jump or drop?
- Copy expired items somewhere safe first, then update or delete them.

**4. Did what you said actually reach memory?**
- Pick three specific things you said in the last few days and look for them on the memory page, or ask a concrete question ("What did I say I had for dinner on Tuesday?").
- If **a whole stretch of days** is missing, not just scattered gaps, the memory system may have missed it. See the [amnesia-rescue human version](../amnesia-rescue/TIPS.md).

**5. Are the features still there?**
- Search, image reading, voice, files, connected services… did an update switch any of them off?
- Has a connected service's login expired? "Can't do what they used to" is often exactly that.

**6. What changed recently?**
- Write a timeline: on which day did it start feeling off? Did the app update around then? Did you switch models? Edit settings, persona, or custom instructions? Add new memories?
- Line the two timelines up. The answer often jumps out.

**7. Only then, the model.**
- Open a brand-new chat, send the exact same message, and compare.
  - New chat is fine → the old chat was too long or compressed; switch windows.
  - New chat is also off → only now consider that the model or platform itself changed.

### Finish with a checkup note

> **Verdict**: one line, which layer is at fault
> **Evidence**: what you saw for each item
> **Plan**: new window / clean stale memories / revert a setting / wait and watch
> **Not ruled out yet**: for next time

A day or two after fixing, walk the same list again.

### If you have a crew

If your home is self-built (your own server, chat bridge, memory store), give [SKILL.md](SKILL.md) to your builder agent. It can read real request logs and the memory store, which is far more accurate than looking at the app. Have it hand you the checkup report to confirm before it fixes anything.
