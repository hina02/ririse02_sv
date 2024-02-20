import { z } from 'zod'

export const NodeSchema = z.object({
  label: z.string(),
  name: z.string(),
  properties: z.record(z.any()).nullable().optional(),
})
