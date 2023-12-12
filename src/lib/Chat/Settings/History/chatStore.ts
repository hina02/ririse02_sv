import { writable } from 'svelte/store';

export const Messages = writable<{ [title: string]: any[] }>({}); // メッセージをタイトルごとに分類して保存