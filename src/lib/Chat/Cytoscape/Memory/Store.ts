import { writable } from 'svelte/store';
import { z } from 'zod';
import { TripletsSchema } from '$lib/Chat/Schema.js';

export const ActivatedMemory = writable(z.array(TripletsSchema).parse([]));
export const ShortMemory = writable(z.array(TripletsSchema).parse([]));