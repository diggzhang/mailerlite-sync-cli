import { z } from 'zod';

type JsonValue = string | number | boolean | null;

const JsonValueSchema: z.ZodType<JsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null()
]);

export const CRMUserSchema = z.object({
  external_id: z.string(),
  email: z.string().email(),
  full_name: z.string().min(1),
  group_ids: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const CRMPayloadSchema = z.object({
  sync_id: z.string(),
  users: z.array(CRMUserSchema)
});

export type CRMUser = z.infer<typeof CRMUserSchema>;
export type CRMPayload = z.infer<typeof CRMPayloadSchema>;
