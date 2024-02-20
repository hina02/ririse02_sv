import { z } from 'zod'
import { get } from 'svelte/store' // 追加: ストアの現在の値を取得するため
import { activeThread } from '$lib/Thread/Thread/Store'
import { Messages } from './MessageStore'
import { systemMessage, errorMessage } from './SystemMessageStore'
import { MessageSchema } from './Schema'

//レスポンスのエラーハンドリングを扱う共通関数
async function handleResponse(response: Response, success_message: string, error_message: string) {
  if (response.ok) {
    systemMessage.set(success_message)
    errorMessage.set('')
  } else {
    systemMessage.set('')
    errorMessage.set(error_message)
  }
}

function ThreadIDErrorMessage() {
  systemMessage.set('')
  errorMessage.set('スレッドが選択されていません。')
}

function AssistantIDErrorMessage() {
  systemMessage.set('')
  errorMessage.set('アシスタントが選択されていません。')
}

//ストアに保存されているメッセージを取得
export async function getMessages(backendUrl: string) {
  const thread_id = get(activeThread).thread_id // ストアからthread_idを取得
  const currentMessages = get(Messages) // 現在のMessagesの値を取得
  // ストアにMessagesがない場合、バックエンドからthread_idに関連するMessagesを取得
  if (!currentMessages[thread_id]) {
    const messages = await updateMessages(backendUrl)
    return messages
  } else {
    return currentMessages[thread_id]
  }
}

//get /get_messages/{thread_id}
export async function updateMessages(backendUrl: string) {
  const thread_id = get(activeThread).thread_id // ストアからthread_idを取得
  const messages = await fetch(`${backendUrl}/openai_api/get_messages/${thread_id}`).then((r) =>
    r.json()
  )
  // Convert UNIX timestamp to Date object
  messages.forEach((message: any) => {
    message.created_at = new Date(message.created_at * 1000)
  })
  // Validate the response data with Zod
  const validatedMessages = z.array(MessageSchema).parse(messages)
  Messages.update((allMessages) => {
    allMessages[thread_id] = validatedMessages
    return allMessages
  })
  console.log(validatedMessages)
  return validatedMessages
}

//post /create_message/{thread_id}?content={content}
export async function createMessage(backendUrl: string, content: string) {
  const activeThreadValue = get(activeThread)
  if (activeThreadValue === null) {
    ThreadIDErrorMessage
    return
  }
  const selectedThread = activeThreadValue.thread_id // 現在のthread_idを取得
  const response = await fetch(
    `${backendUrl}/openai_api/create_message/${selectedThread}?content=${encodeURIComponent(
      content
    )}`,
    {
      method: 'POST',
    }
  )
  await handleResponse(response, 'メッセージの作成が正常に実行されました', 'エラーが発生しました')
}

//post /create_run/{thread_id}/{assistant_id}
export async function createRun(backendUrl: string, assistant_id: string) {
  if (assistant_id === undefined) {
    AssistantIDErrorMessage
    return
  }
  const activeThreadValue = get(activeThread)
  if (activeThreadValue === null) {
    ThreadIDErrorMessage
    return
  }
  const selectedThread = activeThreadValue.thread_id

  const response = await fetch(`${backendUrl}/create_run/${selectedThread}/${assistant_id}`, {
    method: 'POST',
  })
  await handleResponse(response, 'Runが正常に実行されました', 'エラーが発生しました')
}

//post /create_run/{thread_id}/{assistant_id}?content={content}
export async function createMessageAndRun(
  backendUrl: string,
  content: string,
  assistant_id: string
) {
  if (assistant_id === undefined) {
    AssistantIDErrorMessage
    return
  }
  const activeThreadValue = get(activeThread)
  if (activeThreadValue === null) {
    ThreadIDErrorMessage
    return
  }
  const selectedThread = activeThreadValue.thread_id
  const response = await fetch(
    `${backendUrl}/openai_api/create_message_and_run/${selectedThread}/${assistant_id}?content=${encodeURIComponent(
      content
    )}`,
    {
      method: 'POST',
    }
  )
  await handleResponse(
    response,
    'メッセージの作成、Runが正常に実行されました',
    'エラーが発生しました'
  )
}

//get /cycle_retrieve_run/{thread_id}
export async function cycleRetrieveRun(backendUrl: string) {
  const activeThreadValue = get(activeThread)
  if (activeThreadValue === null) {
    ThreadIDErrorMessage
    return
  }
  const selectedThread = activeThreadValue.thread_id
  const response = await fetch(`${backendUrl}/openai_api/cycle_retrieve_run/${selectedThread}`)
  if (response.ok) {
    const responseData = await response.json()
    systemMessage.set(responseData)
  } else {
    systemMessage.set('')
    errorMessage.set('エラーが発生しました')
  }
}
