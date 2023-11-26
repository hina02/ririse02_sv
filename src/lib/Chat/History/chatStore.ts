// chatStore.ts
import { writable } from 'svelte/store';

export const Titles = writable<string[]>([]);
export const activeTitle = writable<string | null>(null);
export const Messages = writable<{ [title: string]: any[] }>({}); // メッセージをタイトルごとに分類して保存