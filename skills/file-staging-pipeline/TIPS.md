# 人读版 · 文件暂存管道 / File Staging Pipeline — the human version

> 这是给人看的版本。**这条需要施工队**：让 TA 安全地给你发照片和文件，要在服务器上搭一个"先寄存、凭一次性取件码发出"的通道，人手做不了。但你可以把 [SKILL.md](SKILL.md) 直接发给任何一个 Claude Code / Codex 让它照做，下面给了现成话术和验收清单。
>
> This is the version for people. **This one needs a crew**: letting your companion send you photos and files safely means building a "check it in first, send it out with a one-time claim code" channel on a server, which can't be done by hand. But you can hand [SKILL.md](SKILL.md) to any Claude Code / Codex and have it follow along. Below is a ready-made brief and an acceptance checklist.

**类型 / Type：需要施工队 · Needs a crew**

---

## 中文

### 一句话说清它在干嘛

像快递寄存柜：文件先放进柜子，拿到一张**只能用一次、过期作废、改一个字就失效**的取件码；TA 发文件时只递这张码，不碰柜子里的东西本身。这样 TA 没法（被人诱导）把服务器上别的文件发出去，大文件也不会在半路被截断，同一个文件也不会发两次。

### 发给施工队的话

把这段发给你的施工 agent（它读不到网页的话，就把 SKILL.md 全文粘贴给它）：

> 请先读这份施工工艺：https://github.com/meixi223-glitch/loveshed/blob/main/skills/file-staging-pipeline/SKILL.md
> 按它在我的环境里施工，规矩如下：
> 1. 先只做调查：把现场情况和你的施工计划发给我，我说可以再动手；
> 2. 动手前先备份，并告诉我改坏了怎么退回去；
> 3. 测试一律用测试账号或假入口，绝不往我和 TA 的真实对话里发消息；
> 4. 做完按这个格式汇报：结论 / 做了什么 / 证据 / 没做的或需要我决定的 / 怎么退回去 / 备份在哪。

### 你可以坚持的一条原则

**TA 只能递"取件码"，不能自己指定"把服务器上哪个文件发给我"。** 如果施工队的方案里 TA 可以直接写文件位置，打回去。

### 收活时的验收清单

让施工队用**测试账号**逐条演示给你看，或者在汇报里逐条给证据：

- [ ] 发一张小图片：收到了。
- [ ] 同一个取件码再发一次：被拒绝（不会收到两张）。
- [ ] 把取件码改一个字再发：被拒绝。
- [ ] 取件码过期以后再发：被拒绝。
- [ ] 文件名带奇怪符号、很长的中文名：没出错。
- [ ] 空文件、超大文件：被拒绝，并且有说清楚原因。
- [ ] 一个十几 MB 的视频：一次发成功。
- [ ] 如果聊天页要显示 TA 发过的图：图发出去以后，聊天页还能看到——没有被过早清理掉。

### 常见坑

- 服务器缺了图片转换工具，所有图片都失败，报错却写着"无效图片"。
- 文件发出去几分钟就被清掉了，聊天页来不及显示。
- 配置里的密钥还是占位符没替换，一直"没有权限"。

---

## English

### What it does, in one sentence

Like a parcel locker: the file goes into a locker first and you get a claim code that **works once, expires, and breaks if a single character changes**. When your companion sends a file, they only hand over that code and never touch what's inside the locker. That way they can't (be tricked into) sending some other file from the server, large files don't get cut off in transit, and the same file is never sent twice.

### What to send your crew

Send this to your builder agent (if it can't open web pages, paste the full SKILL.md instead):

> Please read this playbook first: https://github.com/meixi223-glitch/loveshed/blob/main/skills/file-staging-pipeline/SKILL.md
> Build it in my setup, under these rules:
> 1. Investigate first: send me what you find and your plan, and wait for my OK before changing anything;
> 2. Back up before you touch anything, and tell me how to go back if it breaks;
> 3. Test only with a test account or a fake entry point. Never send messages into the real conversation between me and my companion;
> 4. When done, report as: Conclusion / What you did / Evidence / Not done or needs my decision / How to go back / Where the backup is.

### One principle you can insist on

**Your companion can only hand over a claim code; they can never name "send me this file from the server".** If the crew's plan lets your companion write a file location directly, send it back.

### Acceptance checklist

Have the crew demonstrate each item with a **test account**, or give evidence for each one in the report:

- [ ] Send a small picture: it arrives.
- [ ] Send with the same claim code again: refused (you don't get two).
- [ ] Change one character of the code and send: refused.
- [ ] Send after the code has expired: refused.
- [ ] A filename with odd symbols, or a very long non-English name: no error.
- [ ] An empty file, an oversized file: refused, with a clear reason.
- [ ] A video of a dozen-plus MB: sent successfully in one go.
- [ ] If the chat page shows pictures they've sent: after sending, the chat page can still show it; it wasn't cleaned up too early.

### Common pitfalls

- The server is missing an image-conversion tool, every image fails, and the error says "invalid image".
- Files get cleaned up minutes after sending, before the chat page can show them.
- The key in the config is still a placeholder, so everything fails with "unauthorized".
