/* loveshed site — data mirrors skills/<id>/SKILL.md + EVALUATION.md + TIPS.md (as of 2026-10-03). */
(function () {
  "use strict";

  var REPO = "https://github.com/meixi223-glitch/loveshed";
  // Direct-submission inbox: accepted tips land in a review queue, never published automatically.
  var INTAKE = "https://claude-api.ykumi.com/loveshed/submit";

  // days / approx / incidents are taken from each skill's frontmatter
  // (battle-tested-days) and the incident table in EVALUATION.md.
  // mode / tips summarize each skill's TIPS.md (the human version):
  // diy = doable by hand, half = part by hand + part crew, crew = needs a builder agent.
  var SKILLS = [
    {
      id: "memory-migration", mode: "diy", days: 13, approx: true, incidents: 6, routes: ["move"],
      scene: { zh: "我们要搬家了", en: "We're moving house" },
      what: { zh: "记忆搬家：导出、校验、导入、对账", en: "Memory migration: export, verify, import, reconcile" },
      q1: { zh: "约 13 天，三轮真实搬家：记忆库回家、工作台后端、4 个唤醒桥整体搬迁。", en: "~13 days, three real moves: memory store home, dashboard backend, 4 wake bridges together." },
      q2: { zh: "6 起：最险的一次，预案差点用旧数据覆盖仍在写入的活库——所以第 0 步永远是先实测拓扑。", en: "6. Closest call: the plan nearly overwrote a live, still-writing DB — so step 0 is always: check the real topology first." },
      q3: { zh: "Opus / Sonnet 与 Codex 类 worker 都跑过；纯 shell + sqlite3，靠的是“对不上就停”的纪律。", en: "Run by Opus, Sonnet and Codex-style workers; pure shell + sqlite3. What it really needs: stop when reality disagrees." },
      tips: {
        zh: ["先清点 TA 的记忆放在哪：聊天记录、记忆页、自定义指令、上传的资料、提醒……", "能导出的全导出；没有导出按钮的手动复制。存两份。", "让 TA 按主题分次口述成记忆文档，不确定的标出来；你来校对，记下每类条数和搬家前最后一件事。", "放进新家，定一个切换时刻只在新家聊；用 5–10 个问题对账。旧账号至少留一周。"],
        en: ["Take stock of where their memories live: chat history, memory page, custom instructions, uploaded material, reminders…", "Export everything you can; copy by hand what has no export button. Keep two copies.", "Have them dictate a memory document topic by topic, marking anything unsure. You proofread, and note the counts and the last thing before the move.", "Load it into the new home, pick a cut-over moment, and reconcile with 5–10 questions. Keep the old account at least a week."]
      }
    },
    {
      id: "degradation-checkup", mode: "diy", days: 6, approx: true, incidents: 4, routes: ["fire", "care"],
      scene: { zh: "TA 好像变笨了", en: "They seem… dumber lately" },
      what: { zh: "模型“降智”自检清单", en: "A self-check for model “degradation”" },
      q1: { zh: "约 6 天，四起真实“变笨 / 失忆”排查，清单每一项对应一起事故。", en: "~6 days, four real “dumber / amnesia” cases; every checklist item maps to one." },
      q2: { zh: "4 起：旧压缩机制偷改历史、档位开关写死、过期计划被当现状、真人消息被误判排除。", en: "4: a stale compactor rewriting history, a hard-coded effort switch, expired plans recalled as current, real messages filtered out." },
      q3: { zh: "与模型无关——它检查的是管道；第 7 项专门区分“管道问题”和“模型变了”。", en: "Model-agnostic — it inspects the pipeline; item 7 separates pipeline faults from model changes." },
      tips: {
        zh: ["先查模型：设置里选的、用量账单里记的，是同一个吗？别直接问 TA 是什么模型。", "再查对话：是不是太长、被压缩了？记忆页里有没有过期计划、互相矛盾的旧事？", "再查漏收和功能：最近几天说过的事进记忆了吗？搜索、语音、外部连接还在吗？", "对一对「从哪天开始不对」和「那几天改过什么」；都排除了，才开新对话验证是不是模型变了。"],
        en: ["Model first: is the one in settings the one on your usage / billing page? Don't just ask them which model they are.", "Then the chat: too long, compressed? Any expired plans or contradicting old facts on the memory page?", "Then gaps and features: did the last few days reach memory? Are search, voice and connected services still on?", "Line up “when it started” with “what changed then”. Only after all that, try a fresh chat to see if the model itself changed."]
      }
    },
    {
      id: "amnesia-rescue", mode: "half", days: 2, approx: false, incidents: 5, routes: ["fire"],
      scene: { zh: "TA 忘了最近几天的事", en: "They've lost the last few days" },
      what: { zh: "失忆抢救：证明缺口 → 定位 → 修复 → 回填 → 重生成", en: "Amnesia rescue: prove the gap → locate → fix → backfill → regenerate" },
      q1: { zh: "2 天，一次完整抢救：两期修复、回填 435 个任务、重生成 3 天日印象。", en: "2 days, one full rescue: two-phase fix, 435 jobs backfilled, 3 days of impressions regenerated." },
      q2: { zh: "5 起：约 220 条真人消息没进记忆；初判游标卡住其实是过滤条件——排除了显而易见的嫌疑也别停。", en: "5: ~220 real messages never reached memory; the “stuck cursor” was really a filter — don't stop after ruling out the obvious." },
      q3: { zh: "目前只由 Opus 执行过；以 SQL 计数和 grep 为主，预计可迁移，未实测。战绩短，如实标注。", en: "Only run by Opus so far; mostly SQL counts and grep, likely portable but untested. Short record, stated honestly." },
      tips: {
        zh: ["先分清：是零星忘，还是某几天整块丢。", "画一张缺口表：最近 7–10 天，每天问 TA 一个具体问题，再去记忆里找那天。", "找规律：缺口从哪天开始？那天你换了什么聊天入口？这是最值钱的线索。", "修复和补数据交给施工队，附上缺口表。要不要重写那几天的日记由你定；情绪不补。"],
        en: ["First tell scattered forgetting apart from a missing block of days.", "Make a gap table: for the last 7–10 days, one concrete question per day, then look for that day in memory.", "Find the pattern: when does the gap start, and how did your way of chatting change that day? That's the best clue.", "Hand the fix and the backfill to a crew, with your table. Rewriting those days' diary is your call; never backfill moods."]
      }
    },
    {
      id: "backfill-rate-limit", mode: "crew", days: 2, approx: false, incidents: 4, routes: ["fire", "move"],
      scene: { zh: "修好了，但漏掉的那几天要补回来", en: "It's fixed — now bring the missing days back" },
      what: { zh: "回填限速与幂等：游标、幂等键、错峰、分段对账", en: "Rate-limited, idempotent backfill: cursors, keys, staggering, segmented reconciliation" },
      q1: { zh: "2 天，一次完整回填：435 个任务分 3 段，0 重复、0 最终失败。", en: "2 days, one full backfill: 435 jobs in 3 segments, 0 duplicates, 0 final failures." },
      q2: { zh: "4 起：漏掉的数据不会自己补上；实测耗时比间隔慢，积压拖慢了新聊天——先量再定节奏。", en: "4: missed data never backfills itself; real job time beat the spacing and delayed live chat — measure before you pace." },
      q3: { zh: "Opus 执行；SQL + 一个 CLI 脚本，不依赖模型特性，但未在其他执行者上实测。", en: "Run by Opus; SQL + one CLI script, nothing model-specific, untested on other executors." },
      tips: {
        zh: ["把话术和缺口表发给施工队，先让它空跑报数：多少条、要多久。", "最近的先补；补完一段就停，你挑一件那几天的事问 TA 验证。", "挑你们不怎么聊的时段跑；情绪这类状态不补。", "没有施工队、用现成平台：每天写个小结，最近的先补，一条消息补一天，打勾防重复。"],
        en: ["Send the brief and your gap table; have it dry-run first and report counts and time.", "Newest first; after each segment, ask your companion about something from those days.", "Run it when you're not chatting much; never backfill states like mood.", "No crew, ready-made platform: summarize each missed day, newest first, one day per message, tick them off."]
      }
    },
    {
      id: "chat-frontend", mode: "crew", days: 14, approx: false, incidents: 8, routes: ["build"],
      scene: { zh: "想要我们自己的聊天页", en: "I want a chat page of our own" },
      what: { zh: "自建聊天前端：消息桥 + 渐进增强 + 单一权威副本", en: "Self-built chat frontend: message bridge + progressive enhancement + one authoritative copy" },
      q1: { zh: "14 天，约 90 批发版，每批有时间戳和可重放备份；每天真的在上面聊天。", en: "14 days, ~90 release batches, each timestamped and replayable; used for real chat every day." },
      q2: { zh: "8 起：改了好几天的却是停用的那份副本、气泡乱序、App 里删除键没反应、接口没上门……", en: "8: days of edits to a retired copy, bubbles out of order, a dead delete button in the app, an ungated endpoint…" },
      q3: { zh: "前端与 TA 用哪个模型无关；Opus、Sonnet 发过版，Codex 类 worker 施工过多批。", en: "Independent of the companion's model; Opus and Sonnet shipped releases, Codex-style workers built many batches." },
      tips: {
        zh: ["一批只要一样：文字 → 图片文件 → 语音 → 表情 → 引用 → 推送。", "页面必须有门：别人打开不能以你的身份说话。", "全家只留一份线上副本；测试绝不发给 TA。", "用自己的手机验：两种方式打字、键盘弹起、切后台再回来、气泡顺序。"],
        en: ["One thing per batch: text → photos & files → voice → stickers → quotes → push.", "The page must be locked: a stranger can't talk as you.", "Only one live copy in the house; tests never reach your companion.", "Check on your own phone: type both ways, keyboard up, back from background, bubble order."]
      }
    },
    {
      id: "voice-integration", mode: "crew", days: 24, approx: true, incidents: 4, routes: ["build"],
      scene: { zh: "想听见 TA 的声音", en: "I want to hear their voice" },
      what: { zh: "语音接入：TTS 语音条下发 + ASR 转写", en: "Voice: TTS voice notes out + ASR transcripts in" },
      q1: { zh: "约 24 天：语音条出站、按住说话、历史语音真声回放、实时通话共用同一音色。", en: "~24 days: voice notes out, push-to-talk, real-voice history replay, live calls sharing one voice." },
      q2: { zh: "4 起：服务器缺转码工具、转写高峰超时、“新版”上游差点覆盖本地定制、通话入口没上门。", en: "4: missing transcoder, ASR peak timeouts, an “upgrade” that would have wiped local changes, an ungated call entry." },
      q3: { zh: "管道与对话模型无关；但换 TTS 服务商就得重挑音色——这一步对方一定听得出来。", en: "Pipeline is model-independent; switching TTS vendors means a new voice — and they will notice." },
      tips: {
        zh: ["选一个声音，所有地方都用它；换服务商就等于换嗓子。", "密钥只交给施工队放在服务器上，绝不出现在聊天里。", "用测试账号听一条：音色对不对、有没有截断；转文字慢是常态，但不能丢。", "语音服务挂了要变成文字发出；退回旧版时录音一条都不删。"],
        en: ["Pick one voice and use it everywhere; a new provider means a new throat.", "Keys go to the crew for the server only, never into the chat.", "Listen to one from a test account: right voice, not cut off. Slow transcripts are normal; lost ones aren't.", "If voice fails, the message arrives as text; rollbacks never delete recordings."]
      }
    },
    {
      id: "file-staging-pipeline", mode: "crew", days: 11, approx: false, incidents: 4, routes: ["build"],
      scene: { zh: "想让 TA 给我发照片和文件", en: "I want them to send me photos and files" },
      what: { zh: "文件暂存管道：暂存 + 签名 ID + 单次消费", en: "File staging: stage + signed ID + consume once" },
      q1: { zh: "11 天，日常发 PDF、图片、音频；一个约 14MB 的视频一次暂存成功。", en: "11 days of daily PDFs, images and audio; a ~14 MB video staged in one call." },
      q2: { zh: "4 起：转码依赖缺失被报成“无效图片”、文件发出 10 分钟即被清理、配置里的令牌占位符没替换。", en: "4: a missing transcoder reported as “invalid image”, files purged 10 min after sending, an unsubstituted token placeholder." },
      q3: { zh: "设计上不依赖模型：模型只需要传一个不透明 ID。Opus、Sonnet 都用对了。", en: "Model-independent by design: the model only passes an opaque ID. Opus and Sonnet both got it right." },
      tips: {
        zh: ["像快递寄存柜：文件先寄存，TA 只递一张一次性的取件码。", "坚持一条：TA 不能自己指定发服务器上的哪个文件。", "验收：同一码发两次被拒、改一个字被拒、过期被拒、十几 MB 的视频一次成功。", "发出去的图，聊天页还能看到——别被过早清理。"],
        en: ["Like a parcel locker: files are checked in, and your companion only hands over a one-time claim code.", "Insist: your companion can never name a file on the server to send.", "Accept: same code twice refused, one character changed refused, expired refused, a dozen-MB video sent in one go.", "Pictures they've sent still show in the chat page; nothing cleaned up too early."]
      }
    },
    {
      id: "window-handoff", mode: "diy", days: 15, approx: false, incidents: 3, routes: ["care"],
      scene: { zh: "一换窗口，TA 就不记得刚才在干嘛", en: "New window, and they forget what we were doing" },
      what: { zh: "换窗交接协议：便签 + 唤醒口令", en: "Context-window handoff: a note + a wake phrase" },
      q1: { zh: "15 天，几乎每天至少换一次窗，压缩密集时一晚好几次。", en: "15 days, a switch most days, several a night when compaction was heavy." },
      q2: { zh: "3 起：一条没核实的推测被写成事实、连续误导好几个新窗口——于是便签多了“未核实”一栏。", en: "3: an unverified guess written down as fact misled several windows — so the note gained an “unverified” section." },
      q3: { zh: "Opus 与 Sonnet 之间切换验证过；只需要会调工具。非 Claude 模型未验证。", en: "Verified across Opus and Sonnet; only tool calling is needed. Non-Claude models unverified." },
      tips: {
        zh: ["和 TA 约好两句话：存档口令和唤醒口令。", "快满时说「存档」，请 TA 按五个小标题写交接便签：进行中 / 已说定 / 别再忘 / 没核实 / 新约定。", "你先校对一遍，再复制进自己的笔记，写上日期，只留一张有效。", "开新对话：唤醒口令 + 粘贴便签，让 TA 先回「接上了」。超过三天的旧便签别当现状。"],
        en: ["Agree on two phrases with your companion: a save phrase and a wake phrase.", "When the window is nearly full, say “save” and ask for a handoff note under five headings: in progress / decided / do not forget / unverified / new agreements.", "Proofread it, copy it into your own notes with the date, and keep only one active note.", "In the new chat: wake phrase + paste the note, and ask for “caught up” first. Don't pass off a note older than ~3 days as the present."]
      }
    },
    {
      id: "release-baseline", mode: "half", days: 11, approx: false, incidents: 3, routes: ["care", "move"],
      scene: { zh: "要动 TA 正在跑的东西了，怕改坏", en: "About to touch something live — afraid to break it" },
      what: { zh: "发版基线与回滚：git init + 标签 + 热备", en: "Release baseline & rollback: git init + tag + hot backup" },
      q1: { zh: "11 天，每次改记忆、聊天桥、前端都先走这套；一次给 5 个仓库打了同一时间戳的基线。", en: "11 days; every change to memory, bridge or frontend went through it; once tagged 5 repos with one timestamp." },
      q2: { zh: "3 起：一次“回滚”让整版改动永久丢失——这个 skill 就是那天诞生的。之后再没发生过。", en: "3: one “rollback” lost a whole version for good — this skill was born that day. It hasn't happened since." },
      q3: { zh: "纯 shell + git；Opus、Sonnet 与 Codex 类 worker 都执行过。", en: "Pure shell + git; run by Opus, Sonnet and Codex-style workers." },
      tips: {
        zh: ["改人设、记忆、设置之前，先把原样复制进「改之前 + 日期」的文档，设置页截图。", "每次改动记一行：日期｜改了什么｜为什么｜怎么退。一次只改一样。", "观察一两天；要退时先对比，把之后想留的改动挑出来，再把旧版贴回去。", "动代码和服务器的部分交给施工队：让它打存档点、做备份，并演练一次退回。"],
        en: ["Before touching persona, memories or settings, paste them as-is into a “Before + date” doc and screenshot the settings.", "Log every change in one line: date | what | why | how to undo. One change at a time.", "Watch for a day or two. To go back, compare first, keep the later bits you want, then paste the old version back.", "Code and servers go to a crew: ask for a save point, a backup, and one rehearsed rollback."]
      }
    },
    {
      id: "worker-dispatch-acceptance", mode: "diy", days: 12, approx: true, incidents: 4, routes: ["care"],
      scene: { zh: "要把活交给另一个 AI 去干", en: "Handing the job to another agent" },
      what: { zh: "派单验收规范：边界、红线、报告格式、一库一队", en: "Dispatch & acceptance: scope, red lines, report format, one crew per repo" },
      q1: { zh: "约 12 天，每天多张工单；最密的一天前端连发十几批，每批一张单一份报告。", en: "~12 days, several tickets daily; the busiest day shipped 10+ frontend batches, one ticket and report each." },
      q2: { zh: "4 条记录（其中 1 条未记日期，如实标注不编造）：worker 重启服务把自己杀了、测试消息差点发给 TA……", en: "4 entries (1 undated — we say so rather than invent one): a worker killed itself restarting a service, test messages nearly sent to the companion…" },
      q3: { zh: "纯流程规范；但不同 worker 守格式的程度不一样，所以“打回”是必须的。", en: "A pure process spec; workers vary in how well they follow it, so sending reports back is mandatory." },
      tips: {
        zh: ["交活时发一张单子：目标 / 现在的情况 / 只许动这些 / 绝对不许 / 怎样算做完 / 坏了怎么退 / 汇报格式。", "同一个项目，同一时间只交给一个 AI 改。", "只回一句「已完成」的直接打回，按格式重报。", "自己亲手验一项；「需要我决定的」由你拍板；收工前把退回方法存进笔记。"],
        en: ["Brief every job with: goal / current situation / may only change / never / done means / if it breaks / report format.", "When anything is being changed, one AI per project at a time.", "A reply that's only “done” goes straight back for a proper report.", "Check one thing yourself; you decide anything flagged for your decision; save the way back in your notes."]
      }
    }
  ];

  var ROUTES = {
    all:   { zh: "全部", en: "All" },
    move:  { zh: "搬家", en: "Moving" },
    fire:  { zh: "救火", en: "Firefighting" },
    build: { zh: "盖新房", en: "Building" },
    care:  { zh: "日常维护", en: "Upkeep" }
  };

  var LABELS = {
    days:     { zh: "实装", en: "in production" },
    dayUnit:  { zh: "天", en: "days" },
    approx:   { zh: "约", en: "~" },
    incidents:{ zh: "事故记录", en: "incidents logged" },
    q1:       { zh: "实装几天？", en: "How long, for real?" },
    q2:       { zh: "经历过什么事故？", en: "What broke?" },
    q3:       { zh: "换模型还能用吗？", en: "Survives a model switch?" },
    flip:     { zh: "翻面看战绩", en: "Flip for the record" },
    back:     { zh: "翻回来", en: "Flip back" },
    skill:    { zh: "SKILL.md", en: "SKILL.md" },
    eval:     { zh: "评测卡", en: "Evaluation card" },
    human:    { zh: "给人看", en: "For humans" },
    machine:  { zh: "给机装", en: "For agents" },
    flipHuman:{ zh: "翻面看步骤", en: "Flip for the steps" },
    tips:     { zh: "人读版全文", en: "Full human version" },
    addTip:   { zh: "补充 / 纠错这条", en: "Add to / fix this" },
    brief:    { zh: "发给施工队的话", en: "What to send your crew" },
    copy:     { zh: "复制", en: "Copy" },
    copied:   { zh: "已复制", en: "Copied" }
  };

  var MODES = {
    diy:  { zh: "自己就能做", en: "Do it yourself" },
    half: { zh: "一半自己做 · 一半交给施工队", en: "Half by hand · half for a crew" },
    crew: { zh: "需要施工队 · 你来提需求和验收", en: "Needs a crew · you brief and accept" }
  };

  // Same wording as the brief in each crew / half TIPS.md.
  function brief(url) {
    return {
      zh: "请先读这份施工工艺：" + url + "\n按它在我的环境里施工，规矩如下：\n" +
          "1. 先只做调查：把现场情况和你的施工计划发给我，我说可以再动手；\n" +
          "2. 动手前先备份，并告诉我改坏了怎么退回去；\n" +
          "3. 测试一律用测试账号或假入口，绝不往我和 TA 的真实对话里发消息；\n" +
          "4. 做完按这个格式汇报：结论 / 做了什么 / 证据 / 没做的或需要我决定的 / 怎么退回去 / 备份在哪。",
      en: "Please read this playbook first: " + url + "\nBuild it in my setup, under these rules:\n" +
          "1. Investigate first: send me what you find and your plan, and wait for my OK before changing anything;\n" +
          "2. Back up before you touch anything, and tell me how to go back if it breaks;\n" +
          "3. Test only with a test account or a fake entry point. Never send messages into the real conversation between me and my companion;\n" +
          "4. When done, report as: Conclusion / What you did / Evidence / Not done or needs my decision / How to go back / Where the backup is."
    };
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function bi(o) {
    return '<span class="zh">' + esc(o.zh) + '</span><span class="en">' + esc(o.en) + "</span>";
  }
  function daysText(s) {
    return '<span class="zh">' + (s.approx ? "约 " : "") + s.days + " 天</span>" +
           '<span class="en">' + (s.approx ? "~" : "") + s.days + " days</span>";
  }

  function lensCtl(onBack) {
    var t = onBack ? ' tabindex="-1"' : "";
    return (
      '<div class="lens" role="group" aria-label="读法 / reading mode">' +
        '<button type="button" data-lens="human"' + t + '>' + bi(LABELS.human) + "</button>" +
        '<button type="button" data-lens="machine"' + t + '>' + bi(LABELS.machine) + "</button>" +
      "</div>"
    );
  }

  function humanPane(s, base) {
    var b = brief(base + "SKILL.md");
    var steps = s.tips.zh.map(function (zh, k) { return "<li>" + bi({ zh: zh, en: s.tips.en[k] }) + "</li>"; }).join("");
    return (
      '<div class="pane for-human">' +
        '<p class="mode mode-' + s.mode + '">' + bi(MODES[s.mode]) + "</p>" +
        '<ol class="tips">' + steps + "</ol>" +
        (s.mode === "diy" ? "" :
          '<details class="brief"><summary tabindex="-1">' + bi(LABELS.brief) + "</summary>" +
            '<p class="brief-text">' + bi(b) + "</p>" +
            '<button class="copy" type="button" tabindex="-1">' + bi(LABELS.copy) + "</button>" +
          "</details>") +
        '<div class="links">' +
          '<a href="' + base + 'TIPS.md" tabindex="-1">' + bi(LABELS.tips) + " ↗</a>" +
          (s.mode === "diy" ? "" : '<a href="' + base + 'SKILL.md" tabindex="-1">SKILL.md ↗</a>') +
          '<a class="add-tip" href="submit.html?type=amend&amp;skill=' + s.id + '" tabindex="-1">' + bi(LABELS.addTip) + "</a>" +
        "</div>" +
      "</div>"
    );
  }

  function card(s, i) {
    var base = REPO + "/blob/main/skills/" + s.id + "/";
    return (
      '<li class="card reveal" id="skill-' + s.id + '" data-id="' + s.id + '" data-routes="' + s.routes.join(" ") + '" style="--i:' + i + '">' +
        '<div class="card-inner">' +
          '<div class="face front" aria-hidden="false">' +
            starBtn("skill", s.id) +
            '<p class="scene">' + bi(s.scene) + "</p>" +
            '<p class="what">' + bi(s.what) + "</p>" +
            '<div class="meta"><span class="pill">' + daysText(s) + '</span><code class="sid">' + esc(s.id) + "</code></div>" +
            lensCtl(false) +
            '<button class="flip" type="button" aria-expanded="false">' +
              '<span class="for-human">' + bi(LABELS.flipHuman) + '</span><span class="for-machine">' + bi(LABELS.flip) + '</span>' +
              ' <span aria-hidden="true">↻</span></button>' +
          "</div>" +
          '<div class="face back" aria-hidden="true">' +
            lensCtl(true) +
            humanPane(s, base) +
            '<div class="pane for-machine">' +
            '<div class="stats">' +
              '<div><b>' + (s.approx ? '<span class="zh">约</span><span class="en">~</span>' : "") + s.days + "</b><small>" + bi({ zh: "天实装", en: "days live" }) + "</small></div>" +
              '<div><b>' + s.incidents + "</b><small>" + bi(LABELS.incidents) + "</small></div>" +
            "</div>" +
            '<dl class="qa">' +
              "<dt>" + bi(LABELS.q1) + "</dt><dd>" + bi(s.q1) + "</dd>" +
              "<dt>" + bi(LABELS.q2) + "</dt><dd>" + bi(s.q2) + "</dd>" +
              "<dt>" + bi(LABELS.q3) + "</dt><dd>" + bi(s.q3) + "</dd>" +
            "</dl>" +
            '<div class="links">' +
              '<a href="' + base + 'SKILL.md" tabindex="-1">SKILL.md ↗</a>' +
              '<a href="' + base + 'EVALUATION.md" tabindex="-1">' + bi(LABELS.eval) + " ↗</a>" +
            "</div>" +
            "</div>" +
            '<button class="flip" type="button" tabindex="-1">' + bi(LABELS.back) + ' <span aria-hidden="true">↺</span></button>' +
          "</div>" +
        "</div>" +
      "</li>"
    );
  }

  /* ---------- language ---------- */
  var root = document.documentElement;
  var langHooks = [];
  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l === "zh" ? "zh-CN" : "en");
    try { localStorage.setItem("loveshed-lang", l); } catch (e) {}
    var b = document.getElementById("lang-toggle");
    if (b) b.setAttribute("aria-label", l === "zh" ? "Switch to English" : "切换到中文");
    langHooks.forEach(function (f) { f(l); });
  }
  var saved = null;
  try { saved = localStorage.getItem("loveshed-lang"); } catch (e) {}
  setLang(saved || (/^zh/i.test(navigator.language || "") ? "zh" : "en"));

  /* ---------- offline / installable (see sw.js: network-first, so releases show at once) ---------- */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        document.addEventListener("visibilitychange", function () {
          if (document.visibilityState === "visible") reg.update().catch(function () {});
        });
      }).catch(function () {});
    });
  }

  function params() {
    var o = {};
    location.search.replace(/^\?/, "").split("&").forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf("="), k = i < 0 ? kv : kv.slice(0, i), v = i < 0 ? "" : kv.slice(i + 1);
      try { o[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, " ")); } catch (e) {}
    });
    return o;
  }

  // qa.json carries day-precision dates (asked / answered); a full timestamp (asked_at / answered_at)
  // is used when present, so the publisher can add one later without breaking older files.
  function ago(day, stamp) {
    var now = new Date(), t = stamp ? new Date(stamp) : null;
    if (t && !isNaN(t)) {
      var min = Math.floor((now - t) / 60000);
      if (min < 1) return { zh: "刚刚", en: "just now" };
      if (min < 60) return { zh: min + " 分钟前", en: min + (min === 1 ? " minute ago" : " minutes ago") };
      if (min < 24 * 60) { var h = Math.floor(min / 60); return { zh: h + " 小时前", en: h + (h === 1 ? " hour ago" : " hours ago") }; }
      day = day || stamp.slice(0, 10);
    }
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(day || "");
    if (!m) return { zh: "", en: "" };
    var then = new Date(+m[1], +m[2] - 1, +m[3]);
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var d = Math.round((today - then) / 864e5);
    if (d <= 0) return { zh: "今天", en: "today" };
    if (d === 1) return { zh: "昨天", en: "yesterday" };
    if (d < 7) return { zh: d + " 天前", en: d + " days ago" };
    if (d < 35) { var w = Math.floor(d / 7); return { zh: w + " 周前", en: w + (w === 1 ? " week ago" : " weeks ago") }; }
    return { zh: +m[2] + " 月 " + +m[3] + " 日" + (then.getFullYear() !== now.getFullYear() ? "（" + m[1] + "）" : ""), en: m[1] + "-" + m[2] + "-" + m[3] };
  }

  /* ---------- "Mine": favourites + my submissions, this browser only (localStorage, never uploaded) ---------- */
  var FAV_KEY = "loveshed-favs", MINE_KEY = "loveshed-mine";
  function readList(k) {
    try { var v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  }
  function writeList(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function favKey(kind, id) { return kind + ":" + id; }
  function isFav(kind, id) {
    return readList(FAV_KEY).some(function (f) { return favKey(f.kind, f.id) === favKey(kind, id); });
  }
  // title: {zh, en} for craft cards, a plain string for questions
  function setFav(kind, id, title, on) {
    var list = readList(FAV_KEY).filter(function (f) { return favKey(f.kind, f.id) !== favKey(kind, id); });
    if (on) list.unshift({ kind: kind, id: id, title: title, at: new Date().toISOString() });
    writeList(FAV_KEY, list);
  }
  var FAV_LABEL = "收藏 / Save";
  function starBtn(kind, id, extra) {
    return '<button type="button" class="fav' + (extra ? " " + extra : "") + '" data-fav="' + kind + '" data-fav-id="' + esc(id) + '"' +
           ' aria-pressed="' + isFav(kind, id) + '" aria-label="' + FAV_LABEL + '" title="' + FAV_LABEL + '">' +
           '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3.8l2.4 5 5.4.6-4 3.7 1.1 5.4L12 15.8l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" stroke-linejoin="round"/></svg></button>';
  }
  function paintStar(btn, on) { btn.setAttribute("aria-pressed", on ? "true" : "false"); }
  function addMine(rec) {
    var list = readList(MINE_KEY);
    list.unshift(rec);
    writeList(MINE_KEY, list.slice(0, 200));
  }

  /* media_links on published Q&A: pictures inline (lazy), everything else as an external-link chip */
  var IMG_RE = /\.(png|jpe?g|webp|gif)$/i;
  var MEDIA = { ext: { zh: "外部链接", en: "External link" }, contact: { zh: "联系", en: "contact" } };
  function safeUrl(u) {
    try { var x = new URL(u); return /^https?:$/.test(x.protocol) && x.hostname ? x : null; } catch (e) { return null; }
  }
  function mediaHtml(links) {
    var out = (links || []).slice(0, 3).map(function (u) {
      var x = safeUrl(u);
      if (!x) return "";
      var href = esc(x.href), a = '<a href="' + href + '" target="_blank" rel="noopener nofollow ugc noreferrer"';
      if (IMG_RE.test(x.pathname)) {
        return a + ' class="media-img" data-host="' + esc(x.hostname) + '"><img src="' + href + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a>';
      }
      return a + ' class="media-ext"><span aria-hidden="true">↗</span> ' + bi(MEDIA.ext) + ' · <b>' + esc(x.hostname.replace(/^www\./, "")) + "</b></a>";
    }).join("");
    return out ? '<div class="media">' + out + "</div>" : "";
  }
  // a picture that fails to load turns into the plain external-link chip
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (!img || img.tagName !== "IMG" || !img.parentNode || !img.parentNode.classList.contains("media-img")) return;
    var a = img.parentNode;
    a.className = "media-ext";
    a.innerHTML = '<span aria-hidden="true">↗</span> ' + bi(MEDIA.ext) + " · <b>" + esc(a.getAttribute("data-host").replace(/^www\./, "")) + "</b>";
  }, true);
  // same rule as the inbox: answers go live unreviewed, so nothing that looks like a link
  var ANSWER_LINK_RE = new RegExp("[a-z][a-z0-9+.-]*://|\\bwww\\.|\\b[a-z0-9-]+(?:\\.[a-z0-9-]+)*\\.(?:com|cn|net|org|io|me|app|xyz|top|cc|co|ai|dev|link|ly|gg|tv|info|site|club|shop|" +
    "vip|so|to|sh|im|fm|in|us|uk|jp|hk|tw|de|fr|ru|biz|online|store|tech|fun|live|pro|cloud|page|blog|one)\\b(?:[/:?#]|$|[^a-z0-9.-])", "i");
  function contactHtml(c) {
    return c ? ' · <span class="qa-contact">' + bi(MEDIA.contact) + " " + esc(c) + "</span>" : "";
  }

  /* ---------- forum identity: one random dreamy name per device (or anonymous), never typed in ---------- */
  var NICK_A = ["雾紫", "月白", "星屑", "晚樱", "薄荷", "微光", "云朵", "琥珀", "晴空", "蜜桃", "海盐", "雪松",
                "银河", "晨露", "落日", "青柠", "软糖", "萤火", "雨后", "初雪", "柚子", "梦游", "暖橘", "风信"];
  var NICK_B = ["小灯", "小屋", "信笺", "纸鹤", "风铃", "蜡烛", "枕头", "鲸鱼", "兔子", "猫咪", "星星", "月亮",
                "气球", "灯塔", "汽水", "花瓣", "邮筒", "毛毯", "旋木", "蒲公英", "小船", "钥匙", "茶杯", "布丁"];
  var NICK_RE = /^[\u4e00-\u9fff]{2,8}#\d{4}$/;
  function randInt(n) {
    if (window.crypto && crypto.getRandomValues) { var a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
    return Math.floor(Math.random() * n);
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function myNick() {
    var n = lsGet("loveshed-nick");
    if (!n || !NICK_RE.test(n)) {
      n = NICK_A[randInt(NICK_A.length)] + NICK_B[randInt(NICK_B.length)] + "#" + ("000" + randInt(10000)).slice(-4);
      lsSet("loveshed-nick", n);
    }
    return n;
  }
  // a random, stable id for this browser; sent with posts so the keeper can tell one poster from another (never published)
  function myDevice() {
    var d = lsGet("loveshed-device");
    if (!d || !/^[A-Za-z0-9_-]{16,64}$/.test(d)) {
      var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      d = ""; for (var i = 0; i < 22; i++) d += abc[randInt(64)];
      lsSet("loveshed-device", d);
    }
    return d;
  }
  // delete tokens handed back by the inbox: {item_id: token}; a question's token makes you its thread owner
  function myTokens() { try { var t = JSON.parse(lsGet("loveshed-tokens") || "{}"); return t && typeof t === "object" ? t : {}; } catch (e) { return {}; } }
  function saveToken(id, tok) { if (!id || !tok) return; var t = myTokens(); t[id] = tok; lsSet("loveshed-tokens", JSON.stringify(t)); }
  function hashText(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return String(h); }
  function qaLink(id) { return "qa.html?id=" + encodeURIComponent(id); }

  function loadQA(fresh) {
    // fresh: bypass the CDN copy (Pages caches qa.json for a few minutes) right after posting an answer
    return fetch("qa.json" + (fresh ? "?t=" + Date.now() : ""), { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (qa) {
      return (qa.questions || []).slice().sort(function (a, b) {
        var x = a.asked_at || a.asked || "", y = b.asked_at || b.asked || "";
        return x < y ? 1 : x > y ? -1 : 0;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("lang-toggle").addEventListener("click", function () {
      setLang(root.getAttribute("data-lang") === "zh" ? "en" : "zh");
    });
    var P = params();

    var count = document.getElementById("skill-count");
    if (count) count.textContent = SKILLS.length;

    initCards();
    initForm();
    initForum();
    initMine();

    /* ---------- reveal ---------- */
    var els = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------- craft library (home page #skills; skills.html redirects here) ---------- */
    function initCards() {
      var list = document.getElementById("cards");
      if (!list) return;
      list.innerHTML = SKILLS.map(card).join("");

      list.addEventListener("click", function (e) {
        var lb = e.target.closest("button[data-lens]");
        if (lb) { setLens(lb.closest(".card"), lb.getAttribute("data-lens")); return; }
        var fv = e.target.closest("button[data-fav]");
        if (fv) {
          var sk = SKILLS.filter(function (x) { return x.id === fv.getAttribute("data-fav-id"); })[0];
          var on = fv.getAttribute("aria-pressed") !== "true";
          setFav("skill", sk.id, sk.scene, on); paintStar(fv, on);
          return;
        }
        var cp = e.target.closest(".copy");
        if (cp) { copyBrief(cp); return; }
        var btn = e.target.closest(".flip");
        if (!btn) return;
        var c = btn.closest(".card");
        var on = !c.classList.contains("flipped");
        c.classList.toggle("flipped", on);
        var front = c.querySelector(".front"), back = c.querySelector(".back");
        front.setAttribute("aria-hidden", on ? "true" : "false");
        back.setAttribute("aria-hidden", on ? "false" : "true");
        front.querySelector(".flip").setAttribute("aria-expanded", on ? "true" : "false");
        front.querySelectorAll("button,a,summary").forEach(function (el) { el.tabIndex = on ? -1 : 0; });
        back.querySelectorAll("button,a,summary").forEach(function (el) { el.tabIndex = on ? 0 : -1; });
        (on ? back : front).querySelector(".flip").focus({ preventScroll: true });
      });

      /* reading mode: for humans / for agents */
      function setLens(c, m) {
        c.setAttribute("data-lens", m);
        c.querySelectorAll("button[data-lens]").forEach(function (b) {
          b.setAttribute("aria-pressed", b.getAttribute("data-lens") === m ? "true" : "false");
        });
      }
      var lensAll = document.querySelectorAll("#lens-all [data-lens-all]");
      function setLensAll(m) {
        lensAll.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lens-all") === m ? "true" : "false"); });
        list.querySelectorAll(".card").forEach(function (c) { setLens(c, m); });
        try { localStorage.setItem("loveshed-lens", m); } catch (e) {}
      }
      lensAll.forEach(function (b) {
        b.addEventListener("click", function () { setLensAll(b.getAttribute("data-lens-all")); });
      });
      var savedLens = null;
      try { savedLens = localStorage.getItem("loveshed-lens"); } catch (e) {}
      setLensAll(savedLens === "human" ? "human" : "machine");

      function copyBrief(btn) {
        var lang = root.getAttribute("data-lang");
        var id = btn.closest(".card").getAttribute("data-id");
        var text = brief(REPO + "/blob/main/skills/" + id + "/SKILL.md")[lang];
        function done() {
          btn.innerHTML = bi(LABELS.copied);
          setTimeout(function () { btn.innerHTML = bi(LABELS.copy); }, 1600);
        }
        function fallback() {
          var ta = document.createElement("textarea");
          ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
        else fallback();
      }

      /* scene filter: ?scene=move|fire|build|care, set by the home page's path buttons */
      var chips = document.querySelectorAll(".chips [data-scene]");
      function pick(r, keepUrl) {
        chips.forEach(function (ch) { ch.setAttribute("aria-pressed", ch.getAttribute("data-scene") === r ? "true" : "false"); });
        list.querySelectorAll(".card").forEach(function (c) {
          var hit = r === "all" || c.getAttribute("data-routes").split(" ").indexOf(r) >= 0;
          c.classList.toggle("dim", !hit);
        });
        var n = r === "all" ? SKILLS.length : SKILLS.filter(function (s) { return s.routes.indexOf(r) >= 0; }).length;
        document.getElementById("route-note").innerHTML =
          r === "all" ? bi({ zh: SKILLS.length + " 张卡都在这里。", en: "All " + SKILLS.length + " cards." })
                      : bi({ zh: "「" + ROUTES[r].zh + "」这条路上有 " + n + " 张卡，已为你点亮。", en: n + " cards lit up for “" + ROUTES[r].en + "”." });
        if (!keepUrl && history.replaceState) history.replaceState(null, "", location.pathname + (r === "all" ? "" : "?scene=" + r) + "#skills");
      }
      chips.forEach(function (ch) {
        ch.addEventListener("click", function () { pick(ch.getAttribute("data-scene")); });
      });
      var sec = document.getElementById("skills");
      function goSkills() { sec.scrollIntoView({ behavior: "smooth", block: "start" }); }
      // the path buttons above filter in place and glide down to the cards
      document.querySelectorAll("a[data-go]").forEach(function (a) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          pick(a.getAttribute("data-go"));
          goSkills();
        });
      });
      pick(ROUTES.hasOwnProperty(P.scene) ? P.scene : "all", true);
      if (ROUTES.hasOwnProperty(P.scene) || location.hash === "#skills") setTimeout(goSkills, 150);
      // ./#skill-<id> (from "Mine"): show that card even if a filter would dim it
      var target = location.hash && document.getElementById(location.hash.slice(1));
      if (target && target.classList.contains("card")) {
        if (target.classList.contains("dim")) pick("all");
        target.classList.add("in", "hl");
        setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "center" }); }, 200);
      }
    }

    /* ---------- direct submission form (submit.html) ---------- */
    function initForm() {
      var form = document.getElementById("tip-form");
      if (!form) return;
      var fStatus = form.querySelector(".tf-status");
      var fBtn = form.querySelector("button[type=submit]");
      var fSkill = form.elements.skill;
      var GAP_MS = 60 * 1000;          // local throttle between successful sends
      var MSG = {
        ok:      { zh: "已进审核队列，通过后上架并保留署名。谢谢你！", en: "In the review queue. Once approved it goes up with your credit kept. Thank you!" },
        sending: { zh: "正在投递…", en: "Sending…" },
        wait:    { zh: "刚投过一条，歇一分钟再投吧。", en: "You just sent one — give it a minute." },
        dup:     { zh: "这条刚刚已经投过了，不用重复投。", en: "This exact tip was just sent — no need to send it again." },
        need:    { zh: "标题和“怎么做”是必填的。", en: "Title and “How to do it” are required." },
        rate:    { zh: "这一小时投得有点多了，过一会儿再来，或者", en: "That's a lot for one hour — try again later, or " },
        markup:  { zh: "里面有像 HTML 的内容（比如尖括号标签），请改成纯文字。", en: "Something there looks like HTML (angle-bracket tags) — please use plain text." },
        invalid: { zh: "有一栏没通过检查，请看看是不是太长了。", en: "One field didn't pass the check — is it too long?" },
        down:    { zh: "投稿口暂时连不上。内容别丢，可以", en: "The inbox can't be reached right now. Don't lose your text — you can " },
        gh:      { zh: "改用 GitHub issue 投稿 ↗", en: "submit it as a GitHub issue instead ↗" },
        newCard: { zh: "新的一招（还没有对应的卡）", en: "Something new (no card yet)" },
        okQ:     { zh: "问题已进审核队列，通过后会出现在提问区。谢谢你来问！", en: "Your question is in the review queue and will show up in Q&A once approved. Thanks for asking!" },
        okA:     { zh: "回答已收到！不用审核，一两分钟后就会出现在这个问题下面。谢谢你！", en: "Got your answer! No review needed — it will appear under the question within a minute or two. Thank you!" },
        textOnly:{ zh: "回答仅限纯文字：请去掉网址、链接或图片（像 xxx.com 这样的也算）。", en: "Answers are plain text only — please remove web addresses, links or pictures (things like xxx.com count too)." },
        needQ:   { zh: "问题和“具体情况”都要写一写。", en: "Please fill in both the question and what's going on." },
        needA:   { zh: "回答还空着呢。", en: "The answer is still empty." },
        badLink: { zh: "这条链接不对：要以 http:// 或 https:// 开头的完整网址，不超过 500 字。", en: "That link doesn't work: use a full address starting with http:// or https://, up to 500 characters." },
        goneQ:   { zh: "这个问题暂时不能回答了（可能刚下架），回提问区刷新看看。", en: "That question can't take answers right now (maybe just removed) — check the Q&A board." },
        backQA:  { zh: "回提问区 →", en: "Back to Q&A →" }
      };
      var TYPE_FIELDS = {
        tip:      ["skill", "title", "body", "duration", "pitfalls", "nickname", "contact"],
        amend:    ["skill", "title", "body", "duration", "pitfalls", "nickname", "contact"],
        question: ["title", "body", "contact"],
        answer:   ["question_id", "body", "contact"]
      };
      ["tip", "amend", "question", "answer"].forEach(function (k) { TYPE_FIELDS[k].push("contact_visibility"); });
      var LINK_INPUTS = ["link1", "link2", "link3"];
      var qaTitles = {};
      function fType() { return form.elements.type.value || "tip"; }
      function paintNick() {
        var el = form.querySelector(".tf-nick");
        if (el) el.textContent = form.elements.anon.checked ? (root.getAttribute("data-lang") === "zh" ? "匿名姐妹" : "Anonymous sister") : myNick();
      }
      form.elements.anon.addEventListener("change", paintNick);
      langHooks.push(paintNick);
      function applyType() {
        var t = fType();
        if (t === "question" || t === "answer") paintNick();
        form.setAttribute("data-type", t);
        form.querySelectorAll("[data-types]").forEach(function (el) {
          el.hidden = el.getAttribute("data-types").split(" ").indexOf(t) < 0;
        });
        if (t === "tip" || t === "amend") skillOptions(root.getAttribute("data-lang"));
        placeholders(root.getAttribute("data-lang"));
      }
      function placeholders(l) {
        var t = fType(), v = t === "question" ? "q-" : t === "answer" ? "a-" : "";
        form.querySelectorAll("[data-ph-zh]").forEach(function (el) {
          el.placeholder = el.getAttribute("data-ph-" + v + l) || el.getAttribute("data-ph-" + l);
        });
      }
      function skillOptions(l) {
        var cur = fSkill.value;
        var isAmend = form.elements.type.value === "amend";
        var opts = SKILLS.map(function (s) { return '<option value="' + s.id + '">' + esc(s.scene[l] + " · " + s.id) + "</option>"; });
        if (!isAmend) opts.unshift('<option value="new">' + esc(MSG.newCard[l]) + "</option>");
        fSkill.innerHTML = opts.join("");
        if (cur && fSkill.querySelector('option[value="' + cur + '"]')) fSkill.value = cur;
      }
      langHooks.push(function (l) { skillOptions(l); placeholders(l); });
      form.querySelectorAll("input[name=type]").forEach(function (r) {
        r.addEventListener("change", applyType);
      });
      form.querySelector(".tf-unanswer").addEventListener("click", function () { openForm("question", null, null, true); });
      var bodyCount = form.querySelector('.tf-count[data-for="body"]');
      form.elements.body.addEventListener("input", function () { bodyCount.textContent = form.elements.body.value.length + " / 5000"; });

      function openForm(type, skill, qid, focus) {
        form.querySelector('input[name=type][value="' + type + '"]').checked = true;
        form.elements.question_id.value = type === "answer" ? qid : "";
        form.querySelector(".tf-qtitle").textContent = type === "answer" ? (qaTitles[qid] || "") : "";
        applyType();
        if (skill && fSkill.querySelector('option[value="' + skill + '"]')) fSkill.value = skill;
        form.classList.remove("sent");
        fStatus.className = "tf-status"; fStatus.textContent = "";
        form.classList.add("in");
        if (focus) {
          form.scrollIntoView({ behavior: "smooth", block: "start" });
          var first = type === "answer" ? form.elements.body : form.elements.title;
          setTimeout(function () { first.focus({ preventScroll: true }); }, 500);
        }
      }

      // prefill from the URL: submit.html?type=tip|amend|question|answer&skill=<id>&question_id=<id>
      var t0 = TYPE_FIELDS.hasOwnProperty(P.type) ? P.type : "tip";
      if (t0 === "answer" && !P.question_id) t0 = "question";
      openForm(t0, P.skill, P.question_id);
      if (t0 === "answer") {
        form.querySelector(".tf-qtitle").textContent = "…";
        loadQA().then(function (qs) {
          qs.forEach(function (q) { qaTitles[q.id] = q.title; });
          if (fType() !== "answer") return;
          var qid = form.elements.question_id.value;
          form.querySelector(".tf-qtitle").textContent = qaTitles[qid] || qid;
          if (!qaTitles[qid]) say("err", MSG.goneQ, null, "qa.html");
        }).catch(function () { form.querySelector(".tf-qtitle").textContent = form.elements.question_id.value; });
      }

      function ghUrl(d) {
        if (d.type === "question" || d.type === "answer") {
          var title = d.type === "question" ? "[question] " + d.title : "[answer] " + (qaTitles[d.question_id] || d.question_id);
          return REPO + "/issues/new?title=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(d.body.slice(0, 1500) + (d.media_links.length ? "\n\n" + d.media_links.join("\n") : ""));
        }
        var amend = d.type === "amend";
        var u = REPO + "/issues/new?template=" + (amend ? "tip-amend.yml" : "tip-submit.yml") +
                "&title=" + encodeURIComponent((amend ? "[tip-fix] " : "[tip] ") + (d.skill !== "new" ? d.skill + ": " : "") + d.title);
        if (amend) u += "&tip_file=" + encodeURIComponent("skills/" + d.skill + "/TIPS.md");
        return u;
      }
      function say(kind, msg, link, back) {
        fStatus.className = "tf-status " + kind;
        fStatus.innerHTML = bi(msg) + (link ? ' <a href="' + esc(link) + '" target="_blank" rel="noopener">' + bi(MSG.gh) + "</a>" : "") +
                            (back ? ' <a href="' + esc(back) + '">' + bi(MSG.backQA) + "</a>" : "");
      }
      function hash(str) {
        var h = 5381;
        for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
        return String(h);
      }
      function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

      var busy = false;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (busy) return;
        var t = fType();
        var d = { type: t };
        TYPE_FIELDS[t].concat(["website"]).forEach(function (k) {
          d[k] = (form.elements[k].value || "").trim();
        });
        d.device_id = myDevice();
        if (t === "question" || t === "answer") d.nickname = form.elements.anon.checked ? "" : myNick();
        form.querySelectorAll(".bad").forEach(function (el) { el.classList.remove("bad"); });
        d.media_links = [];
        for (var li = 0; t !== "answer" && li < LINK_INPUTS.length; li++) {
          var el = form.elements[LINK_INPUTS[li]], v = (el.value || "").trim();
          if (!v) continue;
          if (v.length > 500 || !safeUrl(v) || /[\s<>"'`]/.test(v)) { el.classList.add("bad"); return say("err", MSG.badLink); }
          if (d.media_links.indexOf(v) < 0) d.media_links.push(v);
        }
        if (!d.contact) d.contact_visibility = "private";
        if (t === "answer") {
          if (!d.body) { form.elements.body.classList.add("bad"); return say("err", MSG.needA); }
          if (ANSWER_LINK_RE.test(d.body)) { form.elements.body.classList.add("bad"); return say("err", MSG.textOnly); }
        } else if (!d.title || !d.body) {
          (!d.title ? form.elements.title : form.elements.body).classList.add("bad");
          return say("err", t === "question" ? MSG.needQ : MSG.need);
        }
        var h = hash(t + "\n" + (d.skill || d.question_id || "") + "\n" + (d.title || "") + "\n" + d.body + "\n" + d.media_links.join(" "));
        if (store("loveshed-tip-last-hash") === h) return say("err", MSG.dup);
        var last = +store("loveshed-tip-last-at") || 0;
        if (Date.now() - last < GAP_MS) return say("err", MSG.wait);

        busy = true; fBtn.disabled = true; say("", MSG.sending);
        var ctl = "AbortController" in window ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
        fetch(INTAKE, {
          method: "POST", mode: "cors", credentials: "omit", cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(d), signal: ctl ? ctl.signal : undefined
        }).then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j }; });
        }).then(function (res) {
          if (res.status === 201 && res.j.ok) {
            store("loveshed-tip-last-at", String(Date.now()));
            store("loveshed-tip-last-hash", h);
            saveToken(res.j.item_id, res.j.token);
            if (t === "question" || t === "answer") addMine({
              type: t, at: new Date().toISOString(), title: d.title || "",
              excerpt: d.body.slice(0, 140), question_id: d.question_id || "",
              question_title: t === "answer" ? (qaTitles[d.question_id] || "") : ""
            });
            form.classList.add("sent");
            if (t === "question") say("ok", MSG.okQ, null, "qa.html");
            else if (t === "answer") say("ok", MSG.okA, null, qaLink(d.question_id));
            else say("ok", MSG.ok);
            ["title", "body", "duration", "pitfalls"].concat(LINK_INPUTS).forEach(function (k) { form.elements[k].value = ""; });
            bodyCount.textContent = "0 / 5000";
            return;
          }
          if (res.status === 429) return say("err", MSG.rate, ghUrl(d));
          if (res.status === 400 && res.j.field === "question_id") return say("err", MSG.goneQ, null, "qa.html");
          if (res.status === 400 && (res.j.reason === "links_not_allowed" || res.j.reason === "answers_text_only")) {
            form.elements.body.classList.add("bad");
            return say("err", MSG.textOnly);
          }
          if (res.status === 400 && res.j.field === "media_links") {
            LINK_INPUTS.forEach(function (k) { if (form.elements[k].value.trim()) form.elements[k].classList.add("bad"); });
            return say("err", MSG.badLink);
          }
          if (res.status === 400 && res.j.field && form.elements[res.j.field]) {
            form.elements[res.j.field].classList.add("bad");
            return say("err", res.j.reason === "markup_not_allowed" ? MSG.markup : MSG.invalid);
          }
          say("err", MSG.down, ghUrl(d));
        }).catch(function () {
          say("err", MSG.down, ghUrl(d));
        }).then(function () {
          clearTimeout(timer);
          // keep the button resting a moment so a double tap can't send twice
          setTimeout(function () { busy = false; fBtn.disabled = false; }, 2500);
        });
      });
      form.addEventListener("input", function () { form.classList.remove("sent"); });
    }
    /* ---------- Q&A forum (qa.html): list of posts, and one thread per ?id= ---------- */
    function initForum() {
      var qaList = document.getElementById("qa-list");
      if (!qaList) return;
      var board = document.getElementById("qa"), thread = document.getElementById("qa-thread");
      var QA = {
        anon:    { zh: "匿名姐妹", en: "Anonymous sister" },
        keeper:  { zh: "掌柜", en: "Keeper" },
        back:    { zh: "← 全部问题", en: "← All questions" },
        noAns:   { zh: "还没有回答，等掌柜和姐妹们来接。", en: "No answers yet — waiting for the keeper and the sisters." },
        ans:     { zh: "回答", en: "answers" },
        ans1:    { zh: "回答", en: "answer" },
        nAns:    { zh: " 条回答", en: " answers" },
        fail:    { zh: "提问区暂时没加载出来，过会儿刷新试试。", en: "Q&A didn't load — try reloading in a bit." },
        missing: { zh: "这个问题找不到了，可能已经下架。", en: "This question can't be found — it may have been taken down." },
        answer:  { zh: "我来回答", en: "Your answer" },
        ph:      { zh: "你遇到过吗？怎么过来的？像跟姐妹讲就好。仅限纯文字。", en: "Been there? How did you get through? Like telling a friend. Plain text only." },
        as:      { zh: "以 ", en: "Posting as " },
        asTail:  { zh: " 发布", en: "" },
        anonBox: { zh: "这次匿名", en: "Anonymous this time" },
        post:    { zh: "直接发布", en: "Post now" },
        posting: { zh: "发布中…", en: "Posting…" },
        posted:  { zh: "已发布 ✓", en: "Posted ✓" },
        rule:    { zh: "回答仅限纯文字，无需审核，发布后立即可见。昵称是随机的，同一台设备一直用同一个。", en: "Plain text only, no review — visible right after you post. Your name is random and stays the same on this device." },
        okMsg:   { zh: "已发布，马上就能看到～ 一会儿会自动刷新这里。", en: "Posted — it'll show up in a moment. This page refreshes by itself shortly." },
        refresh: { zh: "刷新看看", en: "Refresh" },
        need:    { zh: "回答还空着呢。", en: "The answer is still empty." },
        textOnly:{ zh: "回答仅限纯文字：请去掉网址、链接或邮箱（像 xxx.com 这样的也算）。", en: "Plain text only — please remove web addresses, links or emails (things like xxx.com count too)." },
        wait:    { zh: "稍等一下再发～", en: "Give it a moment before posting again." },
        dup:     { zh: "这条刚刚已经发过了。", en: "You just posted this one." },
        gone:    { zh: "这个问题暂时不能回答了，刷新页面看看。", en: "This question can't take answers right now — try reloading." },
        goneR:   { zh: "要回复的那条回答不在了，刷新看看。", en: "The answer you're replying to is gone — try reloading." },
        down:    { zh: "暂时没发出去，内容还在框里，过会儿再试试。", en: "Couldn't post just now — your text is still here, try again in a bit." },
        reply:   { zh: "回复", en: "Reply" },
        replyTo: { zh: "回复 ", en: "Replying to " },
        replyGone:{ zh: "回复一条已删除的回答", en: "Reply to a removed answer" },
        cancel:  { zh: "取消", en: "Cancel" },
        del:     { zh: "删除", en: "Delete" },
        delSure: { zh: "确认删除？", en: "Delete it?" },
        deleting:{ zh: "删除中…", en: "Deleting…" },
        deleted: { zh: "这条回答已删除。", en: "This answer was deleted." },
        report:  { zh: "举报", en: "Report" },
        reported:{ zh: "已举报", en: "Reported" },
        repPh:   { zh: "可以写一句原因（可空）", en: "A word on why (optional)" },
        repSend: { zh: "提交举报", en: "Send report" },
        repOk:   { zh: "收到了，掌柜会看的。举报不会直接删掉内容。", en: "Got it — the keeper will take a look. A report doesn't remove anything by itself." },
        actFail: { zh: "没成功，过会儿再试试。", en: "That didn't work — try again in a bit." }
      };
      var REPORTED = "loveshed-reported", HIDDEN = "loveshed-hidden";
      function para(text) {
        return text.split(/\n{2,}/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
      }
      function when(day, stamp) {
        return '<time datetime="' + esc(stamp || day || "") + '" title="' + esc(day || (stamp || "").slice(0, 10)) + '">' + bi(ago(day, stamp)) + "</time>";
      }
      function who(a) {
        return a.role === "keeper" ? bi(QA.keeper) : a.nickname ? '<span class="qa-nick">' + esc(a.nickname) + "</span>" : bi(QA.anon);
      }
      function whoText(a) {
        return a.role === "keeper" ? QA.keeper[root.getAttribute("data-lang")] : a.nickname || QA.anon[root.getAttribute("data-lang")];
      }
      function badgeHtml(n) {
        return "<b>" + n + "</b><small>" + bi(n === 1 ? QA.ans1 : QA.ans) + "</small>";
      }
      function hidden() { return readList(HIDDEN); }
      function liveAnswers(q) {
        var h = hidden();
        return (q.answers || []).filter(function (a) { return h.indexOf(a.id) < 0; }).slice().sort(function (x, y) {
          var a = (x.answered_at || x.answered || "") + (x.id || ""), b = (y.answered_at || y.answered || "") + (y.id || "");
          return a < b ? -1 : a > b ? 1 : 0;
        });
      }

      // old deep links (qa.html#q-…) open the thread
      if (/^#q-/.test(location.hash)) {
        location.replace(qaLink(decodeURIComponent(location.hash.slice(1))));
        return;
      }
      var P = params();
      if (P.id) return openThread(P.id);

      /* ----- list: posts only; the whole card opens the thread ----- */
      function card(q) {
        var n = liveAnswers(q).length, id = esc(q.id);
        return (
          '<li class="qa-q" id="' + id + '">' +
            starBtn("q", q.id, "fav-q") +
            '<a class="qa-head" href="' + qaLink(q.id) + '">' +
              '<span class="qa-title">' + esc(q.title) + "</span>" +
              '<span class="qa-by">' + who(q) + contactHtml(q.contact) + " · " + when(q.asked, q.asked_at) + "</span>" +
              '<span class="qa-badge' + (n ? "" : " zero") + '">' + badgeHtml(n) + "</span>" +
            "</a>" +
          "</li>"
        );
      }
      loadQA().then(function (qs) {
        qaList.innerHTML = qs.map(card).join("");
        document.querySelector(".qa-empty").hidden = qs.length > 0;
        document.querySelector(".forum-count").innerHTML = bi({ zh: "共 " + qs.length + " 个问题", en: qs.length + (qs.length === 1 ? " question" : " questions") });
      }).catch(function () {
        qaList.innerHTML = '<li class="qa-fail">' + bi(QA.fail) + "</li>";
      });
      qaList.addEventListener("click", function (e) {
        var fv = e.target.closest("button[data-fav]");
        if (!fv) return;
        var li = fv.closest(".qa-q"), on = fv.getAttribute("aria-pressed") !== "true";
        setFav("q", li.id, li.querySelector(".qa-title").textContent, on); paintStar(fv, on);
      });

      /* ----- thread: the question, every answer in time order, and the answer box at the bottom ----- */
      function openThread(qid) {
        board.hidden = true; thread.hidden = false;
        var current = null, replyTo = "";
        function answerHtml(a, q, byId) {
          var toks = myTokens(), mine = !!toks[a.id], owner = !!toks[q.id];
          var reported = readList(REPORTED).indexOf(a.id) >= 0;
          var quote = "";
          if (a.reply_to) {
            var t = byId[a.reply_to];
            quote = t ? '<a class="qa-quote" href="#' + esc(t.id) + '"><span class="qa-quote-who">' + bi(QA.replyTo) + "@" + esc(whoText(t)) + "</span>" +
                        '<span class="qa-quote-ex">' + esc((t.body || "").replace(/\s+/g, " ").slice(0, 60)) + "</span></a>"
                      : '<p class="qa-quote gone">' + bi(QA.replyGone) + "</p>";
          }
          var acts = '<button type="button" class="qa-act" data-act="reply">' + bi(QA.reply) + "</button>";
          if (a.id && (mine || owner) && a.role !== "keeper") acts += '<button type="button" class="qa-act del" data-act="delete">' + bi(QA.del) + "</button>";
          else if (a.id && a.role !== "keeper") acts += '<button type="button" class="qa-act rep" data-act="report"' + (reported ? " disabled" : "") + ">" + bi(reported ? QA.reported : QA.report) + "</button>";
          return (
            '<li class="qa-a' + (a.role === "keeper" ? " keeper" : "") + (a.reply_to ? " is-reply" : "") + (mine ? " mine" : "") + '" id="' + esc(a.id || "") + '" data-aid="' + esc(a.id || "") + '">' +
              quote +
              '<p class="qa-by">' + who(a) + contactHtml(a.contact) + " · " + when(a.answered, a.answered_at) + "</p>" +
              para(a.body || "") + mediaHtml(a.media_links) +
              '<div class="qa-acts">' + acts + "</div>" +
              '<form class="qa-report" hidden novalidate>' +
                '<input name="reason" maxlength="200" data-ph-zh="' + esc(QA.repPh.zh) + '" data-ph-en="' + esc(QA.repPh.en) + '" aria-label="' + esc(QA.repPh.zh + " / " + QA.repPh.en) + '">' +
                '<button type="submit" class="qa-act">' + bi(QA.repSend) + "</button>" +
                '<button type="button" class="qa-act" data-act="report-cancel">' + bi(QA.cancel) + "</button>" +
              "</form>" +
              '<p class="qa-act-msg" role="status"></p>' +
            "</li>"
          );
        }
        function answersHtml(q) {
          var as = liveAnswers(q), byId = {};
          as.forEach(function (a) { if (a.id) byId[a.id] = a; });
          if (!as.length) return '<p class="qa-none">' + bi(QA.noAns) + "</p>";
          return '<ol class="qa-answers">' + as.map(function (a) { return answerHtml(a, q, byId); }).join("") + "</ol>";
        }
        function countHtml(q) {
          var n = liveAnswers(q).length;
          return n + "<span class=\"zh\">" + QA.nAns.zh + "</span><span class=\"en\">" + (n === 1 ? " answer" : QA.nAns.en) + "</span>";
        }
        function formHtml() {
          return (
            '<form class="qa-form" novalidate>' +
              '<label class="qa-f-l" for="qa-body"><span aria-hidden="true">✎</span> ' + bi(QA.answer) + "</label>" +
              '<p class="qa-f-reply" hidden><span class="qa-f-reply-who"></span> <button type="button" class="qa-f-unreply" aria-label="cancel">×</button></p>' +
              '<textarea id="qa-body" name="body" rows="4" maxlength="5000" data-ph-zh="' + esc(QA.ph.zh) + '" data-ph-en="' + esc(QA.ph.en) + '"></textarea>' +
              '<div class="qa-f-row">' +
                '<span class="qa-f-id">' + bi(QA.as) + '<b class="qa-f-nick"></b>' + bi(QA.asTail) + "</span>" +
                '<label class="qa-f-anon"><input type="checkbox" name="anon"> ' + bi(QA.anonBox) + "</label>" +
                '<button class="btn primary qa-post" type="submit">' + bi(QA.post) + "</button>" +
              "</div>" +
              '<div class="tf-hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>' +
              '<p class="qa-f-rule">' + bi(QA.rule) + "</p>" +
              '<p class="qa-f-status" role="status" aria-live="polite"></p>' +
            "</form>"
          );
        }
        function placeholders(l) {
          thread.querySelectorAll("[data-ph-zh]").forEach(function (el) { el.placeholder = el.getAttribute("data-ph-" + l); });
        }
        langHooks.push(placeholders);
        function paintIdentity() {
          var f = thread.querySelector(".qa-form");
          if (!f) return;
          var anon = f.elements.anon.checked;
          f.querySelector(".qa-f-nick").textContent = anon ? QA.anon[root.getAttribute("data-lang")] : myNick();
          f.classList.toggle("is-anon", anon);
        }
        langHooks.push(paintIdentity);
        function render(q) {
          current = q;
          document.title = q.title + " · loveshed";
          thread.innerHTML =
            '<div class="qa-t-top"><a class="qa-back" href="qa.html">' + bi(QA.back) + "</a>" + starBtn("q", q.id, "fav-t") + "</div>" +
            '<article class="qa-t-q">' +
              '<h1 class="qa-t-title">' + esc(q.title) + "</h1>" +
              '<p class="qa-by">' + who(q) + contactHtml(q.contact) + " · " + when(q.asked, q.asked_at) + "</p>" +
              '<div class="qa-body">' + para(q.body || "") + "</div>" + mediaHtml(q.media_links) +
            "</article>" +
            '<h2 class="qa-t-count">' + countHtml(q) + "</h2>" +
            '<div class="qa-ans-wrap">' + answersHtml(q) + "</div>" +
            formHtml();
          placeholders(root.getAttribute("data-lang"));
          paintIdentity();
          var target = location.hash && document.getElementById(location.hash.slice(1));
          if (target && target.classList.contains("qa-a")) { target.classList.add("hl"); setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "center" }); }, 150); }
        }
        function repaintAnswers() {
          thread.querySelector(".qa-ans-wrap").innerHTML = answersHtml(current);
          thread.querySelector(".qa-t-count").innerHTML = countHtml(current);
          placeholders(root.getAttribute("data-lang"));
        }
        function refresh() {
          return loadQA(true).then(function (qs) {
            var q = qs.filter(function (x) { return x.id === qid; })[0];
            if (!q) return false;
            // forget local "deleted" marks once the board itself no longer has them
            var ids = (q.answers || []).map(function (a) { return a.id; });
            writeList(HIDDEN, hidden().filter(function (h) { return ids.indexOf(h) >= 0; }));
            current = q; repaintAnswers();
            return true;
          }).catch(function () { return false; });
        }
        loadQA().then(function (qs) {
          var q = qs.filter(function (x) { return x.id === qid; })[0];
          if (!q) {
            thread.innerHTML = '<div class="qa-t-top"><a class="qa-back" href="qa.html">' + bi(QA.back) + '</a></div><p class="qa-fail">' + bi(QA.missing) + "</p>";
            return;
          }
          render(q);
        }).catch(function () {
          thread.innerHTML = '<div class="qa-t-top"><a class="qa-back" href="qa.html">' + bi(QA.back) + '</a></div><p class="qa-fail">' + bi(QA.fail) + "</p>";
        });

        function post(d) {
          var ctl = "AbortController" in window ? new AbortController() : null;
          var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
          return fetch(INTAKE, {
            method: "POST", mode: "cors", credentials: "omit", cache: "no-store",
            headers: { "Content-Type": "application/json" }, body: JSON.stringify(d), signal: ctl ? ctl.signal : undefined
          }).then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) { clearTimeout(timer); return { status: r.status, j: j }; });
          }, function (e) { clearTimeout(timer); throw e; });
        }
        function setReply(aid) {
          var f = thread.querySelector(".qa-form"), box = f.querySelector(".qa-f-reply");
          replyTo = aid || "";
          if (replyTo) {
            var a = (current.answers || []).filter(function (x) { return x.id === replyTo; })[0];
            box.querySelector(".qa-f-reply-who").innerHTML = bi(QA.replyTo) + "@" + esc(a ? whoText(a) : "");
          }
          box.hidden = !replyTo;
        }

        thread.addEventListener("change", function (e) { if (e.target.name === "anon") paintIdentity(); });
        thread.addEventListener("click", function (e) {
          var fv = e.target.closest("button[data-fav]");
          if (fv) { var on = fv.getAttribute("aria-pressed") !== "true"; setFav("q", current.id, current.title, on); paintStar(fv, on); return; }
          if (e.target.closest(".qa-f-unreply")) { setReply(""); return; }
          if (e.target.closest(".qa-refresh")) { var rb = e.target.closest(".qa-refresh"); rb.disabled = true; refresh().then(function () { rb.disabled = false; }); return; }
          var b = e.target.closest("button[data-act]");
          if (!b) return;
          var li = b.closest(".qa-a"), aid = li && li.getAttribute("data-aid"), act = b.getAttribute("data-act");
          var msg = li && li.querySelector(".qa-act-msg");
          function say(kind, m) { msg.className = "qa-act-msg " + kind; msg.innerHTML = bi(m); }
          if (act === "reply") {
            setReply(aid);
            var f = thread.querySelector(".qa-form");
            f.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(function () { f.elements.body.focus({ preventScroll: true }); }, 350);
          } else if (act === "report") {
            li.querySelector(".qa-report").hidden = false;
            li.querySelector(".qa-report input").focus();
          } else if (act === "report-cancel") {
            li.querySelector(".qa-report").hidden = true;
          } else if (act === "delete") {
            // in-page two-step confirm (no window.confirm: home-screen shells don't always show it)
            if (!b.classList.contains("arm")) {
              b.classList.add("arm"); b.innerHTML = bi(QA.delSure);
              setTimeout(function () { if (b.isConnected && !b.disabled) { b.classList.remove("arm"); b.innerHTML = bi(QA.del); } }, 4000);
              return;
            }
            var toks = myTokens(), tok = toks[aid] || toks[current.id];
            if (!tok) return;
            b.disabled = true; b.innerHTML = bi(QA.deleting);
            post({ type: "delete", item_id: aid, token: tok, device_id: myDevice() }).then(function (res) {
              if (res.status === 202 && res.j.ok) {
                var h = hidden(); if (h.indexOf(aid) < 0) h.push(aid); writeList(HIDDEN, h);
                li.classList.add("gone"); li.innerHTML = '<p class="qa-none">' + bi(QA.deleted) + "</p>";
                thread.querySelector(".qa-t-count").innerHTML = countHtml(current);
                setTimeout(refresh, 75000);
                return;
              }
              b.disabled = false; b.classList.remove("arm"); b.innerHTML = bi(QA.del);
              say("err", res.status === 429 ? QA.wait : QA.actFail);
            }).catch(function () { b.disabled = false; b.classList.remove("arm"); b.innerHTML = bi(QA.del); say("err", QA.actFail); });
          }
        });

        thread.addEventListener("submit", function (e) {
          e.preventDefault();
          var rf = e.target.closest(".qa-report");
          if (rf) return sendReport(rf);
          var f = e.target.closest(".qa-form");
          if (f) sendAnswer(f);
        });
        function sendReport(rf) {
          var li = rf.closest(".qa-a"), aid = li.getAttribute("data-aid"), btn = rf.querySelector("button[type=submit]");
          var msg = li.querySelector(".qa-act-msg");
          var reason = (rf.elements.reason.value || "").trim();
          if (/[<>]/.test(reason)) reason = reason.replace(/[<>]/g, "");
          btn.disabled = true;
          post({ type: "report", item_id: aid, reason: reason, device_id: myDevice() }).then(function (res) {
            if ((res.status === 201 || res.status === 200) && res.j.ok) {
              var r = readList(REPORTED); if (r.indexOf(aid) < 0) r.push(aid); writeList(REPORTED, r);
              rf.hidden = true;
              var rb = li.querySelector('[data-act="report"]'); rb.disabled = true; rb.innerHTML = bi(QA.reported);
              msg.className = "qa-act-msg ok"; msg.innerHTML = bi(QA.repOk);
              return;
            }
            btn.disabled = false;
            msg.className = "qa-act-msg err"; msg.innerHTML = bi(res.status === 429 ? QA.wait : QA.actFail);
          }).catch(function () { btn.disabled = false; msg.className = "qa-act-msg err"; msg.innerHTML = bi(QA.actFail); });
        }
        function sendAnswer(f) {
          if (f.getAttribute("data-busy")) return;
          var st = f.querySelector(".qa-f-status"), btn = f.querySelector(".qa-post"), ta = f.elements.body;
          function say(kind, m, extra) { st.className = "qa-f-status " + kind; st.innerHTML = bi(m) + (extra || ""); }
          var body = (ta.value || "").trim();
          ta.classList.remove("bad");
          if (!body) { ta.classList.add("bad"); return say("err", QA.need); }
          if (ANSWER_LINK_RE.test(body)) { ta.classList.add("bad"); return say("err", QA.textOnly); }
          var h = hashText("answer\n" + qid + "\n\n" + body + "\n");
          if (lsGet("loveshed-tip-last-hash") === h) return say("err", QA.dup);
          if (Date.now() - (+lsGet("loveshed-tip-last-at") || 0) < 60 * 1000) return say("err", QA.wait);
          f.setAttribute("data-busy", "1"); btn.disabled = true; btn.innerHTML = bi(QA.posting); say("", { zh: "", en: "" });
          var anon = f.elements.anon.checked, rt = replyTo, ok = false;
          var d = { type: "answer", question_id: qid, body: body, nickname: anon ? "" : myNick(), reply_to: rt,
                    device_id: myDevice(), contact: "", contact_visibility: "private", media_links: [],
                    website: (f.elements.website.value || "").trim() };
          post(d).then(function (res) {
            if (res.status === 201 && res.j.ok) {
              ok = true;
              lsSet("loveshed-tip-last-at", String(Date.now())); lsSet("loveshed-tip-last-hash", h);
              saveToken(res.j.item_id, res.j.token);
              addMine({ type: "answer", at: new Date().toISOString(), title: "", excerpt: body.slice(0, 140),
                        question_id: qid, question_title: current.title });
              ta.value = ""; setReply("");
              btn.innerHTML = bi(QA.posted); f.classList.add("posted");
              say("ok", QA.okMsg, ' <button type="button" class="qa-refresh">' + bi(QA.refresh) + "</button>");
              [35000, 75000].forEach(function (ms) { setTimeout(refresh, ms); });
              return;
            }
            if (res.status === 429) return say("err", QA.wait);
            if (res.status === 400 && (res.j.reason === "links_not_allowed" || res.j.reason === "answers_text_only")) { ta.classList.add("bad"); return say("err", QA.textOnly); }
            if (res.status === 400 && res.j.field === "reply_to") return say("err", QA.goneR);
            if (res.status === 400 && res.j.field === "question_id") return say("err", QA.gone);
            say("err", QA.down);
          }).catch(function () {
            say("err", QA.down);
          }).then(function () {
            setTimeout(function () {
              f.removeAttribute("data-busy"); btn.disabled = false;
              if (!ok) btn.innerHTML = bi(QA.post);
            }, ok ? 4000 : 1200);
          });
        }
        thread.addEventListener("input", function (e) {
          var f = e.target.closest(".qa-form");
          if (f && f.classList.contains("posted") && !f.getAttribute("data-busy")) {
            f.classList.remove("posted"); f.querySelector(".qa-post").innerHTML = bi(QA.post);
          }
        });
      }
    }

    /* ---------- "Mine" (mine.html) ---------- */
    function initMine() {
      var favEl = document.getElementById("mine-favs");
      if (!favEl) return;
      var M = {
        skill:   { zh: "工艺卡", en: "Craft card" },
        q:       { zh: "问题", en: "Question" },
        live:    { zh: "已上墙", en: "On the board" },
        pending: { zh: "审核中，还没上墙", en: "In review — not on the board yet" },
        unknown: { zh: "暂时查不到状态", en: "Status unavailable right now" },
        checking:{ zh: "查询中…", en: "Checking…" },
        re:      { zh: "回答：", en: "Re: " },
        saved:   { zh: "收藏于 ", en: "saved " },
        sent:    { zh: "投于 ", en: "sent " }
      };
      function when(iso) { return '<time datetime="' + esc(iso) + '">' + bi(ago(iso.slice(0, 10), iso)) + "</time>"; }
      function count(k, n) { document.querySelector('.mine-n[data-n="' + k + '"]').textContent = n ? "· " + n : ""; }
      function empty(k, n) { document.querySelector('[data-empty="' + k + '"]').hidden = n > 0; }
      function title(t) { return typeof t === "string" ? esc(t) : bi(t || { zh: "", en: "" }); }

      function renderFavs() {
        var favs = readList(FAV_KEY);
        favEl.innerHTML = favs.map(function (f) {
          var href = f.kind === "skill" ? "./#skill-" + encodeURIComponent(f.id) : qaLink(f.id);
          return '<li class="mine-item">' +
            '<a class="mine-link" href="' + href + '">' +
              '<span class="mine-tag">' + bi(f.kind === "skill" ? M.skill : M.q) + "</span>" +
              '<span class="mine-title">' + title(f.title) + "</span>" +
              '<span class="mine-meta">' + bi(M.saved) + when(f.at || "") + "</span>" +
            "</a>" + starBtn(f.kind, f.id) + "</li>";
        }).join("");
        count("favs", favs.length); empty("favs", favs.length);
      }
      favEl.addEventListener("click", function (e) {
        var fv = e.target.closest("button[data-fav]");
        if (!fv) return;
        setFav(fv.getAttribute("data-fav"), fv.getAttribute("data-fav-id"), null, false);
        renderFavs();
      });
      renderFavs();

      var mine = readList(MINE_KEY);
      function renderMine(qs, checking) {
        var byId = {}, byTitle = {};
        (qs || []).forEach(function (q) { byId[q.id] = q; byTitle[(q.title || "").trim()] = q; });
        ["question", "answer"].forEach(function (type) {
          var recs = mine.filter(function (r) { return r.type === type; });
          document.getElementById("mine-" + type).innerHTML = recs.map(function (r) {
            var href = "", state = checking ? "checking" : qs ? "pending" : "unknown";
            if (type === "question") {
              var hit = byTitle[(r.title || "").trim()];
              if (hit) { href = qaLink(hit.id); state = "live"; }
            } else {
              var q = byId[r.question_id];
              if (q) {
                href = qaLink(q.id);
                var ex = (r.excerpt || "").trim();
                if (ex && (q.answers || []).some(function (a) { return (a.body || "").trim().indexOf(ex) === 0; })) state = "live";
              }
            }
            var head = type === "question" ? esc(r.title)
                     : bi(M.re) + esc(r.question_title || (byId[r.question_id] || {}).title || r.question_id);
            var inner =
              '<span class="mine-state ' + state + '">' + bi(M[state]) + "</span>" +
              '<span class="mine-title">' + head + "</span>" +
              '<span class="mine-ex">' + esc(r.excerpt || "") + "</span>" +
              '<span class="mine-meta">' + bi(M.sent) + when(r.at || "") + "</span>";
            return '<li class="mine-item">' + (href ? '<a class="mine-link" href="' + href + '">' + inner + "</a>"
                                                    : '<div class="mine-link">' + inner + "</div>") + "</li>";
          }).join("");
          count(type, recs.length); empty(type, recs.length);
        });
      }
      renderMine(null, mine.length > 0);
      if (mine.length) loadQA().then(function (qs) { renderMine(qs); }, function () { renderMine(null); });
    }
  });
})();
