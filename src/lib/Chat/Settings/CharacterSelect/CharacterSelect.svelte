<script lang="ts">
  import Cytoscape from '$lib/Chat/Cytoscape/Cytoscape.svelte'
  import InputTextForm from '$lib/Utils/InputTextForm.svelte'
  import Modal from 'svelte-simple-modal'
  import ResponseModal from '$lib/Utils/ResponseModal.svelte'
  import type { NodeSchemaType } from '$lib/Chat/Schema'
  import { user, AI } from '$lib/Chat/Store'
  export let backendUrl: string
  let promise: Promise<any>
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

  <!-- display curren user ai -->
  <div class="grid grid-cols-6">
    <div class="col-span-2 space-y-2 flex flex-col justify-end py-2">
      <p class="text-xs col-span-1 flex items-center font-bold">User:</p>
      <p class="text-xs col-span-2 flex items-center">{$user}</p>
    </div>
    <div class="col-span-2 space-y-2 flex flex-col justify-end py-2">
      <p class="text-xs col-span-1 flex items-center font-bold">AI:</p>
      <p class="text-xs col-span-2 flex items-center">{$AI}</p>
    </div>
    <!-- Current Select User, AI-->
    <div class="col-span-2 flex-col space-y-1">
      <p class="text-xs flex items-center font-bold">Set</p>
      <div class="flex space-x-2">
        <button class="btn-default" on:click={() => user.set(name)}>User</button>
        <button class="btn-default" on:click={() => AI.set(name)}>AI</button>
      </div>
    </div>
  </div>
</div>
