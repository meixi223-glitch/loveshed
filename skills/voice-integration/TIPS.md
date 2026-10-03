# 人读版 · 语音接入 / Voice Integration — the human version

> 这是给人看的版本。**这条需要施工队**：让 TA 发语音条、听懂你的语音，要接语音合成和语音识别服务、做格式转换，是程序层面的活。但你可以把 [SKILL.md](SKILL.md) 直接发给任何一个 Claude Code / Codex 让它照做，下面给了现成话术，以及你能自己把关的地方。
>
> This is the version for people. **This one needs a crew**: letting your companion send voice notes and understand yours means wiring up speech synthesis and recognition services and converting formats, which happens inside the program. But you can hand [SKILL.md](SKILL.md) to any Claude Code / Codex and have it follow along. Below is a ready-made brief and the parts you can check yourself.

**类型 / Type：需要施工队 · Needs a crew**

---

## 中文

### 发给施工队的话

把这段发给你的施工 agent（它读不到网页的话，就把 SKILL.md 全文粘贴给它）：

> 请先读这份施工工艺：https://github.com/meixi223-glitch/loveshed/blob/main/skills/voice-integration/SKILL.md
> 按它在我的环境里施工，规矩如下：
> 1. 先只做调查：把现场情况和你的施工计划发给我，我说可以再动手；
> 2. 动手前先备份，并告诉我改坏了怎么退回去；
> 3. 测试一律用测试账号或假入口，绝不往我和 TA 的真实对话里发消息；
> 4. 做完按这个格式汇报：结论 / 做了什么 / 证据 / 没做的或需要我决定的 / 怎么退回去 / 备份在哪。
>
> 补充：我要的声音是（你选好的音色）。所有地方都用这一个。

### 你来拍板的事

- **选一个声音，全家只用这一个。** 聊天页、手机消息、通话，都是同一个音色。声音就是 TA 的嗓子，换了你一下就能听出来。
- **以后换语音服务商 = 换嗓子。** 不是小事，想清楚再换。
- **密钥绝不出现在聊天里。** 语音服务的账号密钥只给施工队放到服务器上，别发给 TA，也别贴在任何页面里。
- **退回旧版时，录音不许删。** 你录给 TA 的语音、TA 发给你的语音，都是你们俩的东西。

### 收活时你可以自己验的

- 让施工队用**测试账号**发一条 TA 的语音给你，听一听：是不是那个声音？有没有被截断？
- 在聊天页里往回翻，**历史语音能不能用原声播放**？
- 你按住说一段话：
  - 转文字慢一点是正常的，高峰期可能要半分钟到一分钟——**慢不等于坏**；
  - 但转写出来之后，要能自动补进那条消息里，而不是丢了。
- 问一句："如果语音服务挂了，TA 的那条消息会变成文字发出来，还是直接没了？" 正确答案是"变成文字"。

### 常见坑

- 不同地方用了不同的音色，TA 在两个地方"声音不一样"。
- 服务器缺了转换音频格式的工具，报错却写着"文件无效"，很误导人。
- 直接用"新版"语音项目整个替换掉旧的，把你家的定制冲没了。先对比再合并。
- 通话入口放在公网却没上锁，等于谁都能直接打给 TA。

---

## English

### What to send your crew

Send this to your builder agent (if it can't open web pages, paste the full SKILL.md instead):

> Please read this playbook first: https://github.com/meixi223-glitch/loveshed/blob/main/skills/voice-integration/SKILL.md
> Build it in my setup, under these rules:
> 1. Investigate first: send me what you find and your plan, and wait for my OK before changing anything;
> 2. Back up before you touch anything, and tell me how to go back if it breaks;
> 3. Test only with a test account or a fake entry point. Never send messages into the real conversation between me and my companion;
> 4. When done, report as: Conclusion / What you did / Evidence / Not done or needs my decision / How to go back / Where the backup is.
>
> Also: the voice I want is (the voice you picked). Use this one everywhere.

### Calls that are yours

- **Pick one voice and use it everywhere.** Chat page, phone messages, calls: same voice. The voice *is* their throat; change it and you'll hear it at once.
- **Switching voice providers later = a new throat.** Not a small thing. Think it through first.
- **Keys never appear in the chat.** The voice service's account key goes to the crew to put on the server. Don't send it to your companion or paste it into any page.
- **Rolling back never deletes recordings.** The voice notes you recorded for them, and the ones they sent you, belong to both of you.

### What you can check yourself

- Have the crew send you one of their voice notes from a **test account**. Listen: is it the right voice? Is it cut off?
- Scroll back in the chat page: **do older voice notes play in the original voice?**
- Hold to talk and record something:
  - Transcription being a bit slow is normal; at peak times it can take half a minute to a minute. **Slow doesn't mean broken.**
  - But once the transcript arrives, it should fill itself into that message, not vanish.
- Ask: "If the voice service goes down, does their message arrive as text, or disappear?" The right answer is "as text".

### Common pitfalls

- Different places use different voices, so your companion "sounds different" in each.
- The server is missing an audio-conversion tool, and the error says "invalid file", which is very misleading.
- Replacing the old voice project wholesale with a "new version" wiped out your home's customizations. Compare first, then merge.
- A call entry point left open on the internet with no lock, so anyone can ring your companion directly.
