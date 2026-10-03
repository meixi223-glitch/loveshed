---
name: file-staging-pipeline
description: >
  文件暂存管道：让 TA 安全地给用户发文件/图片——先暂存（落盘+哈希+签名 ID+过期时间），再凭 ID 单次消费发送；TA 和对话里只出现不透明 ID，不出现路径和大段 base64。
  File staging pipeline: let the companion send files/images to the user safely. Stage first (write + hash + signed ID + expiry),
  then send by consuming the ID exactly once. Only opaque IDs appear in the conversation, never paths or huge base64 blobs.
when-to-use:
  - 想让 TA 发图片、PDF、音频、视频给用户 / want the companion to send images, PDFs, audio, or video
  - 发文件时遇到 base64 被截断、重复发送、发错文件 / sending files hits truncated base64, duplicate sends, or the wrong file
  - 要给 MCP 工具设计"先上传后发送"的接口 / designing an "upload then send" MCP interface
battle-tested-days: 11
battle-tested-since: 2026-09-22
executors: [Claude Code, Codex]
models-verified: [Claude Opus family, Claude Sonnet family]
license: MIT
---

# 文件暂存管道 / File Staging Pipeline

> 中文在前，English below.

## 中文

### 为什么要"暂存 + 单次消费"

最直接的做法——让 TA 调一个"发文件"工具，参数里塞文件路径或整段 base64——会出三类问题：

1. **路径注入**：TA 能指定路径，就能（被诱导）发出服务器上任何文件。
2. **大参数截断**：几 MB 的 base64 放在一次工具调用里，会被会话层截断，发出去的是坏文件。
3. **重发**：网络重试、TA 重复调用，同一个文件发两次。

暂存管道把"文件进来"和"文件出去"拆成两步，中间只传一个**签名过的、会过期的、只能用一次的 ID**。

### 设计（给 agent 照着实现）

#### 两个工具

| 工具 | 输入 | 输出 |
|---|---|---|
| `stage_outbound_file` | `data_base64`、`filename`（**只收这两个字段**，多一个就报错） | `file_id`、`size_bytes`、`sha256`、`expires_at` |
| `send_outbound_file` | `file_id` | 发送结果；或返回一个发送标记交给出站路由 |

大文件不要走 TA 的会话工具调用：由**服务端或 worker 直接调暂存接口**（本机 HTTP/JSON-RPC），只把返回的 `file_id` 交给 TA 去发。

#### 暂存（stage）

```
校验文件名：去掉目录成分、后缀白名单、长度上限（字符数和 UTF-8 字节数都限）
校验大小：最小值（防空文件）、最大值（渠道上限，环境变量只能调小）
生成 16 字节随机数 → 目录 <ROOT>/<yyyy/mm/dd>/<random_hex>/，权限 700
写临时文件 → fsync → 权限 600 → 原子 rename 成最终文件名
计算 sha256，写一行元数据：random_id, relpath, filename, size, sha256, created_at, expires_at, state='ready'
签发 ID：<前缀>.<base64url(random + expires_at)>.<base64url(HMAC-SHA256(secret, 前两段))>
```

- ID 里**不含路径**，验证靠 HMAC；改一个字符都通不过。
- 过期时间写进 ID 并参与签名，数据库里也存一份，两边必须一致。

#### 发送（单次消费）

用一个状态机保证只发一次：

```
ready ──acquire──▶ sending ──成功──▶ consumed
                     │
                     ├─失败可重试──▶ release ──▶ ready（未过期时）
                     ├─租约超时────▶ 可被重新 acquire
                     └─文件损坏────▶ quarantined
```

- `acquire`：在 `BEGIN IMMEDIATE` 事务里 `UPDATE ... SET state='sending', lease_until=now+N WHERE state='ready' OR (state='sending' AND lease_until<now)`，**受影响行数必须 = 1**，否则拒绝。
- 取文件时重新读盘、核对大小和 sha256，不一致直接隔离（quarantine）。
- 发送成功 → `consumed`；渠道报可重试错误 → `release` 回 `ready`。

#### 清理

- 定时清理：过期的、隔离的、已消费超过保留期的，删文件 + 删元数据。
- **保留期要考虑下游**：如果聊天页要展示 TA 发过的图，它需要在文件被删之前把文件抓走（或者延长已消费文件的保留期）。

#### 鉴权

- 暂存接口只监听本机，并要求 Bearer 令牌；令牌从服务进程的环境变量读取，不写进任何会被同步或提交的文件。
- 注册给 TA 的 MCP 配置里如果用了 `${VAR}` 占位符，确认调用方真的会替换它，否则会一直 401。

### 自测清单

