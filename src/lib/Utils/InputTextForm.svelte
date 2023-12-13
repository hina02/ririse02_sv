<script lang="ts">
  import { z } from 'zod';
  import ErrorModal from '$lib/Utils/ErrorModal.svelte';
  import { getContext } from 'svelte';
  const { open } = getContext('simple-modal');

  export let inputText = "";
  export let placeholder: string  = "Type here...";
  export let width: string = "";
  const inputTextSchema = z.string()
    .min(1, "Item cannot be empty.")
    .max(64, "Key cannot be longer than 64 characters.")
    .refine(value => !/(https?:\/\/[^\s]+)/g.test(value),"URLs are not allowed");

  // エンターキーが押されたときにバリデートする
  function validateInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const parsed = inputTextSchema.safeParse(inputText);
      if (!parsed.success) {
          open(ErrorModal, { errorMessage: parsed.error.errors[0].message });
          return;
      }
    }
}
</script>

<div>
  <input type="text" bind:value={inputText} placeholder={placeholder}
    class="mt-2 p-2 border rounded {width}"
    on:keydown={validateInput} />
</div>
