import { writable } from 'svelte/store';
import { z } from 'zod';
import { TripletsSchema, NodeSchema } from '$lib/Chat/Schema.js';

export const MessageRetrievedMemory = writable(z.array(TripletsSchema).parse([]));
export const RetrievedMessages = writable(z.array(NodeSchema).parse([]));
export const ShortMemory = writable(z.array(TripletsSchema).parse([]));