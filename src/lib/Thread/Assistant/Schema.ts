import { z } from 'zod'

export const AssistantSettingSchema = z.object({
  name: z.string(),
  description: z.string(),
  model: z.union([
    z.literal('gpt-4-1106-preview'),
    z.literal('gpt-3.5-turbo-1106'),
    z.literal('gpt-3.5-turbo-16k'),
  ]),
  instructions: z.string(),
  retrieval: z.boolean(),
  code_interpreter: z.boolean(),
  function: z.string(),
  tags: z.array(z.string()),
  file_ids: z.array(z.string()),
})

export const AssistantSchema = z.object({
  id: z.string(),
  // object: z.string(),
  created_at: z.date(),
  name: z.string(),
  description: z.string(),
  model: z.union([
    z.literal('gpt-4-1106-preview'),
    z.literal('gpt-3.5-turbo-1106'),
    z.literal('gpt-3.5-turbo-16k'),
  ]),
  instructions: z.string(),
  tools: z.array(z.unknown()),
  file_ids: z.array(z.string()),
  tags: z.array(z.string()).optional(),
})

export type AssistantSchemaType = z.infer<typeof AssistantSchema>
export type AssistantSettingSchemaType = z.infer<typeof AssistantSettingSchema>
