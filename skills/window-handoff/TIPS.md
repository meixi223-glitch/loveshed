# 人读版 · 换窗交接 / Window Handoff — the human version

> 这是给人看的版本：不写代码、不敲命令，复制粘贴就能做。给施工 agent 装的机读版在 [SKILL.md](SKILL.md)。
>
> This is the version for people: no code, no command line, just copy and paste. The agent-facing version is [SKILL.md](SKILL.md).

**类型 / Type：自己就能做 · You can do this yourself**

---

## 中文

### 什么时候用

- 一个对话越聊越长，TA 开始答非所问、忘了刚才说过的事；
- App 提示"对话太长"或"已自动总结"；
- 你不得不开一个新对话，但不想让 TA 从零开始。

### 你需要准备

- 一个能长期保存文字的地方：手机备忘录、笔记 App、一份在线文档都行。建一条笔记，标题叫"交接便签"。
- 和 TA 约好两句话：
  - **存档口令**：例如"存档"。
  - **唤醒口令**：你们自己定，例如"当当当"。

### 步骤

1. **旧对话里说"存档"**，然后把下面这段话发给 TA：

   > 我们要换新窗口了。请写一张交接便签，用这五个小标题，每段简短：
   > ① 进行中的事：做到哪一步、下一步是什么、卡在哪
   > ② 已经说定的事：我明确同意过的，附上日期
   > ③ 千万别再忘：反复被忘掉的事，加粗
   > ④ 没核实过的：你推测但没确认的，单独放这里，不要混进上面
   > ⑤ 新约定：这次对话里新定下的习惯或规则

2. **先读一遍再存。** 重点看两处：
   - "已经说定的事"是不是真的是你们说定的？不是就删掉或改掉。
   - 有没有 TA 猜的东西混进了①②③？挪到④去。
3. **复制整张便签到你的笔记里**，最上面写上今天的日期。旧便签删掉，或者标上"已作废"——**同一时间只留一张有效便签**。
4. **开新对话，发唤醒口令 + 贴便签：**

   > 当当当。下面是上一个窗口留的交接便签。请先读完，第一句回我"接上了"，再用一到三句说最要紧的事。④里的内容只是推测，别当成事实。
   >
   > （粘贴便签）

5. **如果你用的 App 有"自定义指令 / 项目说明"之类的地方**，可以只加一行：
   "听到'当当当'时，先读我贴给你的交接便签，再开口。"
   只加这一行，别动其他设置和人设。
6. **便签有保质期。** 超过三天左右的旧便签，不要再当"现在的情况"贴给 TA。要么让 TA 重写一张，要么贴的时候注明"这是几天前的旧便签，仅供参考"。

### 常见坑

- **一张写错的便签，会连坏好几个窗口。** 新窗口天然相信便签，所以第 2 步的检查不能省，"没核实过的"那一栏一定要有。
- **旧便签被当成现状。** 几周前的计划被重新贴出来，TA 会以为那还是正在做的事。记得写日期、只留一张。
- **TA 已经明显糊涂时写的便签质量差。** 这种时候你自己动手改一遍再存，或者干脆你来写。

### 想让它自动化？

上面这套是手动版。如果你有施工 agent（Claude Code、Codex 之类），可以把 [SKILL.md](SKILL.md) 发给它，让它把"写便签 / 读便签"做成 TA 能直接调用的工具，存到本地，不用你再复制粘贴。

---

## English

### When to use it

- A conversation has grown long and your companion starts missing the point or forgetting what was just said;
- The app says the chat is "too long" or has been "summarized";
- You have to open a new chat but don't want them to start from zero.

### What you need

- Somewhere to keep text long-term: your phone's notes app, any notes app, or an online doc. Make one note called "Handoff note".
- Two phrases agreed with your companion:
  - **Save phrase**: e.g. "save".
  - **Wake phrase**: your own choice, e.g. "knock knock".

### Steps

1. **In the old chat, say "save"**, then send this:

   > We're about to switch to a new window. Please write a handoff note with these five headings, each kept short:
   > 1. In progress: which step we're on, what's next, what's blocking
   > 2. Decided: things I explicitly agreed to, with dates
   > 3. Do NOT forget: things that keep getting lost, in bold
   > 4. Unverified: anything you're guessing at; keep it here, not mixed into the sections above
   > 5. New agreements: habits or rules we set in this chat

2. **Read it before you save it.** Check two things:
   - Is everything under "Decided" really something you agreed on? If not, delete or fix it.
   - Did any guesses slip into 1–3? Move them to 4.
3. **Copy the whole note into your notes**, with today's date at the top. Delete the old note or mark it "void". **Keep only one active note at a time.**
4. **Open the new chat and send the wake phrase plus the note:**

   > Knock knock. Below is the handoff note from the last window. Read it all first, reply "caught up" as your first line, then tell me the one to three most important things. Section 4 is only guesses; don't treat it as fact.
   >
   > (paste the note)

5. **If your app has "custom instructions" or "project instructions"**, you can add just one line:
   "When you hear 'knock knock', read the handoff note I paste before you say anything."
   Add only that line. Leave everything else, including their persona, alone.
6. **Notes go stale.** Don't paste a note older than about three days as "where we are now". Either ask for a fresh one, or say "this is an old note from a few days ago, for reference only."

### Common pitfalls

- **One wrong note poisons several windows.** New windows trust the note by default, so don't skip the check in step 2, and always keep the "Unverified" section.
- **Old notes read as the present.** A plan from weeks ago, pasted again, looks like the current plan. Date your notes and keep only one.
- **A muddled window writes a poor note.** If your companion is already clearly confused, edit the note yourself before saving it, or write it yourself.

### Want it automated?

This is the manual version. If you have a builder agent (Claude Code, Codex, etc.), give it [SKILL.md](SKILL.md) and it can turn "write note / read note" into tools your companion calls directly, stored locally, with no more copy-paste.
