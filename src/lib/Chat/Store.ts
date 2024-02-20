import { writable } from 'svelte/store'
import { SceneSchema, TopicSchema, MessageSchema } from './Schema'
import { z } from 'zod'
import type { ZodTypeAny } from 'zod'

type InferSchema<T extends ZodTypeAny> = z.infer<T> // schemaをgenericsで受け取り、その型定義を返す

export const Scenes = writable<InferSchema<typeof SceneSchema>[]>([])
export const Topics = writable<{ [sceneId: string]: InferSchema<typeof TopicSchema>[] }>({})
export const Messages = writable<{ [topicId: string]: InferSchema<typeof MessageSchema>[] }>({})

export const activeScene = writable<string | null>(null)
export const activeTopic = writable<string | null>(null)
export const user = writable<string>('彩澄しゅお')
export const AI = writable<string>('彩澄りりせ')
export const withVoice = writable<boolean>(true)
