<script lang="ts">
  import { onMount } from 'svelte';
  import { activeThread } from '../Thread/Store.ts';
  import { activeAssistants, AssistantProfiles } from '../Assistant/Store.ts';
  import { systemMessage, errorMessage } from './SystemMessageStore.ts';
  import { createMessage, createRun, createMessageAndRun, updateMessages } from './getMessage.ts';
  import { writable, get } from 'svelte/store';
  export let backendUrl: string;
  let messageText: string = '';
  let selectedAssistantId: string;

  function removeAssistant(assistant_id: string) {
  $activeAssistants = $activeAssistants.filter(id => id !== assistant_id);
  selectedAssistantId = '';
  }
</script>

<div class="h-full w-full rounded-md grid grid-cols-7">
  <!-- メッセージ欄 -->
  <div class="col-span-6">
    <!-- システムメッセージ欄 -->
    <div class="grid grid-cols-3 justify-top">
      <div class="flex space-x-4">
        <p>System: </p>
      </div>
      <div class="col-span-2">
        <p class="text-sm text-gray-500">{$systemMessage}</p>
        <p class="text-sm text-red-500">{$errorMessage}</p>
      </div>
    </div>
    <!-- メッセージ入力欄 -->
    <textarea
      bind:value={messageText}
      class="h-1/2 w-full textarea-default px-3 py-2 text-sm" placeholder="Type your message here"
    ></textarea>
  </div>

  <div class="col-span-1">
    <div class="grid grid-cols-4">
      <!-- assistant icon -->
      <div class="assistant-icons overflow-x-auto pb-2 h-8 col-span-3 flex">
        {#each $activeAssistants as assistant_id (assistant_id)}
          <button
            class="rounded-full object-cover h-6 w-6 border-2 border-blue-900"
            class:border-blue-900={selectedAssistantId !== assistant_id}
            class:border-green-500={selectedAssistantId === assistant_id}
            on:click={() => selectedAssistantId = assistant_id}
          >
            <img
              src={`/assistants/${assistant_id}/icon.png`}
              alt={$AssistantProfiles[assistant_id].name}
              title={$AssistantProfiles[assistant_id].name}
            />
          </button>
        {/each}
      </div>
      <!-- remove icon -->
      <div class="text-gray-400 text-center col-span-1">
        {#if $activeAssistants.length > 0}
        <button class="material-symbols-outlined" title="remove assistant" on:click={() => removeAssistant(selectedAssistantId)}>
          remove
        </button> 
        {/if}
      </div>
    </div>
    <div class="flex flex-col space-y-2 items-center">
      <!-- メッセージ送信・Run実行ボタン -->
      <button on:click={() => createMessageAndRun(backendUrl, messageText, selectedAssistantId)}>
        <span class="btn-default" title="Create Message and Run">Send</span>
      </button>
      <!-- メッセージ送信／Run実行ボタン -->
      <div class="flex justify-center space-x-2">
        <button on:click={() => createMessage(backendUrl, messageText)}>
          <span class="material-symbols-outlined text-gray-400 text-center hover:text-blue-400" title="stack Message">stacks</span>
        </button>
        <button on:click={() => createRun(backendUrl, selectedAssistantId)}>
          <span class="material-icons base_icon text-gray-400 text-center" title="Run">play_arrow</span>
        </button>
      </div>
    </div>
  </div>
</div>