# dreamine2api

Dreamina（[dreamina.capcut.com](https://dreamina.capcut.com/)）图像/视频 OpenAI 兼容网关。**Nuxt 3** 全栈：同一进程提供 `/v1/*` API 与 Web 管理面板。

## 配置（config.toml）

项目根目录 `config.toml` 为关键配置源。管理面板「配置」页保存会**写回该文件**，并同步 SQLite 中的全局代理、额度代理、`pool.api_key`。

```toml
[server]
host = "0.0.0.0"
port = 5200

[proxy]
global_proxy_url = ""
credit_refresh_proxy_url = ""

[pool]
api_key = ""

[admin]
api_key = ""
enabled = true

[database]
path = "data/dreamine2api.db"
```

管理登录和 `/api/admin/*` 仅使用 `admin.api_key`。

## SQLite

- **账号**：`pool_accounts`（号池 session、代理、额度缓存）
- **调用**：`api_calls`（路径、耗时、状态、错误等）
- **运行时键值**：`app_settings`（与 config.toml 中代理/号池密钥同步）

环境变量 `DREAMINE_DB_PATH` 仍可用；默认与 `[database].path` 一致。

## 管理面板

| 页面 | 说明 |
|------|------|
| `/admin` | 概览与近 24h 调用统计 |
| `/admin/settings` | 编辑并保存 `config.toml` |
| `/admin/accounts` | 号池账号 CRUD、刷新额度 |
| `/admin/calls` | API 调用记录 |

REST：`/api/admin/*`（Bearer 管理密钥）

## OpenAI 兼容 API

由 Nitro 路由提供：

- `GET /v1/models`
- `POST /v1/images/generations`、`/edits`
- `POST /v1/videos/generations`，`GET /v1/videos/{request_id}`
- `Authorization: Bearer <pool.api_key>`

外部 OpenAI 兼容接口仅接受 `pool.api_key`。直接传入 Dreamina `sessionid` 的旧兼容方式已移除；请在管理面板导入账号，由号池自动选择可用 session。

旧版 HTTP 管理接口 `GET/POST /pool/*` 仍可用（需 `pool.api_key`）。

## 运行

```bash
npm install
# 在 config.toml 中设置 admin.api_key
npm run dev
```

生产：

```bash
npm run build
npm start
```

默认 `http://localhost:5200`。

## 旧版 Koa 入口（可选）

```bash
npm run legacy:build && npm run legacy:start
```

使用 `configs/dev/*.yml`，不含 Nuxt 管理面板与 `config.toml` 同步。

## 模型列表

见 `server/services/pool/model-catalog.ts`；抓取脚本：`npm run scrape:models` 等。
