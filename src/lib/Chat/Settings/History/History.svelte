<!-- Historyとして、Scene listを表示。デフォルトは今のScene。expandで、Sceneに紐づくMessageを表示。 -->
<script lang="ts">
  import { Scenes, activeScene } from '$lib/Chat/Store'
  import { getMessages } from './getChatHistory'
  import Scene from './Scene.svelte'

  export let backendUrl: string

  // activeSceneが変わったときにgetMessagesをトリガー
  $: if ($activeScene) {
    getMessages(backendUrl, $activeScene) // backendUrlも適切に提供する必要があります。
  }
</script>

<!-- iconをクリックして表示するhistory欄 -->
<div class="w-80 h-full p-4">
  <h1 class="text-xl font-semibold text-gray-800">Chat History</h1>
  <div class="my-2">
    {#each $Scenes as scene}
      <Scene {scene} {backendUrl} />
    {/each}
  </div>
</div>
