<script lang="ts">
  import InputTextForm from '$lib/Utils/InputTextForm.svelte'
  import ListForm from '$lib/Utils/ListForm.svelte'
  import DictForm from '$lib/Utils/DictForm.svelte'
  import Modal from 'svelte-simple-modal'
  import ResponseModal from '$lib/Utils/ResponseModal.svelte'
  import { NodeSchema } from './Schema'
  export let backendUrl: string
  let promise: Promise<any>
  let name: string = ''
  let name_variation: string[] = []
  let speech_pattern: string[] = []
  let properties = {}

  async function updateCharacter() {
    // request
    const listproperties: { [key: string]: string[] } = {}
    for (const [key, value] of Object.entries(properties)) {
      listproperties[key] = [value as string] // 文字列をリストに変換して格納
    }

    let new_properties = {
      ...listproperties,
      ...(name_variation.length > 0 ? { name_variation: name_variation } : {}),
      ...(speech_pattern.length > 0 ? { speech_pattern: speech_pattern } : {}),
    }

    let NodeData = NodeSchema.parse({ label: 'Person', name: name, properties: new_properties })
    console.log(new_properties)
    promise = fetch(`${backendUrl}/chat/create_update_node`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(NodeData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // reset
      name = ''
      name_variation = []
      speech_pattern = []
      properties = {}

      // display response
      return response.json().then((data) => {
        try {
          const validatedData = NodeSchema.parse(data)
          return validatedData
        } catch (error) {
          // check message
          try {
            if (data.status === false) {
              throw new Error(data.message)
            }
            return data.message
          } catch (error) {
            throw new Error(`${error}`)
          }
        }
      })
    })
  }
</script>

<div class="w-80 p-4">
  <h2 class="text-xl font-semibold">Character Setting</h2>
  <div class="py-4 overflow-y-auto relative h-72">
    <Modal>
      <div class="grid grid-cols-6">
        <p class="text-xs flex items-center">name</p>
        <div class="col-span-5">
          <InputTextForm bind:inputText={name} placeholder={'Input Name'} />
        </div>
      </div>
      <div class="grid grid-cols-6">
        <p class="text-xs col-span-1 flex items-center">name variation</p>
        <div class="col-span-5">
          <ListForm bind:list={name_variation} />
        </div>
      </div>
      <div class="grid grid-cols-6">
        <p class="text-xs flex items-center">speech pattern</p>
        <div class="col-span-5">
          <ListForm bind:list={speech_pattern} />
        </div>
      </div>
      <div class="grid grid-cols-6">
        <p class="text-xs flex items-center">properties</p>
        <div class="col-span-5">
          <DictForm bind:dict={properties} />
        </div>
      </div>
    </Modal>
  </div>
  <div class="grid grid-cols-6">
    <button type="submit" class="btn-default" on:click={updateCharacter}>Submit</button>
    <div class="col-start-3 col-span-2">
      {#if promise}
        <ResponseModal {promise} />
      {/if}
    </div>
  </div>
</div>
