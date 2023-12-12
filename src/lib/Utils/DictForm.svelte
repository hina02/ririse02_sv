<script lang="ts">
  import { z } from 'zod';
  import ErrorModal from '$lib/Utils/ErrorModal.svelte';
  import { getContext } from 'svelte';
  const { open } = getContext('simple-modal');

  export let dict: {[key: string]: string} = {};
  let newKey = "";
  let newValue = "";

  const keySchema = z.string()
    .min(1, "Key cannot be empty.")
    .max(32, "Key cannot be longer than 32 characters.")
    .refine(value => !/(https?:\/\/[^\s]+)/g.test(value),"URLs are not allowed");
  const valueSchema = z.string()
    .min(1, "Value cannot be empty.")
    .max(256, "Value cannot be longer than 256 characters.")
    .refine(value => !/(https?:\/\/[^\s]+)/g.test(value),"URLs are not allowed");

  function addDictItem() {
    const errorMessages = [];
    const keyParsed = keySchema.safeParse(newKey);
    const valueParsed = valueSchema.safeParse(newValue);

    if (!keyParsed.success) {errorMessages.push(keyParsed.error.errors[0].message);}
    if (!valueParsed.success) {errorMessages.push(valueParsed.error.errors[0].message);}
    if (dict.hasOwnProperty(newKey)) {errorMessages.push("Key already exists.");}

    if (errorMessages.length > 0) {
      open(ErrorModal, { errorMessage: errorMessages.join("\n ") });
    } else {
      dict[newKey] = newValue;
      newKey = "";
      newValue = "";
    }
  }

  function removeDictItem(key: string) {
      delete dict[key];
      dict = { ...dict };
  }
</script>

<div>
  <input type="text" bind:value={newKey} placeholder="Key" class="mt-2 p-2 border rounded" />
  <input type="text" bind:value={newValue} placeholder="Value" class="mt-2 p-2 border rounded" />
  <button on:click={addDictItem} class="btn-default">Add</button>

  <div class="flex flex-col mt-2 space-y-0.5">
    {#each Object.entries(dict) as [key, value]}
      <div class="flex items-center">
        <span class="p-2 border rounded-lg bg-blue-200 text-blue-900">{key}: {value}</span>
        <button on:click={() => removeDictItem(key)} class="ml-2">
            <span class="material-symbols-outlined text-gray-400 text-sm items-end hover:text-blue-400" title="remove Item">close</span>
        </button>
      </div>
    {/each}
  </div>
</div>

