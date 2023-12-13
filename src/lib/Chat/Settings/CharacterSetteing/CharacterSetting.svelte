<script lang="ts">
  import ListForm from '$lib/Utils/ListForm.svelte';
  import DictForm from '$lib/Utils/DictForm.svelte';
  import Modal, { bind } from 'svelte-simple-modal';
  import { NodeSchema } from './Schema';
  export let backendUrl: string;
  let promise: Promise<any>;
  let name: string = "";
  let name_variation: string[] = [];
  let speech_pattern: string[] = [];
  let properties = {};
  let new_properties = {};

  import PopupModal from '$lib/Utils/PopupModal.svelte';
  import { writable } from 'svelte/store';
  const modal = writable(null);
  const showModal = (value: any) => modal.set(bind(PopupModal, { value: value }));

  async function updateCharacter() {
    // request
    new_properties = { ...properties, "name_variation": name_variation, "speech_pattern": speech_pattern };
    let NodeData = NodeSchema.parse({label: "Person", name: name, properties: new_properties});
    promise = fetch(`${backendUrl}/chat_wb/create_update_node`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(NodeData),
    }).then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    // reset
    name = "";
    name_variation = [];
    speech_pattern = [];
    properties = {};

    // display response
    return response.json().then(data => {
      try {
        const validatedData = NodeSchema.parse(data);
        return validatedData;
      } catch (error) {
        throw new Error(`Validation error: ${error}`);
      }
    });
    });
  }
</script>

<div class="w-96 h-96 p-4">
  <h2 class="text-xl font-semibold">Character Settings</h2>
  <div class="py-4 overflow-y-auto relative h-72">
      <div class="grid grid-cols-6">
        <p class="text-xs flex items-center">name</p>
        <div class="col-span-5">
          <input type="text" bind:value={name} class="mt-2 p-2 border rounded" placeholder="Input Name"/>
        </div>
      </div>
    <Modal>
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
          {#await promise then value}
          <Modal show={$modal}>
            <button on:click={() => showModal(value)} class="btn-showresponse">Show Response</button>
          </Modal>
            {:catch error}
            <p>Error: {error.message}</p>
          {/await}
        {/if}
    </div>  
  </div>
</div>
