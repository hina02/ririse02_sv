import { get } from 'svelte/store' // 追加: ストアの現在の値を取得するため
import { Scenes, Topics, Messages } from '$lib/Chat/Store'
import { SceneSchema, TopicSchema, MessageSchema } from '$lib/Chat/Schema'

// Scene
// create
// 古いtopicに続けることはない。ActiveTopicが無ければ、新しいtopicを作成する。
export async function createScene(backendUrl: string, place: string) {
  if (['new'].includes(place)) {
    alert('予約語は使用できません。')
    return
  }
  const response = await fetch(`${backendUrl}/chat/create_scene`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ place: place }),
  })
  if (response.ok) {
    updateScenes(backendUrl)
    return
  }
}

// get
export async function getScenes(backendUrl: string) {
  const currentScenes = get(Scenes)

  // If no Scenes in store, get list[Scenes] from backend.
  if (currentScenes.length === 0) {
    updateScenes(backendUrl)
  }
}

export async function updateScenes(backendUrl: string) {
  const scenes = await fetch(`${backendUrl}/chat/get_scenes`).then((r) => r.json())
  // parse
  const validatedScenes = scenes.map((scene: any) => SceneSchema.parse(scene))
  Scenes.set(validatedScenes)
}

// Topic
export async function getTopics(backendUrl: string, scene_id: string) {
  const currentTopics = get(Topics)

  // About the Scene, if no Topics in store, get list[Topics] from backend.
  if (!currentTopics[scene_id]) {
    updateTopics(backendUrl, scene_id)
  }
}

export async function updateTopics(backendUrl: string, scene_id: string) {
  const topics = await fetch(`${backendUrl}/chat/get_topics/${scene_id}`).then((r) => r.json())

  // parse
  const validatedTopics = topics.map((topic: any) => TopicSchema.parse(topic))
  Topics.update((allTopics) => {
    allTopics[scene_id] = validatedTopics
    return allTopics
  })
}

// Message
export async function getMessages(backendUrl: string, topic_id: string) {
  const currentMessages = get(Messages)

  // About the Topic, if no Messages in store, get list[Messages] from backend.
  if (!currentMessages[topic_id]) {
    const messages = await fetch(`${backendUrl}/chat/get_messages/${topic_id}`).then((r) =>
      r.json()
    )

    // parse
    const validatedMessages = messages.map((message: any) => {
      message.user_input_entity = message.user_input_entity ? [message.user_input_entity] : []
      return MessageSchema.parse(message)
    })
    Messages.update((allMessages) => {
      allMessages[topic_id] = validatedMessages
      return allMessages
    })
    console.log('getMessages', get(Messages))
  }
}
