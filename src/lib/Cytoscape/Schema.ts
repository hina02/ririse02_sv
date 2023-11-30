import { z } from 'zod';

export const NodeSchema = z.object({
  label: z.string(),
  name: z.string(),
  properties: z.record(z.any()).optional()
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

export type NodeSchemaType = z.infer<typeof NodeSchema>;
export type RelationshipsSchemaType = z.infer<typeof RelationshipsSchema>;
export type TripletsSchemaType = z.infer<typeof TripletsSchema>;