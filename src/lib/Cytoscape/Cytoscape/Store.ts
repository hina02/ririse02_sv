import { writable } from 'svelte/store';
import { z } from 'zod';
import { NodeSchema, RelationshipsSchema, TripletsSchema } from '../Schema.js';

export const ActivatedMemory = writable(z.array(TripletsSchema).parse([]));
export const ShortMemory = writable(z.array(TripletsSchema).parse([]));