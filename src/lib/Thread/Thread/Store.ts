import { writable } from 'svelte/store'
import { z } from 'zod'
import { ThreadSchema } from './Schema'

export const Threads = writable(z.array(ThreadSchema).parse([]))
export const Tags = writable(z.array(z.string()).parse([]))
export const activeThread = writable(ThreadSchema.nullable().parse(null))
export const showSettings = writable(false)
