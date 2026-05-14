import MailerLite from '@mailerlite/mailerlite-nodejs';
import pLimit from 'p-limit';
import { CRMPayload, CRMPayloadSchema, CRMUser } from './schema.js';

export interface SyncResult {
  email: string;
  status: 'success' | 'error';
  message?: string;
}

interface MailerLiteClient {
  subscribers: {
    createOrUpdate(input: any): Promise<any>;
  };
}

export class MailerSync {
  private client: MailerLiteClient;
  private limit: ReturnType<typeof pLimit>;

  constructor(apiKey: string, concurrency = 5) {
    // @ts-ignore
    this.client = new MailerLite({ api_key: apiKey });
    this.limit = pLimit(concurrency);
  }

  async sync(payload: CRMPayload): Promise<SyncResult[]> {
    const validated = CRMPayloadSchema.parse(payload);
    
    const tasks = validated.users.map(user => 
      this.limit(() => this.syncUser(user))
    );

    return Promise.all(tasks);
  }

  private async syncUser(user: CRMUser): Promise<SyncResult> {
    try {
      await this.client.subscribers.createOrUpdate({
        email: user.email,
        fields: {
          name: user.full_name, // 强制覆盖
          external_id: user.external_id, // 强制覆盖，确保反查
          tags: user.tags?.join(',') 
        },
        groups: user.group_ids
      });
      return { email: user.email, status: 'success' };
    } catch (error: any) {
      return { 
        email: user.email, 
        status: 'error', 
        message: error.response?.data?.message || error.message 
      };
    }
  }
}
