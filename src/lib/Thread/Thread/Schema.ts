// Schema.ts
import { z } from 'zod'

export const ThreadSchema = z.object({
  thread_id: z.string(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()).nullable(),
  created_at: z.date(), // Unix timestamp (in seconds)
})

export const ThreadSettingSchema = z.object({
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()).nullable(),
})

export type ThreadSchemaType = z.infer<typeof ThreadSchema>
export type ThreadSettingSchemaType = z.infer<typeof ThreadSettingSchema>
