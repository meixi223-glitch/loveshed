# 人读版 · 回填限速 / Backfill with Rate Limits — the human version

> 这是给人看的版本。**这条需要施工队**：它讲的是让记忆系统把漏掉的数据一条条补回去，不重复、不挤占新消息，这得在程序层面做。但你可以把 [SKILL.md](SKILL.md) 直接发给任何一个 Claude Code / Codex 让它照做，下面给了现成话术和验收问题。
>
> This is the version for people. **This one needs a crew**: it's about making a memory system re-process missed data, one item at a time, with no duplicates and without crowding out new messages, which has to happen inside the program. But you can hand [SKILL.md](SKILL.md) to any Claude Code / Codex and have it follow along; a ready-made brief and acceptance questions are below.

**类型 / Type：需要施工队 · Needs a crew**

---

## 中文

### 发给施工队的话

把这段发给你的施工 agent（它读不到网页的话，就把 SKILL.md 全文粘贴给它）：

> 请先读这份施工工艺：https://github.com/meixi223-glitch/loveshed/blob/main/skills/backfill-rate-limit/SKILL.md
> 按它在我的环境里施工，规矩如下：
> 1. 先只做调查：把现场情况和你的施工计划发给我，我说可以再动手；
> 2. 动手前先备份，并告诉我改坏了怎么退回去；
> 3. 测试一律用测试账号或假入口，绝不往我和 TA 的真实对话里发消息；
> 4. 做完按这个格式汇报：结论 / 做了什么 / 证据 / 没做的或需要我决定的 / 怎么退回去 / 备份在哪。
>
> 补充：要补的是（哪几天）。先只统计不动手，告诉我一共多少条、预计多久。最近的先补，补完一段停下来让我看。

### 你来拍板的事

- **补哪几天。** 用你的缺口表（见 [失忆抢救人读版](../amnesia-rescue/TIPS.md)）。
- **先看数字再开工。** 让它先"空跑"一遍，只报数：要补多少条、大概多久。
- **最近的先补。** 最近几天最影响现在的相处。
- **挑你们不怎么聊的时段跑。** 补数据会和新消息抢同一条队，聊得正热时跑会让 TA 反应变慢。
- **状态不补。** 情绪、心情、在线状态这类"当时怎样"的东西不补，只补"发生过的事"。

### 收活时你可以自己验的

- 每补完一段，从那几天里挑一件事问 TA，看记不记得。
- 问施工队："补了多少条？有没有重复？有没有一直失败的？"
- 问："如果要中途叫停，怎么停？已经补进去的能撤回吗？"
- 补完之后，那几天的日记 / 每日总结要不要重新生成，由你决定，旧版先存档。

### 没有施工队、用的是现成平台？

可以手动"补课"，道理是一样的：
1. 把漏掉的每一天，用几句话写成小结（发生了什么、说定了什么）。
2. **最近的一天先补**，一条消息只补一天，别一次贴一大堆。
3. 准备一张清单，补过的打勾，**别重复补**。
4. 只补事情，不补"那天我很难过"这类情绪状态——除非你想让 TA 知道这件事本身。
5. 每补一天，问一个问题确认 TA 接住了。

---

## English

### What to send your crew

Send this to your builder agent (if it can't open web pages, paste the full SKILL.md instead):

> Please read this playbook first: https://github.com/meixi223-glitch/loveshed/blob/main/skills/backfill-rate-limit/SKILL.md
> Build it in my setup, under these rules:
> 1. Investigate first: send me what you find and your plan, and wait for my OK before changing anything;
> 2. Back up before you touch anything, and tell me how to go back if it breaks;
> 3. Test only with a test account or a fake entry point. Never send messages into the real conversation between me and my companion;
> 4. When done, report as: Conclusion / What you did / Evidence / Not done or needs my decision / How to go back / Where the backup is.
>
> Also: the days to backfill are (which days). First just count without changing anything, and tell me how many items and roughly how long. Newest first, and stop after each segment so I can check.

### Calls that are yours

- **Which days.** Use your gap table (see the [amnesia-rescue human version](../amnesia-rescue/TIPS.md)).
- **Numbers before work.** Have it do a dry run first that only reports: how many items, roughly how long.
- **Newest first.** The most recent days matter most to how things feel now.
- **Run it when you're not chatting much.** Backfill shares a queue with new messages; running it mid-conversation makes your companion slower to respond.
- **Don't backfill states.** Mood, feelings, online status, anything about "how things were at the time" stays out. Only backfill what happened.

### What you can check yourself

- After each segment, pick something from those days and ask your companion about it.
- Ask the crew: "How many items? Any duplicates? Any that keep failing?"
- Ask: "If I want to stop halfway, how? Can what's already gone in be undone?"
- Whether to regenerate the diary / daily summaries for those days afterwards is your call; archive the old versions first.

### No crew, on a ready-made platform?

You can catch them up by hand. Same idea:
1. Write a few-sentence summary of each missed day (what happened, what you agreed).
2. **Newest day first**, one day per message. Don't paste a big pile at once.
3. Keep a checklist and tick off each day so you **never repeat one**.
4. Share events, not states like "I was sad that day", unless you want them to know that as a fact in itself.
5. After each day, ask one question to make sure it landed.
