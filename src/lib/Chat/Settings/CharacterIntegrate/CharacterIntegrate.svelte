<script lang="ts">
  import Deltete from './CharacterDelete.svelte'
  import InputTextForm from '$lib/Utils/InputTextForm.svelte'
  import Modal from 'svelte-simple-modal'
  import ResponseModal from '$lib/Utils/ResponseModal.svelte'
  import { NodeSchema } from './Schema'
  export let backendUrl: string
  let promise: Promise<any>
  let showDeleteMenu = false

  // integrate nodes
  let name1 = ''
  let name2 = ''
  async function integrateCharacter() {
    let node1 = NodeSchema.parse({ label: 'Person', name: name1, properties: null })
    let node2 = NodeSchema.parse({ label: 'Person', name: name2, properties: null })

    let body = JSON.stringify({ node1: node1, node2: node2 })
    console.log(body)
    promise = fetch(`${backendUrl}/chat_wb/integrate_nodes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ node1: node1, node2: node2 }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      // display response
      return response.json().then((data) => {
        if (data.status === false) {
          throw new Error(data.message)
        }
        return data.message
      })
    })
  }
</script>

<div class="w-80 p-4">
  <h2 class="text-xl font-semibold">Character Integrate</h2>
  <div class="py-4 overflow-y-auto relative h-72">
    <!-- Input form -->
    <Modal>
      <div class="grid grid-cols-6">
        <p class="text-xs flex items-center">name1</p>
        <div class="col-span-5">
          <InputTextForm bind:inputText={name1} placeholder={'Input Name1'} />
        </div>
      </div>
      <div class="grid grid-cols-6">
        <p class="text-xs flex items-center">name2</p>
        <div class="col-span-5">
          <InputTextForm bind:inputText={name2} placeholder={'Input Name2'} />
        </div>
      </div>
    </Modal>
    <!-- delete format -->
    {#if showDeleteMenu}
      <Deltete {backendUrl} />
    {/if}
  </div>
  <div class="grid grid-cols-6">
    <button type="submit" class="btn-default" on:click={integrateCharacter}>Integrate</button>
    <div class="col-start-3 col-span-2">
      {#if promise}
        <ResponseModal {promise} />
      {/if}
    </div>
    <button on:click={() => (showDeleteMenu = !showDeleteMenu)} class="col-start-6">
      <span class="material-symbols-outlined base_icon"> delete </span>
    </button>
  </div>
</div>
