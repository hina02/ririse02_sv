import { get } from 'svelte/store';
import { TripletsSchema } from '../Schema.js';
import type { NodeSchemaType, RelationshipsSchemaType, TripletsSchemaType } from '../Schema.js';
import { ShortMemory, ActivatedMemory } from './Store.js';
import { ParseStatus } from 'zod';

// get ActivatedMemory without chat
export async function getMemory(backendUrl: string, text: string) {
    let triplets: TripletsSchemaType[] = await fetch(`${backendUrl}/chat_wb/get_memory_from_triplet?text=${encodeURIComponent(text)}`).then(r => r.json());
    ActivatedMemory.set(triplets);
    // # ActivatedMemoryを表示
    console.log(`ActivatedMemory: ${JSON.stringify(get(ActivatedMemory), null, 2)}`)
}


// update and store ShortMemory
export async function handleShortMemory( response: { short_memory: string }) {
    const parsedData = JSON.parse(response.short_memory);
    const validatedData = TripletsSchema.parse(parsedData);
    ShortMemory.set(validatedData);
    console.log(validatedData);
}


// update and store ActivatedMemory
export async function handleActivatedMemory(response: { activated_memory: string }) {
    const parsedData = JSON.parse(response.activated_memory);
    const validatedData = TripletsSchema.parse(parsedData);
    ActivatedMemory.set(validatedData);
    console.log(validatedData);
}