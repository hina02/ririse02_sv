import { z } from 'zod';

export const NodeSchema = z.object({
  label: z.string(),
  name: z.string(),
  properties: z.record(z.any()).nullable().optional()
});

export const RelationshipsSchema = z.object({
  type: z.string(),
  start_node: z.string(),
  end_node: z.string(),
  properties: z.record(z.any()).nullable().optional(),
  start_node_label: z.string().nullable().optional(),
  end_node_label: z.string().nullable().optional()
});

export const TripletsSchema = z.object({
  nodes: z.array(NodeSchema),
  relationships: z.array(RelationshipsSchema)
});

export const MessageSchema = z.object({
	id: z.number(),
	source: z.string(),
  user_input: z.string(),
  AI: z.string().nullable().optional(),
  ai_response: z.string(),
  user_input_entity: z.array(TripletsSchema),
  create_time: z.string().transform((str) => new Date(str))
});

export type NodeSchemaType = z.infer<typeof NodeSchema>;
export type RelationshipsSchemaType = z.infer<typeof RelationshipsSchema>;
export type TripletsSchemaType = z.infer<typeof TripletsSchema>;
export type MessageSchemaType = z.infer<typeof MessageSchema>;
