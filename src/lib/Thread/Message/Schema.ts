// Schema.ts
import { z } from 'zod'

export const MessageSchema = z.object({
  id: z.string(),
  role: z.string(),
  assistant_id: z.string().nullable(),
  content: z.string(),
  created_at: z.date(),
  annotations: z.array(z.unknown()).nullable(),
  file_ids: z.array(z.string()).nullable(),
  metadata: z.record(z.any()).nullable(),
})

export type MessageSchemaType = z.infer<typeof MessageSchema>
