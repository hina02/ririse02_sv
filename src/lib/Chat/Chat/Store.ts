import { writable } from 'svelte/store'

export const Titles = writable<string[]>([])
export const activeTitle = writable<string | null>(null)
export const user = writable<string>('彩澄しゅお')
export const AI = writable<string>('彩澄りりせ')
export const withVoice = writable<boolean>(true)
