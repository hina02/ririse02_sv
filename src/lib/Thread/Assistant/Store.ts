import { writable } from 'svelte/store';
import type { AssistantSchemaType } from './Schema.ts';

export const Assistants = writable<any[]>([]);  //全てのassistant(name, description, idのみ)
export const activeAssistants = writable<string[]>([]);  //idの集合。
export const AssistantProfiles = writable<{ [assistant_id: string]: AssistantSchemaType }>({}); // アシスタントをidごとに分類して保存
export const showSettings = writable(false);
export const selectedAssistantId = writable<string | null>(null);
