<script lang="ts">
  import { currentScene, Scenes } from '$lib/Chat/Store'
  import { createScene, getScenes } from '$lib/Chat/Settings/History/getChatHistory'
  import { onMount } from 'svelte'

  export let backendUrl: string
  export let selectedScene: string
  let NewScene: string = ''

  // create scene
  async function createNewScene(scene: string) {
    await createScene(backendUrl, scene)
    currentScene.set(scene)
    selectedScene = scene
    NewScene = ''
  }

  // start scene
  async function startScene() {}

  // stop scene
  async function stopScene() {}

  onMount(() => {
    getScenes(backendUrl) // シーンの取得
  })
</script>

<div class="absolute bottom-full w-full mb-2 ml-2 flex items-center h-6">
  <!-- Selected Scene -->
  <div class="justify-self-start ml-2">
    <select
      bind:value={selectedScene}
      on:change={() => currentScene.set(selectedScene)}
      class="text-center overflow-y-scroll"
    >
      <option disabled selected value> -- Sceneを選択してください -- </option>
      <option value="new">新規シーンを追加...</option>
      {#each $Scenes as scene}
        <option value={scene.id} selected={$currentScene === scene.id}>
          {scene.timestamp.toLocaleString()}
        </option>
      {/each}
    </select>
  </div>

  <!-- Start-->
  {#if selectedScene}
    <button on:click={() => startScene()} class="ml-2 border-blue-300">
      <span class="material-icons base_icon text-sm"> play_circle </span>
    </button>

    <!-- Stop -->
    <button on:click={() => stopScene()} class="ml-2 border-blue-300">
      <span class="material-icons base_icon text-sm"> stop_circle </span>
    </button>
  {/if}

  <!-- New Scene -->
  <!-- [TODO] Scene Settingを作成 -->
  {#if selectedScene === 'new'}
    <div class="flex justify-center items-center">
      <input
        bind:value={NewScene}
        type="text"
        placeholder="New Scene..."
        class="w-10/12 border-2 rounded border-blue-300 focus:border-black"
      />
      <button on:click={() => createNewScene(NewScene)} class="ml-2 border-blue-300">
        <span class="material-icons base_icon text-sm"> add </span>
      </button>
    </div>
  {/if}
</div>
