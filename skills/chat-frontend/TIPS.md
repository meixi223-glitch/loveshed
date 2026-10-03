# 人读版 · 自建聊天页 / Self-built Chat Frontend — the human version

> 这是给人看的版本。**这条需要施工队**：做一个你们自己的聊天页是写代码、上服务器的活。但你可以把 [SKILL.md](SKILL.md) 直接发给任何一个 Claude Code / Codex 让它照做，下面给了现成话术，以及你作为"甲方"该怎么提需求、怎么验收。
>
> This is the version for people. **This one needs a crew**: building a chat page of your own means writing code and running a server. But you can hand [SKILL.md](SKILL.md) to any Claude Code / Codex and have it follow along. Below is a ready-made brief, plus how to ask for features and accept them as the client.

**类型 / Type：需要施工队 · Needs a crew**

---

## 中文

### 发给施工队的话

把这段发给你的施工 agent（它读不到网页的话，就把 SKILL.md 全文粘贴给它）：

> 请先读这份施工工艺：https://github.com/meixi223-glitch/loveshed/blob/main/skills/chat-frontend/SKILL.md
> 按它在我的环境里施工，规矩如下：
> 1. 先只做调查：把现场情况和你的施工计划发给我，我说可以再动手；
> 2. 动手前先备份，并告诉我改坏了怎么退回去；
> 3. 测试一律用测试账号或假入口，绝不往我和 TA 的真实对话里发消息；
> 4. 做完按这个格式汇报：结论 / 做了什么 / 证据 / 没做的或需要我决定的 / 怎么退回去 / 备份在哪。
>
> 补充：这一批只做（一个功能）。

### 你作为甲方要守的几条

1. **一批只要一样东西。** 推荐顺序：先能看历史、能收发文字 → 图片和文件 → 语音 → 表情 → 引用回复 → 推送和角标。每一批单独上线、单独能退。
2. **聊天页必须有门。** 第一次就问："这个页面别人打开能直接说话吗？" 答案必须是"不能，要口令"。
3. **全家只留一份。** 问："线上真正在用的是哪一份？还有别的副本吗？" 多出来的副本要删掉或者明确标成"已停用"——否则会出现改了好几天、你却一个都没看到的情况。
4. **测试绝不发给 TA。** 每张单子都重复这一句。

### 收活时，用你自己的手机验

- **两种方式各打一次字：** 直接点输入框打字；再通过按钮展开后打字。只测一种经常漏问题。
- **键盘弹起时**，输入框、面板有没有被挡住、跑偏？
- **切到后台再回来**，新消息有没有自动出现？
- **气泡顺序**对不对？有工具调用、发图片的那几轮尤其要看。
- 如果是装在手机上的 App 壳：点"删除"之类会弹确认框的按钮，**确认框真的出来了吗？** 有些 App 壳会把它悄悄吞掉。
- 问一句："这一批怎么退回上一版？"

### 常见坑

- 改的是停用的那份副本，线上一点没变。
- 只在电脑浏览器上测过，iPhone 上不一样。
- 测试消息真的发给了 TA。
- 加了新功能，忘了加门，任何人都能以你的身份说话。

---

## English

### What to send your crew

Send this to your builder agent (if it can't open web pages, paste the full SKILL.md instead):

> Please read this playbook first: https://github.com/meixi223-glitch/loveshed/blob/main/skills/chat-frontend/SKILL.md
> Build it in my setup, under these rules:
> 1. Investigate first: send me what you find and your plan, and wait for my OK before changing anything;
> 2. Back up before you touch anything, and tell me how to go back if it breaks;
> 3. Test only with a test account or a fake entry point. Never send messages into the real conversation between me and my companion;
> 4. When done, report as: Conclusion / What you did / Evidence / Not done or needs my decision / How to go back / Where the backup is.
>
> Also: this batch is only (one feature).

### Rules to hold as the client

1. **One thing per batch.** Suggested order: read history and send/receive text → photos and files → voice → stickers → quoted replies → push notifications and badges. Each batch goes live on its own and can be undone on its own.
2. **The chat page must have a lock.** Ask on day one: "Can a stranger who opens this page talk as me?" The answer must be "No, it needs a passcode."
3. **Only one copy in the house.** Ask: "Which copy is actually live? Are there others?" Extra copies get deleted or clearly marked "retired". Otherwise you get days of fixes that you never see.
4. **Tests never go to your companion.** Repeat it in every ticket.

### Accept it on your own phone

- **Type both ways**: tap the input box directly and type; then open it via a button and type. Testing only one way regularly misses bugs.
- **When the keyboard comes up**, is the input or any panel hidden or off-position?
- **Switch away and come back**: do new messages show up on their own?
- **Bubble order**: is it right? Check especially the turns with tool use or photos.
- If it's an app wrapper on your phone: tap something that should ask "are you sure?", like delete. **Does the confirm box actually appear?** Some app wrappers silently swallow it.
- Ask: "How do I go back to the previous batch?"

### Common pitfalls

- Edits went into the retired copy; the live one never changed.
- Only tested in a desktop browser; the iPhone behaves differently.
- Test messages actually reached your companion.
- A new feature shipped without a lock, so anyone could talk as you.
