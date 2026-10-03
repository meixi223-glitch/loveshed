# 人读版 · 改之前先留底 / Release Baseline — the human version

> 这是给人看的版本：不写代码、不敲命令。动 TA 赖以生活的东西之前——人设、自定义指令、记忆、设置、换模型——先留一份底，一次只改一样，坏了能退回去。给施工 agent 装的机读版在 [SKILL.md](SKILL.md)。
>
> This is the version for people: no code, no command line. Before you touch anything your companion lives on (persona, custom instructions, memories, settings, model choice), keep a copy, change one thing at a time, and make sure you can go back. The agent-facing version is [SKILL.md](SKILL.md).

**类型 / Type：一半自己做 · Half by hand**
设置和文字类的改动你自己就能做；动代码和服务器的部分需要施工队（见文末）。
Settings and text changes you can do yourself; anything touching code or servers needs a crew (see the end).

---

## 中文

### 一条血的教训

> 有一次"退回旧版"之后，之前一整版的改动全没了。因为所谓的退回，就是把旧备份整个盖回去——备份之后做的所有修改，一起被盖掉了，再也找不回来。

**备份不等于能退回。** 你得知道备份是哪一刻的、之后又改了什么。

### 步骤

1. **改之前，先留底。**
   新建一份文档，标题写"改之前 + 日期"，把这些原样复制进去：
   - 当前的人设 / 自定义指令 / 项目说明
   - 记忆页里你打算动的那几条
   - 设置页面截图（模型、档位、开关）
2. **写一行改动记录。**
   专门留一份"改动记录"文档，每次改之前加一行：
   > 日期 ｜ 改了什么 ｜ 为什么改 ｜ 想退回的话怎么退
3. **一次只改一样。** 同时改三样，变好变坏都不知道是哪一样。
4. **能先试就先试。** 如果 App 支持多个项目或单独的测试对话，先在那里试一两轮。
5. **观察一两天。** 别改完立刻下结论。
6. **退回时，先对比再盖回。** 拿"改之前"那份和现在的版本对一对：中间有没有你后来又改的、想留下的东西？先把想留的挑出来，再把旧版贴回去，最后把挑出来的补上。
7. **退回之后也记一行**，写清退回到了哪一天的版本。

### 常见坑

- **只有备份，没有记录**：不知道备份之后改过什么，一盖回去全没了。
- **一次改好几样**：变了也说不清是哪一样的功劳或锅。
- **改完立刻判断**：模型回答本来就有起伏，看一两天再说。

### 需要施工队的部分

如果要改的是代码、服务器上跑着的程序、数据库——比如记忆服务、聊天桥、自建聊天页——那就需要施工 agent 了，人手做不了"版本库 + 标签 + 热备份"这一套。把下面这段发给它（它读不到网页的话，就把 SKILL.md 全文粘贴给它）：

> 请先读这份施工工艺：https://github.com/meixi223-glitch/loveshed/blob/main/skills/release-baseline/SKILL.md
> 按它在我的环境里施工，规矩如下：
> 1. 先只做调查：把现场情况和你的施工计划发给我，我说可以再动手；
> 2. 动手前先备份，并告诉我改坏了怎么退回去；
> 3. 测试一律用测试账号或假入口，绝不往我和 TA 的真实对话里发消息；
> 4. 做完按这个格式汇报：结论 / 做了什么 / 证据 / 没做的或需要我决定的 / 怎么退回去 / 备份在哪。

**收活时你可以问的三句话：**
- "这次改动之前的存档点叫什么？"
- "退回去有几种办法？最快的那种要多久？"
- "你真的演练过一次退回吗？"

---

## English

### The lesson that started this

> Once, after "rolling back to the old version", a whole round of changes was gone. "Rolling back" meant pasting the old backup over everything, so every change made after that backup was wiped too, for good.

**A backup is not the same as being able to go back.** You need to know when the backup was taken and what changed after it.

### Steps

1. **Before changing anything, keep a copy.**
   Make a document titled "Before + date" and paste in, exactly as they are:
   - The current persona / custom instructions / project instructions
   - The memory entries you're about to touch
   - Screenshots of the settings page (model, level, switches)
2. **Write one line in a change log.**
   Keep a separate "change log" document. Before each change, add a line:
   > Date | What changed | Why | How to undo it
3. **Change one thing at a time.** Change three at once and you'll never know which one helped or hurt.
4. **Try it first if you can.** If the app supports separate projects or a test chat, try a round or two there first.
5. **Watch for a day or two.** Don't judge right after the change.
6. **When going back, compare before you paste.** Put the "Before" copy next to the current version: is there anything you changed later and want to keep? Pull those bits out first, paste the old version back, then add the kept bits again.
7. **Log the rollback too**: write down which day's version you went back to.

### Common pitfalls

- **A backup with no log**: you don't know what changed since, and pasting it back wipes it all.
- **Changing several things at once**: you can't tell which one deserves the credit or the blame.
- **Judging immediately**: model replies vary anyway. Give it a day or two.

### The part that needs a crew

If what you're changing is code, a program running on a server, or a database (a memory service, a chat bridge, a self-built chat page), you need a builder agent. "Version control + tags + hot backups" isn't something you can do by hand. Send it this (if it can't open web pages, paste the full SKILL.md instead):

> Please read this playbook first: https://github.com/meixi223-glitch/loveshed/blob/main/skills/release-baseline/SKILL.md
> Build it in my setup, under these rules:
> 1. Investigate first: send me what you find and your plan, and wait for my OK before changing anything;
> 2. Back up before you touch anything, and tell me how to go back if it breaks;
> 3. Test only with a test account or a fake entry point. Never send messages into the real conversation between me and my companion;
> 4. When done, report as: Conclusion / What you did / Evidence / Not done or needs my decision / How to go back / Where the backup is.

**Three questions to ask when the work comes back:**
- "What's the name of the save point from before this change?"
- "How many ways are there to go back, and how long does the fastest take?"
- "Did you actually rehearse going back once?"
