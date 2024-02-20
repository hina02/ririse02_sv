<script lang="ts">
  import { z } from 'zod'
  import { ThreadSchema, ThreadSettingSchema } from './Schema'
  import { showSettings, activeThread } from './Store'
  import { createThread, deleteThread } from './getThread'
  export let backendUrl: string
  export let threadSettings: any = {}
  let newTag = ''
  let tags: string[] = []
  $: threadSettings['tags'] = tags

  function closeSettings() {
    $showSettings = false
  }
</script>

<div class="fixed z-20">
  {#if $showSettings}
    <!-- show activeThread -->
    <details class="bg-blue-100 dark:bg-blue-800 p-4 shadow-md rounded-t-md z-20">
      <summary class="cursor-pointer text-blue-900 dark:text-blue-100">Settings</summary>
      {#if $activeThread}
        <div class="grid grid-cols-12 gap-2 pt-2">
          {#each Object.keys(ThreadSchema.shape) as key}
            <div
              class="col-span-3 text-ellipsis overflow-hidden text-blue-500 dark:text-blue-400 font-bold"
            >
              {key}
            </div>
            <div class="col-span-9 text-ellipsis overflow-hidden">{$activeThread[key]}</div>
          {/each}
        </div>
      {/if}
    </details>
    <!-- createThread Settings -->
    <div class="bg-blue-100 dark:bg-blue-800 px-4 pb-4 rounded-b-md shadow-md z-20">
      <div class="p-4 bg-white shadow rounded">
        <h2 class="text-blue-900 dark:text-blue-100">Thread Data</h2>

        <div class="flex flex-col">
          {#each Object.keys(ThreadSettingSchema.shape) as key}
            {#if key === 'tags'}
              <div class="grid grid-cols-6 gap-2">
                <div class="col-span-5">
                  <input
                    type="text"
                    bind:value={newTag}
                    placeholder={key}
                    class="mt-2 p-2 border rounded"
                  />
                  <div class="flex flex-wrap">
                    {#each tags as tag}
                      <span
                        class="bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 rounded-full px-2 py-1 m-1"
                        >{tag}</span
                      >
                    {/each}
                  </div>
                </div>
                <div class="col-span-1 flex flex-col py-2">
                  <button
                    on:click={() => {
                      if (newTag.trim() !== '' && !tags.includes(newTag)) tags = [...tags, newTag]
                    }}
                  >
                    <span
                      class="material-symbols-outlined text-gray-400 text-md text-center hover:text-blue-400"
                      title="stack Message">add</span
                    >
                  </button>
                  <button
                    on:click={() => {
                      tags = tags.slice(0, -1)
                    }}
                    ><span
                      class="material-symbols-outlined text-gray-400 text-md text-center hover:text-blue-400"
                      title="stack Message">remove</span
                    ></button
                  >
                </div>
              </div>
            {:else}
              <input
                type="text"
                bind:value={threadSettings[key]}
                placeholder={key}
                class="mt-2 p-2 border rounded"
              />
            {/if}
          {/each}
        </div>
        <div class="mt-4 space-x-2 relative">
          <button
            class="btn-default"
            on:click={() => {
              createThread(backendUrl, threadSettings)
            }}>Create</button
          >
          <button class="btn-default" on:click={closeSettings}>Close</button>

          {#if $activeThread}
            <button
              class="btn-default absolute right-0"
              title={$activeThread.thread_id}
              on:click={() => {
                if ($activeThread) deleteThread(backendUrl, $activeThread.thread_id)
              }}>Delete</button
            >
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