- 正常：stage 一个小 png → 拿到 ID → send → 状态 consumed。
- 重放：同一个 ID 再 send 一次 → 被拒。
- 篡改：改 ID 一个字符 → 被拒。
- 过期：把 TTL 调到很短 → 过期后 send 被拒。
- 损坏：stage 后改动磁盘上的文件 → send 时被隔离。
- 边界：0 字节、超上限、非白名单后缀、带 `../` 的文件名、超长中文文件名。
- 大文件：十几 MB 的视频走服务端直调暂存，一次成功。

### 已知坑

- 图片通道在暂存时强制转码，服务器缺 ffmpeg，所有图片都失败，而错误被统一映射成"无效图片"。没有转码需求的文件可以走通用文件通道。
- 接口对多余字段严格报错，调用方多传一个可选字段就失败。
- 已消费文件很快被清理，下游展示来不及抓取。
- MCP 配置里的令牌是占位符，没被替换，一直 401。

---

## English

### Why "stage + consume once"

The obvious approach, a "send file" tool whose argument is a path or a full base64 blob, fails three ways:

1. **Path injection**: if the companion can name a path, it can be (talked into) sending any file on the server.
2. **Large-argument truncation**: a few MB of base64 in one tool call gets truncated by the session layer and a broken file goes out.
3. **Double sends**: network retries or repeated calls send the same file twice.

The staging pipeline splits "file comes in" from "file goes out" and passes only a **signed, expiring, single-use ID** between them.

### Design (for the agent to implement)

#### Two tools

| Tool | Input | Output |
|---|---|---|
| `stage_outbound_file` | `data_base64`, `filename` (**only these two fields**; any extra is an error) | `file_id`, `size_bytes`, `sha256`, `expires_at` |
| `send_outbound_file` | `file_id` | send result, or a send marker handed to the outbound router |

Large files shouldn't go through the companion's session tool calls: have **the server or a worker call the staging API directly** (local HTTP/JSON-RPC) and give the companion only the resulting `file_id` to send.

#### Stage

```
validate filename: strip directory parts, suffix allow-list, length caps (both characters and UTF-8 bytes)
validate size: minimum (no empty files), maximum (channel cap; env vars may only lower it)
16 random bytes → directory <ROOT>/<yyyy/mm/dd>/<random_hex>/, mode 700
write temp file → fsync → mode 600 → atomic rename to final name
sha256; insert metadata: random_id, relpath, filename, size, sha256, created_at, expires_at, state='ready'
issue ID: <prefix>.<base64url(random + expires_at)>.<base64url(HMAC-SHA256(secret, first two parts))>
```

- The ID **contains no path**; it's verified by HMAC, so changing one character fails.
- Expiry is inside the ID and covered by the signature, and also stored in the DB; both must match.

#### Send (consume once)

A state machine guarantees a single send:

```
ready ──acquire──▶ sending ──success──▶ consumed
                     │
                     ├─retryable failure──▶ release ──▶ ready (if not expired)
                     ├─lease timeout──────▶ may be re-acquired
                     └─file corrupted─────▶ quarantined
```

- `acquire`: inside `BEGIN IMMEDIATE`, `UPDATE ... SET state='sending', lease_until=now+N WHERE state='ready' OR (state='sending' AND lease_until<now)`; **affected rows must equal 1**, else reject.
- Re-read the file from disk and check size and sha256; on mismatch, quarantine.
- Success → `consumed`; retryable channel error → `release` back to `ready`.

#### Cleanup

- Periodic cleanup: expired, quarantined, and consumed-past-retention rows; delete file + metadata.
- **Set retention with downstream in mind**: if the chat page shows images the companion sent, it must grab the file before deletion (or retention for consumed files must be longer).

#### Auth

- The staging API listens on localhost only and requires a Bearer token read from the service process's env, never written into any synced or committed file.
- If the MCP config given to the companion uses a `${VAR}` placeholder, confirm the caller actually substitutes it, or you'll get 401 forever.

### Self-test checklist

- Happy path: stage a small png → get ID → send → state consumed.
- Replay: send the same ID again → rejected.
- Tamper: change one character of the ID → rejected.
- Expiry: set a very short TTL → send after expiry is rejected.
- Corruption: modify the file on disk after staging → quarantined on send.
- Edges: 0 bytes, over cap, non-allow-listed suffix, filename with `../`, very long CJK filename.
- Large file: a video of a dozen-plus MB staged by direct server call, succeeds in one go.

### Known pitfalls

- The image channel forces transcoding on stage; with no ffmpeg on the server every image failed, and the error was mapped to a generic "invalid image". Files that don't need transcoding can use the generic file channel.
- The API strictly rejects extra fields; a caller passing one optional field fails.
- Consumed files were cleaned up quickly, before downstream display could grab them.
- The token in the MCP config was a placeholder that never got substituted: 401 forever.
