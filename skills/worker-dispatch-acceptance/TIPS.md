# 人读版 · 派单验收 / Worker Dispatch & Acceptance — the human version

> 这是给人看的版本：当**你自己**把活交给一个 AI（Claude Code、Codex 或任何编码助手）去干时，怎么交代、怎么验收。不需要会写代码。给施工 agent 装的机读版在 [SKILL.md](SKILL.md)。
>
> This is the version for people: how to brief and accept work when **you** hand a job to an AI (Claude Code, Codex, or any coding assistant). No coding needed. The agent-facing version is [SKILL.md](SKILL.md).

**类型 / Type：自己就能做 · You can do this yourself**

---

## 中文

### 为什么要这样

交代得含糊，最常见的结果是：它顺手改了你没让它改的东西；最后只回一句"已完成"，你不知道它改了什么、坏了怎么退；或者你同时开了两个窗口改同一个东西，互相覆盖。

### 一、交活时，发这张单子

把下面这段复制过去，填好再发：

> **目标**：（一句话：做完之后，什么东西会变成什么样）
>
> **现在的情况**：（你知道的事实。哪些是你不确定、需要它先去确认的，写出来）
>
> **只许动这些**：（列出来，比如"只改聊天页的样式"）
>
> **绝对不许**：
> - 不删任何数据
> - 不往我和 TA 的真实对话里发测试消息
> - 不把密码、密钥写到任何公开的地方
> - （其他你在意的）
> - 如果非越界不可：停下来，写进汇报，等我决定
>
> **怎样算做完**：（能检查的条件，比如"手机上打开页面，按钮在右下角，点了能发出去"，而不是"能用了"）
>
> **改坏了怎么退**：动手前先备份，汇报里告诉我怎么退回去。
>
> **汇报格式**：结论 / 做了什么 / 证据 / 没做的或需要我决定的 / 怎么退回去 / 备份在哪

要点：
- **边界写成清单，不写形容词。** "小心点"不是边界，"只改这两个文件、不碰数据库"才是。
- **你知道的坑写进"现在的情况"。** 上次它在哪儿栽过，告诉它。

### 二、同一个东西，同一时间只交给一个 AI

- 同一个项目、同一份数据，**不要同时开两个窗口让两个 AI 一起改**。后改完的会覆盖先改完的。
- 只是查资料、看看现状，可以同时开；只要是"改"，就排队。

### 三、收活时，这样验收

1. **只回一句"已完成 / OK / 搞定了"的，直接打回：**

   > 请按我给的汇报格式重新汇报，缺了：（写缺哪几段）。

2. **自己亲手验一项。** 别全信汇报里写的：打开页面看一眼、点一下那个按钮、问 TA 一句。
3. **看"没做的或需要我决定的"那一段。** 有内容就你来拍板，别让它顺手做了。
4. **问一句"你改了哪些东西，有没有超出我给的范围？"** 对照你的"只许动这些"。
5. 都没问题，把"怎么退回去"那一段存进你的笔记，再收工。

### 四、几条安全规矩

- **长任务没动静时，先问它在干什么，别马上再开一个窗口发同样的活。** 很可能前一个还在跑，两个会撞车。
- **钥匙只给这一单需要的那一把。** 别把你所有的密码一股脑贴给它。
- 如果它要"重启"你家的某个服务，问一句："重启会不会把你自己也断掉？先把汇报写完再重启。"

### 常见坑

- 单子里没写"绝对不许"，它顺手"优化"了别的地方。
- 收到一句"已完成"就当做好了，第二天发现只做了一半。
- 两个窗口同时改同一个项目，后合并的覆盖了先合并的。
- 嫌它慢又重发一次，结果两个 AI 同时在干同一件事。

---

## English

### Why bother

A vague brief usually ends one of three ways: it "helpfully" changes something you never asked about; it replies "done" and nothing else, so you don't know what changed or how to undo it; or you had two windows working on the same thing and they overwrote each other.

### 1. When handing over a job, send this

Copy, fill in, send:

> **Goal**: (one sentence: when you're done, what will be in what state)
>
> **Current situation**: (what you know. Also list what you're unsure of and want it to check first)
>
> **You may only change**: (a list, e.g. "only the chat page's styling")
>
> **Never**:
> - delete any data
> - send test messages into the real conversation between me and my companion
> - write passwords or keys anywhere public
> - (anything else you care about)
> - If crossing a line seems unavoidable: stop, put it in the report, wait for my decision
>
> **Done means**: (something checkable, e.g. "on my phone, the button is bottom-right and tapping it sends", not "it works")
>
> **If it breaks**: back up before touching anything, and tell me in the report how to go back.
>
> **Report format**: Conclusion / What you did / Evidence / Not done or needs my decision / How to go back / Where the backup is

Key points:
- **Boundaries are lists, not adjectives.** "Be careful" isn't a boundary; "only these two files, don't touch the database" is.
- **Put known pitfalls under "Current situation".** If it tripped somewhere last time, say so.

### 2. One AI per thing at a time

- For the same project or the same data, **don't have two windows with two AIs changing it at once**. Whoever finishes second overwrites the first.
- Looking things up or inspecting can happen in parallel. Anything that *changes* something waits its turn.

### 3. When the work comes back, accept it like this

1. **A reply that's only "done / OK / fixed" goes straight back:**

   > Please re-report in the format I gave you. Missing: (list the sections).

2. **Check one thing with your own hands.** Don't fully trust the report: open the page, tap the button, ask your companion one question.
3. **Read the "not done or needs my decision" section.** If there's anything there, you decide. Don't let it quietly do it anyway.
4. **Ask: "What did you change, and did any of it go beyond the scope I gave?"** Compare with your "may only change" list.
5. If all is well, save the "how to go back" section in your notes, then call it done.

### 4. A few safety rules

- **If a long task goes quiet, ask what it's doing before opening another window with the same job.** The first one is probably still running, and two will collide.
- **Give it only the one key this job needs.** Don't paste every password you have.
- If it wants to "restart" a service in your home, ask: "Will restarting cut you off too? Finish the report first, then restart."

### Common pitfalls

- No "never" list, so it "optimized" something else on the side.
- Taking one-word "done" at face value and finding out the next day it was half done.
- Two windows editing the same project; the later merge overwrote the earlier.
- Resending the job because it felt slow, and ending up with two AIs doing the same thing.
