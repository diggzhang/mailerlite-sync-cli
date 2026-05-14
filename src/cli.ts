import { Command } from 'commander';
import { MailerSync } from './engine.js';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

const program = new Command();

program
  .name('mailer-sync')
  .version('1.1.0')
  .argument('<file>', 'CRM JSON 导出文件')
  .option('-k, --key <string>', 'API Key', process.env.MAILERLITE_API_KEY)
  .option('-c, --concurrency <number>', '并发限制', '5')
  .action(async (file, options) => {
    const apiKey = options.key;
    if (!apiKey) {
      console.error('❌ 错误: 必须提供 API Key (-k 或环境变量)');
      process.exit(1);
    }

    const concurrency = Number.parseInt(options.concurrency, 10);
    if (Number.isNaN(concurrency) || concurrency <= 0) {
      console.error('❌ 错误: 并发数必须是大于 0 的正整数');
      process.exit(1);
    }

    try {
      const filePath = path.resolve(file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      const engine = new MailerSync(apiKey, concurrency);
      
      console.log(`🚀 任务启动 | 并发: ${concurrency} | 总数: ${data.users?.length || 0}`);
      
      const results = await engine.sync(data);
      const errors = results.filter(r => r.status === 'error');

      console.log(`\n✅ 成功: ${results.length - errors.length} | ❌ 失败: ${errors.length}`);

      if (errors.length > 0) {
        console.table(errors.map(e => ({ Email: e.email, Error: e.message })));
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        console.error('\n❌ 数据格式错误:');
        console.table(err.issues.map((e: z.ZodIssue) => ({
          path: e.path.join('.'),
          message: e.message
        })));
      } else {
        console.error('\n💥 运行时崩溃:', err.message);
      }
      process.exit(1);
    }
  });

program.parse();
