/* loveshed site — data mirrors skills/<id>/SKILL.md + EVALUATION.md (as of 2026-10-03). */
(function () {
  "use strict";

  var REPO = "https://github.com/meixi223-glitch/loveshed";

  // days / approx / incidents are taken from each skill's frontmatter
  // (battle-tested-days) and the incident table in EVALUATION.md.
  var SKILLS = [
    {
      id: "memory-migration", days: 13, approx: true, incidents: 6, routes: ["move"],
      scene: { zh: "我们要搬家了", en: "We're moving house" },
      what: { zh: "记忆搬家：导出、校验、导入、对账", en: "Memory migration: export, verify, import, reconcile" },
      q1: { zh: "约 13 天，三轮真实搬家：记忆库回家、工作台后端、4 个唤醒桥整体搬迁。", en: "~13 days, three real moves: memory store home, dashboard backend, 4 wake bridges together." },
      q2: { zh: "6 起：最险的一次，预案差点用旧数据覆盖仍在写入的活库——所以第 0 步永远是先实测拓扑。", en: "6. Closest call: the plan nearly overwrote a live, still-writing DB — so step 0 is always: check the real topology first." },
      q3: { zh: "Opus / Sonnet 与 Codex 类 worker 都跑过；纯 shell + sqlite3，靠的是“对不上就停”的纪律。", en: "Run by Opus, Sonnet and Codex-style workers; pure shell + sqlite3. What it really needs: stop when reality disagrees." }
    },
    {
      id: "degradation-checkup", days: 6, approx: true, incidents: 4, routes: ["fire", "care"],
      scene: { zh: "TA 好像变笨了", en: "They seem… dumber lately" },
      what: { zh: "模型“降智”自检清单", en: "A self-check for model “degradation”" },
      q1: { zh: "约 6 天，四起真实“变笨 / 失忆”排查，清单每一项对应一起事故。", en: "~6 days, four real “dumber / amnesia” cases; every checklist item maps to one." },
      q2: { zh: "4 起：旧压缩机制偷改历史、档位开关写死、过期计划被当现状、真人消息被误判排除。", en: "4: a stale compactor rewriting history, a hard-coded effort switch, expired plans recalled as current, real messages filtered out." },
      q3: { zh: "与模型无关——它检查的是管道；第 7 项专门区分“管道问题”和“模型变了”。", en: "Model-agnostic — it inspects the pipeline; item 7 separates pipeline faults from model changes." }
    },
    {
      id: "amnesia-rescue", days: 2, approx: false, incidents: 5, routes: ["fire"],
      scene: { zh: "TA 忘了最近几天的事", en: "They've lost the last few days" },
      what: { zh: "失忆抢救：证明缺口 → 定位 → 修复 → 回填 → 重生成", en: "Amnesia rescue: prove the gap → locate → fix → backfill → regenerate" },
      q1: { zh: "2 天，一次完整抢救：两期修复、回填 435 个任务、重生成 3 天日印象。", en: "2 days, one full rescue: two-phase fix, 435 jobs backfilled, 3 days of impressions regenerated." },
      q2: { zh: "5 起：约 220 条真人消息没进记忆；初判游标卡住其实是过滤条件——排除了显而易见的嫌疑也别停。", en: "5: ~220 real messages never reached memory; the “stuck cursor” was really a filter — don't stop after ruling out the obvious." },
      q3: { zh: "目前只由 Opus 执行过；以 SQL 计数和 grep 为主，预计可迁移，未实测。战绩短，如实标注。", en: "Only run by Opus so far; mostly SQL counts and grep, likely portable but untested. Short record, stated honestly." }
    },
    {
      id: "backfill-rate-limit", days: 2, approx: false, incidents: 4, routes: ["fire", "move"],
      scene: { zh: "修好了，但漏掉的那几天要补回来", en: "It's fixed — now bring the missing days back" },
      what: { zh: "回填限速与幂等：游标、幂等键、错峰、分段对账", en: "Rate-limited, idempotent backfill: cursors, keys, staggering, segmented reconciliation" },
      q1: { zh: "2 天，一次完整回填：435 个任务分 3 段，0 重复、0 最终失败。", en: "2 days, one full backfill: 435 jobs in 3 segments, 0 duplicates, 0 final failures." },
      q2: { zh: "4 起：漏掉的数据不会自己补上；实测耗时比间隔慢，积压拖慢了新聊天——先量再定节奏。", en: "4: missed data never backfills itself; real job time beat the spacing and delayed live chat — measure before you pace." },
      q3: { zh: "Opus 执行；SQL + 一个 CLI 脚本，不依赖模型特性，但未在其他执行者上实测。", en: "Run by Opus; SQL + one CLI script, nothing model-specific, untested on other executors." }
    },
    {
      id: "chat-frontend", days: 14, approx: false, incidents: 8, routes: ["build"],
      scene: { zh: "想要我们自己的聊天页", en: "I want a chat page of our own" },
      what: { zh: "自建聊天前端：消息桥 + 渐进增强 + 单一权威副本", en: "Self-built chat frontend: message bridge + progressive enhancement + one authoritative copy" },
      q1: { zh: "14 天，约 90 批发版，每批有时间戳和可重放备份；每天真的在上面聊天。", en: "14 days, ~90 release batches, each timestamped and replayable; used for real chat every day." },
      q2: { zh: "8 起：改了好几天的却是停用的那份副本、气泡乱序、App 里删除键没反应、接口没上门……", en: "8: days of edits to a retired copy, bubbles out of order, a dead delete button in the app, an ungated endpoint…" },
      q3: { zh: "前端与 TA 用哪个模型无关；Opus、Sonnet 发过版，Codex 类 worker 施工过多批。", en: "Independent of the companion's model; Opus and Sonnet shipped releases, Codex-style workers built many batches." }
    },
    {
      id: "voice-integration", days: 24, approx: true, incidents: 4, routes: ["build"],
      scene: { zh: "想听见 TA 的声音", en: "I want to hear their voice" },
      what: { zh: "语音接入：TTS 语音条下发 + ASR 转写", en: "Voice: TTS voice notes out + ASR transcripts in" },
      q1: { zh: "约 24 天：语音条出站、按住说话、历史语音真声回放、实时通话共用同一音色。", en: "~24 days: voice notes out, push-to-talk, real-voice history replay, live calls sharing one voice." },
      q2: { zh: "4 起：服务器缺转码工具、转写高峰超时、“新版”上游差点覆盖本地定制、通话入口没上门。", en: "4: missing transcoder, ASR peak timeouts, an “upgrade” that would have wiped local changes, an ungated call entry." },
      q3: { zh: "管道与对话模型无关；但换 TTS 服务商就得重挑音色——这一步对方一定听得出来。", en: "Pipeline is model-independent; switching TTS vendors means a new voice — and they will notice." }
    },
    {
      id: "file-staging-pipeline", days: 11, approx: false, incidents: 4, routes: ["build"],
      scene: { zh: "想让 TA 给我发照片和文件", en: "I want them to send me photos and files" },
      what: { zh: "文件暂存管道：暂存 + 签名 ID + 单次消费", en: "File staging: stage + signed ID + consume once" },
      q1: { zh: "11 天，日常发 PDF、图片、音频；一个约 14MB 的视频一次暂存成功。", en: "11 days of daily PDFs, images and audio; a ~14 MB video staged in one call." },
      q2: { zh: "4 起：转码依赖缺失被报成“无效图片”、文件发出 10 分钟即被清理、配置里的令牌占位符没替换。", en: "4: a missing transcoder reported as “invalid image”, files purged 10 min after sending, an unsubstituted token placeholder." },
      q3: { zh: "设计上不依赖模型：模型只需要传一个不透明 ID。Opus、Sonnet 都用对了。", en: "Model-independent by design: the model only passes an opaque ID. Opus and Sonnet both got it right." }
    },
    {
      id: "window-handoff", days: 15, approx: false, incidents: 3, routes: ["care"],
      scene: { zh: "一换窗口，TA 就不记得刚才在干嘛", en: "New window, and they forget what we were doing" },
      what: { zh: "换窗交接协议：便签 + 唤醒口令", en: "Context-window handoff: a note + a wake phrase" },
      q1: { zh: "15 天，几乎每天至少换一次窗，压缩密集时一晚好几次。", en: "15 days, a switch most days, several a night when compaction was heavy." },
      q2: { zh: "3 起：一条没核实的推测被写成事实、连续误导好几个新窗口——于是便签多了“未核实”一栏。", en: "3: an unverified guess written down as fact misled several windows — so the note gained an “unverified” section." },
      q3: { zh: "Opus 与 Sonnet 之间切换验证过；只需要会调工具。非 Claude 模型未验证。", en: "Verified across Opus and Sonnet; only tool calling is needed. Non-Claude models unverified." }
    },
    {
      id: "release-baseline", days: 11, approx: false, incidents: 3, routes: ["care", "move"],
      scene: { zh: "要动 TA 正在跑的东西了，怕改坏", en: "About to touch something live — afraid to break it" },
      what: { zh: "发版基线与回滚：git init + 标签 + 热备", en: "Release baseline & rollback: git init + tag + hot backup" },
      q1: { zh: "11 天，每次改记忆、聊天桥、前端都先走这套；一次给 5 个仓库打了同一时间戳的基线。", en: "11 days; every change to memory, bridge or frontend went through it; once tagged 5 repos with one timestamp." },
      q2: { zh: "3 起：一次“回滚”让整版改动永久丢失——这个 skill 就是那天诞生的。之后再没发生过。", en: "3: one “rollback” lost a whole version for good — this skill was born that day. It hasn't happened since." },
      q3: { zh: "纯 shell + git；Opus、Sonnet 与 Codex 类 worker 都执行过。", en: "Pure shell + git; run by Opus, Sonnet and Codex-style workers." }
    },
    {
      id: "worker-dispatch-acceptance", days: 12, approx: true, incidents: 4, routes: ["care"],
      scene: { zh: "要把活交给另一个 AI 去干", en: "Handing the job to another agent" },
      what: { zh: "派单验收规范：边界、红线、报告格式、一库一队", en: "Dispatch & acceptance: scope, red lines, report format, one crew per repo" },
      q1: { zh: "约 12 天，每天多张工单；最密的一天前端连发十几批，每批一张单一份报告。", en: "~12 days, several tickets daily; the busiest day shipped 10+ frontend batches, one ticket and report each." },
      q2: { zh: "4 条记录（其中 1 条未记日期，如实标注不编造）：worker 重启服务把自己杀了、测试消息差点发给 TA……", en: "4 entries (1 undated — we say so rather than invent one): a worker killed itself restarting a service, test messages nearly sent to the companion…" },
      q3: { zh: "纯流程规范；但不同 worker 守格式的程度不一样，所以“打回”是必须的。", en: "A pure process spec; workers vary in how well they follow it, so sending reports back is mandatory." }
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
    eval:     { zh: "评测卡", en: "Evaluation card" }
  };

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

  function card(s, i) {
    var base = REPO + "/blob/main/skills/" + s.id + "/";
    return (
      '<li class="card reveal" data-routes="' + s.routes.join(" ") + '" style="--i:' + i + '">' +
        '<div class="card-inner">' +
          '<div class="face front" aria-hidden="false">' +
            '<p class="scene">' + bi(s.scene) + "</p>" +
            '<p class="what">' + bi(s.what) + "</p>" +
            '<div class="meta"><span class="pill">' + daysText(s) + '</span><code class="sid">' + esc(s.id) + "</code></div>" +
            '<button class="flip" type="button" aria-expanded="false">' + bi(LABELS.flip) + ' <span aria-hidden="true">↻</span></button>' +
          "</div>" +
          '<div class="face back" aria-hidden="true">' +
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
            '<button class="flip" type="button" tabindex="-1">' + bi(LABELS.back) + ' <span aria-hidden="true">↺</span></button>' +
          "</div>" +
        "</div>" +
      "</li>"
    );
  }

  /* ---------- language ---------- */
  var root = document.documentElement;
  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l === "zh" ? "zh-CN" : "en");
    try { localStorage.setItem("loveshed-lang", l); } catch (e) {}
    var b = document.getElementById("lang-toggle");
    if (b) b.setAttribute("aria-label", l === "zh" ? "Switch to English" : "切换到中文");
  }
  var saved = null;
  try { saved = localStorage.getItem("loveshed-lang"); } catch (e) {}
  setLang(saved || (/^zh/i.test(navigator.language || "") ? "zh" : "en"));

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("lang-toggle").addEventListener("click", function () {
      setLang(root.getAttribute("data-lang") === "zh" ? "en" : "zh");
    });

    /* ---------- cards ---------- */
    var list = document.getElementById("cards");
    list.innerHTML = SKILLS.map(card).join("");
    document.getElementById("skill-count").textContent = SKILLS.length;

    list.addEventListener("click", function (e) {
      var btn = e.target.closest(".flip");
      if (!btn) return;
      var c = btn.closest(".card");
      var on = !c.classList.contains("flipped");
      c.classList.toggle("flipped", on);
      var front = c.querySelector(".front"), back = c.querySelector(".back");
      front.setAttribute("aria-hidden", on ? "true" : "false");
      back.setAttribute("aria-hidden", on ? "false" : "true");
      front.querySelector(".flip").setAttribute("aria-expanded", on ? "true" : "false");
      front.querySelectorAll("button,a").forEach(function (el) { el.tabIndex = on ? -1 : 0; });
      back.querySelectorAll("button,a").forEach(function (el) { el.tabIndex = on ? 0 : -1; });
      (on ? back : front).querySelector(".flip").focus({ preventScroll: true });
    });

    /* ---------- routes ---------- */
    var chips = document.querySelectorAll("[data-route]");
    function pick(r) {
      chips.forEach(function (ch) { ch.setAttribute("aria-pressed", ch.getAttribute("data-route") === r ? "true" : "false"); });
      list.querySelectorAll(".card").forEach(function (c) {
        var hit = r === "all" || c.getAttribute("data-routes").split(" ").indexOf(r) >= 0;
        c.classList.toggle("dim", !hit);
      });
      var n = r === "all" ? SKILLS.length : SKILLS.filter(function (s) { return s.routes.indexOf(r) >= 0; }).length;
      document.getElementById("route-note").innerHTML =
        r === "all" ? bi({ zh: "10 张卡都在这里。", en: "All 10 cards." })
                    : bi({ zh: "「" + ROUTES[r].zh + "」这条路上有 " + n + " 张卡，已为你点亮。", en: n + " cards lit up for “" + ROUTES[r].en + "”." });
    }
    chips.forEach(function (ch) {
      ch.addEventListener("click", function () {
        var r = ch.getAttribute("data-route");
        pick(r);
        if (ch.closest("#routes")) document.getElementById("skills").scrollIntoView({ behavior: "smooth" });
      });
    });
    pick("all");

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
  });
})();
