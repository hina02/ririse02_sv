<script lang="ts">
  import { onMount } from 'svelte'
  import { ThreadSchema } from './Schema'
  import { Threads, Tags, activeThread, showSettings } from './Store'
  import { getThreads } from './getThread'
  export let backendUrl: string

  let selectedThread: typeof ThreadSchema
  function selectThread(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value
    const selectedThread = $Threads.find((thread) => thread.name === selectedName)
    activeThread.set(selectedThread)
  }

  let selectedTag: string
  let filteredThreads: (typeof ThreadSchema)[] = []
  function filterByTag(event: Event) {
    const selectedTagName = (event.target as HTMLSelectElement).value
    filteredThreads = $Threads.filter((thread) => thread.tags?.includes(selectedTagName))
  }

  function toggleSettings() {
    $showSettings = !$showSettings
  }

  onMount(() => {
    getThreads(backendUrl)
  })
</script>

<div class="mb-8 py-2 h-16 bg-white dark:bg-blue-800">
  <div class="grid grid-cols-10 justify-between items-center space-y-4">
    <!-- Settings -->
    <button
      class="col-span-1 hidden md:block material-icons base_icon items-center w-2 h-2 mr-1 text-gray-400"
      on:click={toggleSettings}
    >
      settings
    </button>
    <!-- Display Thread -->
    <div class="col-span-5 text-center">
      <h2 class="text-2xl font-bold text-blue-900 dark:text-blue-100">
        {$activeThread ? $activeThread.name : 'Thread'}
      </h2>
      <p class="text-blue-500 dark:text-blue-400 overflow-hidden line-clamp-2">
        {$activeThread ? $activeThread.description : 'description'}
      </p>
    </div>
    <!-- Select Thread -->
    <div class="col-span-4 flex justify-center space-x-2">
      <!-- Filter Tag -->
      <select
        bind:value={selectedTag}
        on:change={filterByTag}
        class="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-28 overflow-x-hidden"
      >
        <option disabled selected value> -- Tag -- </option>
        {#each $Tags as tag}
          <option value={tag}>{tag}</option>
        {/each}
      </select>
      <!-- Select Thread -->
      <select
        bind:value={selectedThread}
        on:change={selectThread}
        class="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-28 overflow-x-hidden"
      >
        <option disabled selected value> -- Thread -- </option>
        {#if selectedTag}
          {#each filteredThreads as thread}
            <option
              value={thread.name}
              selected={$activeThread && $activeThread.name === thread.name}>{thread.name}</option
            >
          {/each}
        {:else}
          {#each $Threads as thread}
            <option
              value={thread.name}
              selected={$activeThread && $activeThread.name === thread.name}>{thread.name}</option
            >
          {/each}
        {/if}
      </select>
    </div>
  </div>
</div>
