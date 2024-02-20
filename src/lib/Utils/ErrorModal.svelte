<script lang="ts">
  export let errorMessage = 'Error Message'
</script>

<div class="bg-white p-4 rounded-lg w-4/5 max-w-xl">
  {#if errorMessage.includes('\n')}
    {#each errorMessage.split('\n') as line}
      <p class="text-xl font-bold text-red-400 py-2">{line}</p>
    {/each}
  {:else}
    <p class="text-xl font-bold text-red-400">{errorMessage}</p>
  {/if}
</div>
