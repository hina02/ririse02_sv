import { get } from 'svelte/store' // 追加: ストアの現在の値を取得するため
import { AssistantSchema } from './Schema'
import type { AssistantSchemaType, AssistantSettingSchemaType } from './Schema'
import { Assistants, activeAssistants, AssistantProfiles } from './Store'

// Function to get the list of assistants
export async function getAssistants(backendUrl: string) {
  const currentAssistants = get(Assistants) // 現在のassistant_idのリストを取得

  // ストアにAssistantsがない場合、バックエンドからassistant_idのリストを取得
  if (currentAssistants.length === 0) {
    await updateAssistants(backendUrl)
  }
}

// Function to update the list of assistants
export async function updateAssistants(backendUrl: string) {
  let assistants: AssistantSchemaType[] = await fetch(
    `${backendUrl}/openai_api/get_assistants`
  ).then((r) => r.json())
  console.log(`assistants: ${JSON.stringify(assistants, null, 2)}`)
  Assistants.set(assistants)
}

// Function to get detailed information about a specific assistant
export async function getAssistant(backendUrl: string, assistant_id: string): Promise<any> {
  const currentAssistantProfiles = get(AssistantProfiles) // 現在のAssistantProfilesの値を取得
  const currentAssistantProfile = currentAssistantProfiles
    ? currentAssistantProfiles[assistant_id]
    : undefined

  // ストアにAssistantProfilesがない場合、バックエンドから指定Assistantに関連するAssistantProfilesを取得
  if (!currentAssistantProfile) {
    const assistant = await fetch(`${backendUrl}/openai_api/get_assistant/${assistant_id}`).then(
      (r) => r.json()
    )

    // Convert UNIX timestamp to Date object
    assistant.created_at = new Date(assistant.created_at * 1000)
    // Validate the response data with Zod
    const validatedAssistant = AssistantSchema.parse(assistant)

    AssistantProfiles.update((allAssistantProfiles) => {
      allAssistantProfiles[assistant_id] = assistant
      return allAssistantProfiles
    })
    return validatedAssistant // 更新されたアシスタントのプロフィールを返す
  } else {
    return currentAssistantProfile // 既に存在するアシスタントのプロフィールを返す
  }
}

// Function to create a new assistant or update an existing one
// 新しいアシスタントを作成する関数
export async function createAssistant(
  backendUrl: string,
  data: AssistantSettingSchemaType
): Promise<any> {
  console.log(`data: ${JSON.stringify(data, null, 2)}`)
  const response = await fetch(`${backendUrl}/openai_api/create_assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  updateAssistants(backendUrl) // update assistant list
  return response.json()
}

// 既存のアシスタントを更新する関数
export async function updateAssistant(
  backendUrl: string,
  assistant_id: string,
  data: AssistantSettingSchemaType
): Promise<any> {
  console.log(`data: ${JSON.stringify(data, null, 2)}`)
  const response = await fetch(`${backendUrl}/openai_api/update_assistant/${assistant_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }
  updateAssistants(backendUrl) // update assistant list
  return response.json()
}

// Function to delete an assistant
export async function deleteAssistant(backendUrl: string, assistant_id: string): Promise<any> {
  const response = await fetch(`${backendUrl}/openai_api/delete_assistant/${assistant_id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Network response was not ok.')
  }
  updateAssistants(backendUrl) // update assistant list
  return response.json()
}
