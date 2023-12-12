<script lang="ts">
  import { z } from 'zod';
  import ErrorModal from '$lib/Utils/ErrorModal.svelte';
  import { getContext } from 'svelte';
  const { open } = getContext('simple-modal');

  export let list: string[] = [];
  let newItem = "";
  const itemSchema = z.string()
    .min(1, "Item cannot be empty.")
    .max(64, "Key cannot be longer than 64 characters.")
    .refine(value => !/(https?:\/\/[^\s]+)/g.test(value),"URLs are not allowed");
  
  // エンターキーが押されたときにアイテムを追加する
  function addListItem(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        const parsed = itemSchema.safeParse(newItem);
        if (!parsed.success) {
            open(ErrorModal, { errorMessage: parsed.error.errors[0].message });
            return;
        }
          if (newItem.trim() !== '' && !list.includes(newItem)) {
              list = [...list, newItem];
              newItem = "";
          };
      }
  }

  function removeListItem(index: number) {
    list = list.filter((_, i) => i !== index);
  }
</script>

<div>
  <input type="text" bind:value={newItem} placeholder="List item"
    class="mt-2 p-2 border rounded"
    on:keydown={addListItem} />
  <div class="flex flex-wrap">
    {#each list as item, index}
      <span class="bg-blue-200 text-blue-900 rounded-full px-2 py-1 m-1">
        {item}
        <button on:click={() => removeListItem(index)} class="ml-1">
            <span class="material-symbols-outlined text-gray-400 text-sm items-end hover:text-blue-400" title="remove Item">close</span>
        </button>
      </span>
    {/each}
  </div>
</div>


  