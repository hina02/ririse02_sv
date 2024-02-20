<script lang="ts">
  import InputTextForm from '$lib/Utils/InputTextForm.svelte'
  import Modal from 'svelte-simple-modal'
  import ResponseModal from '$lib/Utils/ResponseModal.svelte'
  export let backendUrl: string
  let promise: Promise<any>

  // delete node
  let name = ''
  async function deleteCharacter() {
    let label = 'Person'
    promise = fetch(`${backendUrl}/chat_wb/delete_node/${label}/${name}`, {
      method: 'DELETE',
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

<div class="py-4">
  <h2 class="text-xl font-semibold">Character Delete</h2>
  <div class="flex flex-col relative space-y-2">
    <Modal>
      <div class="grid grid-cols-6">
        <p class="text-xs flex items-center">name1</p>
        <div class="col-span-5">
          <InputTextForm bind:inputText={name} placeholder={'Input Name'} />
        </div>
      </div>
    </Modal>
    <div class="grid grid-cols-6">
      <button type="submit" class="btn-default" on:click={deleteCharacter}>Delete</button>
      <div class="col-start-3 col-span-2">
        <div class="col-start-3 col-span-2">
          {#if promise}
            <ResponseModal {promise} />
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
