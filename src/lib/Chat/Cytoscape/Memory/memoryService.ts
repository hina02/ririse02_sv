import { TripletsSchema } from '$lib/Chat/Schema.js';
import { ShortMemory, MessageRetrievedMemory, RetrievedMessages } from './Store.js';

// update and store ShortMemory
export async function handleShortMemory( response: { short_memory: string }) {
    const parsedData = JSON.parse(response.short_memory);
    const validatedData = TripletsSchema.parse(parsedData);
    ShortMemory.set(validatedData);
    console.log(validatedData);
}

// update and store MessageRetrievedMemory
export async function handleMessageRetrievedMemory(response: { message_retrieved_memory: string, messages: string }) {
    const parsedMessages = JSON.parse(response.messages);
    const validatedMessages = TripletsSchema.parse(parsedMessages);
    RetrievedMessages.set(validatedMessages.nodes);
    console.log(validatedMessages);

    const parsedMessageRetrievedMemory = JSON.parse(response.message_retrieved_memory);
    const validatedMessageRetrievedMemory = TripletsSchema.parse(parsedMessageRetrievedMemory);
    MessageRetrievedMemory.set(validatedMessageRetrievedMemory);
    console.log(validatedMessageRetrievedMemory);
}