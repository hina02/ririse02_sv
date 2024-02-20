import { z } from 'zod'

export const NodeSchema = z.object({
  label: z.string(),
  name: z.string(),
  properties: z.record(z.any()).nullable().optional(),
})

export const RelationshipsSchema = z.object({
  type: z.string(),
  start_node: z.string(),
  end_node: z.string(),
  properties: z.record(z.any()).nullable().optional(),
  start_node_label: z.string().nullable().optional(),
  end_node_label: z.string().nullable().optional(),
})

export const TripletsSchema = z.object({
  nodes: z.array(NodeSchema),
  relationships: z.array(RelationshipsSchema),
})

export const MessageSchema = z.object({
  id: z.string(),
  timestamp: z.string().transform((str) => new Date(str)),
  speaker: z.string(),
  message: z.string(),
})

export const TopicSchema = z.object({
  id: z.string(), // primary key
  timestamp: z.string().transform((str) => new Date(str)),
  summary: z.string().default(''),
  participants: z.array(z.string()),
})

export const SceneSchema = z.object({
  id: z.string(), // primary key
  timestamp: z.string().transform((str) => new Date(str)),
  summary: z.string().default(''),
  place: z.string().default(''),
})

export type NodeSchemaType = z.infer<typeof NodeSchema>
export type RelationshipsSchemaType = z.infer<typeof RelationshipsSchema>
export type TripletsSchemaType = z.infer<typeof TripletsSchema>

export type SceneSchemaType = z.infer<typeof SceneSchema>
export type TopicSchemaType = z.infer<typeof TopicSchema>
export type MessageSchemaType = z.infer<typeof MessageSchema>
