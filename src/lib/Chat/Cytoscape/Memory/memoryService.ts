import { TripletsSchema } from '$lib/Chat/Schema'
import { ShortMemory, RetrievedMemory } from './Store'

// update and store ShortMemory
export async function handleShortMemory(response: { short_memory: string }) {
  const parsedData = JSON.parse(response.short_memory)
  const validatedData = TripletsSchema.parse(parsedData)
  ShortMemory.set(validatedData)
  console.log(validatedData)
}

// update and store RetrievedMemory
export async function handleRetrievedMemory(response: { retrieved_memory: string }) {
  const parsedRetrievedMemory = JSON.parse(response.retrieved_memory)
  const validatedRetrievedMemory = TripletsSchema.parse(parsedRetrievedMemory)
  RetrievedMemory.set(validatedRetrievedMemory)
  console.log(validatedRetrievedMemory)
}
