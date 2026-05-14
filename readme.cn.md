# CRM MailerLite Sync 🚀


## 核心特性

* **类型安全**: 基于 [Zod](https://zod.dev/) 的严格 Schema 校验，确保非法数据绝不进入邮件系统。
* **高性能并发**: 内置 `p-limit` 机制，在保护 API 额度的同时最大化同步效率。
* **工业级日志**: CLI 提供漂亮的表格化错误反馈，精准定位 JSON 数据中的错误路径。
* **无损集成**: 自动同步 `external_id` 及 `tags`，方便在 MailerLite 中进行人群细分（Segmentation）。

---

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 环境配置
在根目录创建 `.env` 文件并填入你的 API Key：
```env
MAILERLITE_API_KEY=your_api_token_here
```

### 3. 构建项目
```bash
npm run build
```

### 4. 运行同步
```bash
# 基本用法
node dist/cli.js data.json

# 指定并发数 (默认 5)
node dist/cli.js data.json -c 10

# 显式传入 API Key
node dist/cli.js data.json -k ml_v1_xxxxxx
```

---

## 数据格式规范 (JSON)

同步文件必须符合以下结构：

```json
{
  "sync_id": "BATCH_001",
  "users": [
    {
      "external_id": "CRM_1001",
      "email": "user@example.com",
      "full_name": "张三",
      "group_ids": ["186094883918841664"],
      "tags": ["VIP", "AI测试"]
    }
  ]
}
```

### 字段说明
| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `external_id` | String | 是 | 原始 CRM 中的唯一标识，同步后存入 MailerLite 自定义字段。 |
| `email` | String | 是 | 必须符合标准的邮箱格式。 |
| `full_name` | String | 是 | 用户姓名。 |
| `group_ids` | Array | 否 | MailerLite 的 Group ID 列表。 |
| `tags` | Array | 否 | 标签数组，同步后会合并为逗号分隔的字符串。 |

---

## MailerLite 后台准备

在运行脚本前，请确保 MailerLite 后台已创建以下 **自定义字段 (Fields)**：

1.  **`external_id`**: 类型选择 `Text`。
2.  **`tags`**: 类型选择 `Text`。

---

## 常见问题 (Troubleshooting)

* **Unauthenticated**: 检查 API Key 是否属于“新版 MailerLite”，并确认是否过期。
* **Invalid email address**: Zod 拦截了格式错误的邮箱，请根据 CLI 提示的 `path` 修正 JSON。
* **DTS Build Error**: 若构建时报类型错误，请确保 `src/schema.ts` 中 `z.record` 的写法已根据当前工程环境完成类型收窄。
