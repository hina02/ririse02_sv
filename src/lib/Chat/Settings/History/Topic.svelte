<script lang="ts">
  import { Messages } from '$lib/Chat/Store'
  import type { TopicSchemaType } from '$lib/Chat/Schema'
  import { getMessages } from './getChatHistory'
  import Message from './Message.svelte'

  export let topic: TopicSchemaType
  export let backendUrl: string

  async function getTopicMessages() {
    await getMessages(backendUrl, topic.id)
  }
</script>

<details on:toggle={getTopicMessages} class="max-h-80 overflow-y-auto p-1">
  <summary class="overflow-x-hidden">{topic.timestamp.toLocaleString()}</summary>
  <p class="text-xs">{topic.participants.join(', ')}</p>
  <p class="text-xs">{topic.summary}</p>
  {#if $Messages[topic.id]}
    <table class="text-xs">
      <thead>
        <tr>
          <th>Time</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody class="text-xs">
        {#each $Messages[topic.id] as message}
          <Message {message} />
        {/each}
      </tbody>
    </table>
  {:else}
    <p>Loading messages...</p>
  {/if}
</details>
