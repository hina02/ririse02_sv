// Schema.ts
import { z } from 'zod';


export const FileSchema = z.object({
	file_id: z.string().optional(),
	filename: z.string(),
	created_at: z.date(),  // Unix timestamp (in seconds)
  });

export type FileSchemaType = z.infer<typeof FileSchema>;