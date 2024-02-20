import { writable } from 'svelte/store'
import type { MessageSchemaType } from './Schema'

export const Messages = writable<{ [thread_id: string]: MessageSchemaType[] }>({}) // スキーマを使用してメッセージをタイトルごとに分類して保存
