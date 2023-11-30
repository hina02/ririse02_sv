import { writable } from 'svelte/store';
import { z } from 'zod';
import { NodeSchema, RelationshipsSchema, TripletsSchema } from '../Schema.js';

export const Triplets = writable(z.array(TripletsSchema).parse([]));
export const Nodes = writable(z.array(NodeSchema).parse([]));
export const Relationships = writable(z.array(RelationshipsSchema).parse([]));