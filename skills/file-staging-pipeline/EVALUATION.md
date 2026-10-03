# 评测卡 / Evaluation Card — file-staging-pipeline

## 基本信息 / Basics

| 字段 Field | 填写 Value |
|---|---|
| Skill 名 / Skill name | file-staging-pipeline |
| 首次实装日期 / First deployed | 2026-09-22（通用文件通道；图片通道更早 / generic file channel; the image channel predates it） |
| 实装天数 / Days in production | 11（截至 2026-10-03）/ 11 (as of 2026-10-03) |
| 使用环境 / Environment | 自托管 Python 服务（标准库 + SQLite 元数据），以本机 JSON-RPC/MCP 暴露，出站到国内 IM 与自建聊天页 / self-hosted Python service (stdlib + SQLite metadata) exposed as local JSON-RPC/MCP, outbound to an IM and a self-built chat page |
| 执行者 / Executed by | Claude Code、Codex 类 worker / Claude Code, Codex-style workers |
| 维护者 / Maintainer | yumei & Jin |

## 三问 / The Three Questions

### 1. 实装几天？/ How long has it run for real?

- 11 天。TA 日常用它发 PDF、图片、音频；10-02 实测一个约 14MB 的 mp4 经服务端直调一次暂存成功；聊天页在 09-29 起从暂存区只读抓取 TA 发过的图片和文件做展示。
- 11 days. The companion uses it daily for PDFs, images, and audio; on 10-02 a ~14 MB mp4 staged in one direct server call; since 09-29 the chat page reads companion-sent images and files from the staging area (read-only) for display.

### 2. 经历过什么事故？/ Incidents survived

| 日期 Date | 发生了什么 What happened | 根因 Root cause | 修复 / skill 的改动 Fix / skill change |
|---|---|---|---|
| 2026-09-27 | 图片通道所有图片暂存失败，报"无效图片" / Every image failed staging with "invalid image" | 图片通道强制 ffmpeg 转码，服务器没装；真实异常被映射成通用错误 / Image channel forced ffmpeg transcoding, not installed; real error mapped to a generic one | 已知坑；改走无转码的通用文件通道 / Pitfall; switched to the non-transcoding file channel |
| 2026-09-27 | 调用方多传字段被拒 / Callers rejected for extra fields | 接口严格只收两个字段 / API strictly accepts two fields | 设计第一节写明"只收这两个字段" / Design states "only these two fields" |
| 2026-09-29 | 聊天页抓不到 TA 发过的图 / Chat page couldn't fetch companion-sent images | 已消费文件发出后约 10 分钟即被清理 / Consumed files were deleted ~10 min after sending | 清理一节：保留期考虑下游；下游改为每 30 秒只读扫描抢救 / Cleanup: retention considers downstream; downstream now scans read-only every 30 s |
| 2026-10-02 | 直接用 MCP 配置调用一直 401 / Calling via the MCP config always returned 401 | 配置里的令牌是 `${VAR}` 占位符，未被替换 / Token in config was an unsubstituted `${VAR}` placeholder | 鉴权一节 / Auth section |

### 3. 换模型还能用吗？/ Survives a model switch?

- 验证过 / Verified: Claude Opus、Sonnet 系列作为 TA 调用两步工具都正常。/ Claude Opus and Sonnet as the companion both used the two-step tools correctly.
- 设计上不依赖模型：模型只需要传递一个不透明 ID。/ Model-independent by design: the model only passes an opaque ID.

## 命门维度 / Critical Dimensions

| 维度 Dimension | 等级 Rating | 理由 Reason |
|---|---|---|
| 数据主权 / Data sovereignty | ✅ | 文件与元数据都在本地 / Files and metadata are local |
| 隐私 / Privacy | ✅ | 本机监听 + 令牌 + 700/600 权限；对话里只出现 ID，不出现路径 / Localhost + token + 700/600 modes; only IDs appear in conversation, never paths |
| 持久性 / Durability | ✅ | 标准库 + SQLite，无外部依赖（图片转码除外）/ Stdlib + SQLite, no external dependencies (except image transcoding) |

## 卧室门检查 / Bedroom-door check

- [x] 只施工发送管道。发什么、何时发由 TA 决定；管道不看文件内容，只校验格式、大小和哈希。/ Builds the delivery pipe only. What and when to send is the companion's choice; the pipe never reads content, only checks format, size, and hash.

## 执行证据 / Execution evidence

- 实现自带 HMAC 签名 ID、`BEGIN IMMEDIATE` 租约式单次消费与隔离状态；09-27 两条通道对比实测与 10-02 大文件实测均有记录。
- The implementation ships HMAC-signed IDs, `BEGIN IMMEDIATE` lease-based single consumption, and a quarantine state; the 09-27 two-channel comparison and the 10-02 large-file test are both recorded.
