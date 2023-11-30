import { writable } from 'svelte/store';
import { z } from 'zod';
import { NodeSchema, RelationshipsSchema } from '../Schema.ts';

export const MessageNodes = writable(z.array(NodeSchema).parse([]));
export const MessageRelationships = writable(z.array(RelationshipsSchema).parse([]));