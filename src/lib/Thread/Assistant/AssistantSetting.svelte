<script lang="ts">
  import { z } from 'zod';
  import { AssistantSettingSchema } from './Schema.ts';
  import { showSettings, selectedAssistantId } from './Store.ts';
  import { createAssistant, updateAssistant, deleteAssistant } from './getAssistant.ts';
  export let backendUrl: string;
  export let assistantSettings: any = {};

  // tagsの更新をassistantSettingsに反映
  let newTag = '';
  let tags: string[] = [];
  $: assistantSettings['tags'] = tags;

  // assistant_idを使用するかどうかを切り替える
  let SettingId: boolean = false;
  function toggleSettingId() {
    SettingId = !SettingId;
  }

  // 設定画面を閉じる
  function closeSettings() {
  $showSettings = false;
}
</script>

{#if $showSettings}
<div class="bg-blue-100 dark:bg-blue-800 px-4 pb-4 rounded-b-md shadow-md">
  <div class="p-4 bg-white shadow rounded">
    <h2 class="text-blue-900 dark:text-blue-100">Assistant Data</h2>
    <!-- Display Input form -->
    <div class="flex flex-col">
      <button class="text-blue-500 dark:text-blue-400 text-left" on:click={toggleSettingId}>
        Assistant ID: 
        {#if SettingId}{#if $selectedAssistantId}{$selectedAssistantId}{/if}
        {/if}
      </button>
      <!-- Input form for Assistant -->
      {#each Object.keys(AssistantSettingSchema.shape) as key}
        <!-- Input Boolean for Assistant -->
        {#if AssistantSettingSchema.shape[key] instanceof z.ZodBoolean}
          <label class="inline-flex items-center mt-2">
            <input type="checkbox" bind:checked={assistantSettings[key]} class="form-checkbox h-5 w-5 text-blue-600"/>
            <span class="ml-2 text-gray-700 dark:text-gray-400">{key}</span>
          </label>
        <!-- Select Model for Assistant -->
        {:else if AssistantSettingSchema.shape[key] instanceof z.ZodUnion}
          <select class="py-2" bind:value={assistantSettings[key]}>
            {#each AssistantSettingSchema.shape[key]._def.options as option}
              <option>{option.value}</option>
            {/each}
          </select>
        <!-- Input tags for Assistant -->
        {:else if key === 'tags'}
          <div class="grid grid-cols-6 gap-2">
            <div class="col-span-5">
              <input type="text" bind:value={newTag} placeholder={key} class="mt-2 p-2 border rounded"/>
              <div class="flex flex-wrap">
                {#each tags as tag}
                  <span class="bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 rounded-full px-2 py-1 m-1">{tag}</span>
                {/each}
              </div>
            </div>  
            <div class="col-span-1 flex flex-col py-2">
              <button on:click={() => { if (newTag.trim() !== '' && !tags.includes(newTag)) tags = [...tags, newTag]; }}>
                <span class="material-symbols-outlined text-gray-400 text-md text-center hover:text-blue-400" title="stack Message">add</span>
              </button>
              <button on:click={() => { tags = tags.slice(0, -1); }}><span class="material-symbols-outlined text-gray-400 text-md text-center hover:text-blue-400" title="stack Message">remove</span></button>
            </div>
          </div>
        <!-- Input text for Assistant -->
        {:else}
          <input type="text" bind:value={assistantSettings[key]} placeholder={key} class="mt-2 p-2 border rounded"/>
        {/if}
      {/each}
      
      </div>
    <!-- Button -->
    <div class="mt-4 space-x-2 relative">
      {#if SettingId}
        <button class="btn-default" title="{$selectedAssistantId}" on:click={() => $selectedAssistantId&& updateAssistant(backendUrl, $selectedAssistantId, assistantSettings)}>Update</button>
      {:else}
        <button class="btn-default" title="New Assistant" on:click={() => createAssistant(backendUrl, assistantSettings)}>Create</button>
      {/if}
      <button class="btn-default" title="Close Settings" on:click={closeSettings}>Close</button>
      {#if SettingId}
        <button class="btn-default absolute right-0" title="{$selectedAssistantId}" on:click={() => $selectedAssistantId&& deleteAssistant(backendUrl, $selectedAssistantId)}>Delete</button>
      {/if}
    </div>
      
  </div>
</div>
{/if}
