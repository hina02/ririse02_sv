<script lang="ts">
  import { activeScene, Topics } from '$lib/Chat/Store'
  import type { SceneSchemaType } from '$lib/Chat/Schema'
  import { getTopics } from './getChatHistory'
  import Topic from './Topic.svelte'

  export let scene: SceneSchemaType
  export let backendUrl: string

  async function getSceneTopics() {
    activeScene.set(scene.id)
    await getTopics(backendUrl, scene.id)
  }
</script>

<details on:toggle={getSceneTopics} class="max-h-80 overflow-y-auto p-1">
  <summary class="overflow-x-hidden">{scene.timestamp.toLocaleString()}</summary>
  <p class="text-xs">{scene.summary}</p>
  {#if $activeScene === scene.id && $Topics[scene.id]}
    {#each $Topics[scene.id] as topic}
      <Topic {topic} {backendUrl} />
    {/each}
  {:else}
    <p>Loading topics...</p>
  {/if}
</details>
