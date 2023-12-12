import { writable } from 'svelte/store';

export const Titles = writable<string[]>([]);
export const activeTitle = writable<string | null>(null);