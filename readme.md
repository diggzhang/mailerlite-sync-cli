# CRM MailerLite Sync 🚀

## Core Features

* **Type Safety**: Strict schema validation powered by [Zod](https://zod.dev/?utm_source=chatgpt.com) ensures that invalid data never enters the email system.
* **High-Performance Concurrency**: Built-in `p-limit` support maximizes synchronization efficiency while protecting API rate limits.
* **Industrial-Grade Logging**: The CLI provides elegant tabular error feedback, allowing precise identification of error paths within JSON data.
* **Seamless Integration**: Automatically synchronizes `external_id` and `tags`, making audience segmentation in MailerLite much easier.

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root and add your API key:

```env
MAILERLITE_API_KEY=your_api_token_here
```

### 3. Build the Project

```bash
npm run build
```

### 4. Run Synchronization

```bash
# Basic usage
node dist/cli.js data.json

# Specify concurrency (default: 5)
node dist/cli.js data.json -c 10

# Explicitly provide API Key
node dist/cli.js data.json -k ml_v1_xxxxxx
```

---

## Data Format Specification (JSON)

The synchronization file must follow the structure below:

```json
{
  "sync_id": "BATCH_001",
  "users": [
    {
      "external_id": "CRM_1001",
      "email": "user@example.com",
      "full_name": "Zhang San",
      "group_ids": ["186094883918841664"],
      "tags": ["VIP", "AI Testing"]
    }
  ]
}
```

### Field Descriptions

| Field         | Type   | Required | Description                                                                                         |
| :------------ | :----- | :------- | :-------------------------------------------------------------------------------------------------- |
| `external_id` | String | Yes      | Unique identifier from the original CRM. Stored in a MailerLite custom field after synchronization. |
| `email`       | String | Yes      | Must conform to a valid email format.                                                               |
| `full_name`   | String | Yes      | User's full name.                                                                                   |
| `group_ids`   | Array  | No       | List of MailerLite Group IDs.                                                                       |
| `tags`        | Array  | No       | Array of tags. After synchronization, they will be merged into a comma-separated string.            |

---

## MailerLite Dashboard Preparation

Before running the script, ensure the following **custom fields (Fields)** have been created in the MailerLite dashboard:

1. **`external_id`**: Set the field type to `Text`.
2. **`tags`**: Set the field type to `Text`.

---

## Troubleshooting

* **Unauthenticated**: Verify that your API key belongs to the “new MailerLite” platform and has not expired.
* **Invalid email address**: Zod intercepted an incorrectly formatted email address. Please correct the JSON according to the `path` shown in the CLI output.
* **DTS Build Error**: If type errors occur during the build process, ensure that the `z.record` implementation in `src/schema.ts` has been properly narrowed to match the current project environment.
