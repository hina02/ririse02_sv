<script lang="ts">
  import Cytoscape from '$lib/Chat/Cytoscape/Cytoscape.svelte'
  import InputTextForm from '$lib/Utils/InputTextForm.svelte'
  import Modal from 'svelte-simple-modal'
  import type { NodeSchemaType } from '$lib/Chat/Schema'
  import { setCharacter } from '$lib/Chat/Store'
  export let backendUrl: string
  let showEdges = false
  // fetch node
  let name = ''
  let selectedName: string
  let node: NodeSchemaType
  async function fetchNode() {
    const label = 'Person'
    selectedName = name
    node = await fetch(`${backendUrl}/chat/get_node/${label}/${name}`).then((r) => r.json())
  }

  async function handleEdges(event: CustomEvent) {
    showEdges = event.detail
  }

  function addCharacter(name: string) {
    setCharacter.update((currentList) => {
      // 既にリストに含まれている場合は追加しない
      if (name !== '' && !currentList.includes(name)) {
        return [...currentList, name]
      }
      return currentList
    })
  }

  function removeAI(index: number) {
    setCharacter.update((currentList) => {
      return currentList.filter((_, i) => i !== index)
    })
  }
</script>

<div class="w-80 p-4">
  <h2 class="text-xl font-semibold">Character Select</h2>
  <!-- Input form -->
  <div class="grid grid-cols-6">
    <p class="text-xs flex items-center">name</p>
    <div class="col-span-4">
      <Modal>
        <InputTextForm bind:inputText={name} placeholder={'Input Name'} width={'w-40'} />
      </Modal>
    </div>
    <!-- Button -->
    <button type="submit" class="btn-default" on:click={fetchNode}>Fetch</button>
  </div>
  <!-- Display response -->
  <div class="py-4 overflow-y-auto relative h-60">
    <!-- cytoscaoeを表示 -->
    <div class={showEdges ? '' : 'hidden'}>
      <Cytoscape {backendUrl} name={selectedName} on:edges={handleEdges} />
    </div>
    <!-- nodeを表示 -->
    {#if node}
      <div class="grid grid-cols-6 gap-2">
        <p class="text-xs col-span-1 flex items-center">name:</p>
        <p class="text-xs col-span-5 flex items-center">{node.name}</p>
        {#each Object.entries(node.properties) as [key, value]}
          <p class="break-all text-xs col-span-1 flex items-center">{key}:</p>
          <p class="whitespace text-xs col-span-5 flex items-center">{value}</p>
        {/each}
      </div>
    {/if}
  </div>

  <!-- display current player, listner -->
  <div class="grid grid-cols-3">
    <div class="col-span-2 space-y-1 py-2">
      <p class="text-xs font-bold">Character:</p>
      {#each $setCharacter as character, index}
        <div class="flex items-center space-x-2">
          <p class="text-xs">{character}</p>
          <button on:click={() => removeAI(index)}>
            <span
              class="material-symbols-outlined text-gray-400 text-sm items-end hover:text-blue-400"
              title="remove Item">remove</span
            >
          </button>
        </div>
      {/each}
    </div>
    <!-- Current Select player, listner -->
    <div class="space-y-1 py-2">
      <p class="text-xs font-bold">Set</p>
      <button class="btn-default" on:click={() => addCharacter(name)}>Character</button>
    </div>
  </div>
</div>
