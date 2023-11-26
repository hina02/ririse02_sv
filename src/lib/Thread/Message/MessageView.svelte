<script lang="ts">
  import { activeThread } from '../Thread/Store.ts';
  import { getMessages, updateMessages } from './getMessage.ts';
  import { writable } from 'svelte/store';
  export let backendUrl: string;

  let activeMessages: any[] = [];
  activeMessages = activeMessages.map(message => ({ ...message, showDetails: false }));

  // ローディング状態を追跡し、getMessage中にスピナーを表示する
  let isLoading = writable(false);
  // activeThreadが変更されたときに、activeMessagesを更新する
  activeThread.subscribe(async (thread) => {
    if (thread && !$isLoading) {
      isLoading.set(true);
      activeMessages = await getMessages(backendUrl);
      activeMessages = activeMessages.map(message => ({ ...message, showDetails: false }));
      isLoading.set(false);
    }
  });

</script>
<div class="relative md:space-y-4 bg-blue-100 h-full w-full rounded-md overflow-y-auto">
  {#if $isLoading}
    <div>Loading...</div>
  
  {:else if activeMessages.length > 0}
  
  {#each activeMessages as message (message.id)}
    <div class="grid md:grid-cols-10 grid-cols-1 pl-4 pt-2">
      <div class="col-span-1">
        {#if message.assistant_id}
          <img
            src={`/assistants/${message.assistant_id}/icon.png`}
            alt="Assistant"
            class="rounded-full object-cover h-12 w-12 border-2 border-blue-900 bg-white"
            on:error={(e) => { e.target.style.display = 'none'; }}
          />
        {:else}
          <div class="h-12 w-12 flex items-center justify-center">
            <span>user</span>
          </div>
          <!-- <img
          src={`../public/users/user_id/icon.png`}
          alt="User"
          class="rounded-full object-cover h-12 w-12 border-2 border-blue-900 bg-white"
         /> -->
        {/if}
      </div>
      <div class="md:col-span-8 col-span-1 pr-2 text-ellipsis overflow-hidden">{message.content}</div>
      <div class="col-span-1 overflow-hidden hidden md:block">
        <button on:click={() => message.showDetails = !message.showDetails} class="px-4 py-2">
          {#if message.showDetails} 						
          <span class="material-icons base_icon text-gray-400 text-center">menu_book</span>
          {/if}
          {#if !message.showDetails}
          <span class="material-icons base_icon text-gray-400 text-center">book</span>
          {/if}
        </button>
        {#if message.showDetails}
        <div class="absolute right-16 z-10 bg-blue-50 p-4 rounded-md shadow-md">
          <div>created_at: {message.created_at}</div>
          <div>annotations: {message.annotations}</div>
          <div>file_ids: {message.file_ids}</div>
          <div>metadata: {message.metadata}</div>
        </div>
        {/if}
      </div>
    </div>
  {/each}
  {/if}
  {#if $activeThread}
    <div class="sticky bottom-2 right-4 z-10 flex justify-end">
      <button class="sticky bottom-2 right-4 z-10 material-icons base_icon text-gray-400" title="Update Message" on:click={updateMessages(backendUrl)}>refresh</button>
    </div>
  {/if}
</div>