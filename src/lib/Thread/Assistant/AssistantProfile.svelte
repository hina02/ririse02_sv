<script lang="ts">
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import { AssistantSchema } from './Schema'
  import {
    Assistants,
    activeAssistants,
    AssistantProfiles,
    showSettings,
    selectedAssistantId,
  } from './Store'
  import { getAssistants, getAssistant } from './getAssistant'
  export let backendUrl: string
  let dropdownOpen = false
  let selectedAssistant: any = { assistant_id: '', name: 'Assistant', description: 'description' }

  async function selectAssistant(assistant_id: string) {
    const assistantProfile = await getAssistant(backendUrl, assistant_id)
    // 選択したアシスタントの情報を表示
    selectedAssistant = assistantProfile
    $activeAssistants = $activeAssistants.includes(assistant_id)
      ? $activeAssistants
      : [...$activeAssistants, assistant_id]
    $selectedAssistantId = assistant_id
    dropdownOpen = false
    // 取得したアシスタントの情報をストアに保存
    AssistantProfiles.update((value) => ({ ...value, [assistant_id]: assistantProfile }))
    console.log($AssistantProfiles[assistant_id])
    console.log($AssistantProfiles[assistant_id].name)
  }

  // 設定画面を表示
  function toggleSettings() {
    $showSettings = !$showSettings
  }

  onMount(() => {
    getAssistants(backendUrl)
  })
</script>

<aside class="bg-white dark:bg-blue-800 rounded-md my-4 py-2 h-16">
  <!-- ヘッダー -->
  <div class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 justify-between items-center">
    <!-- Settings -->
    <button
      class="col-span-1 hidden md:block material-icons base_icon items-center w-2 h-2 mr-1 text-gray-400"
      on:click={toggleSettings}
    >
      settings
    </button>
    <!-- アシスタントのアイコン -->
    {#if $selectedAssistantId}
      <img
        src={`/assistants/${$selectedAssistantId}/icon.png`}
        alt="Assistant"
        class="col-span-2 rounded-full object-cover h-12 w-12 border-2 border-blue-900"
      />
    {:else}
      <div class="col-span-2 rounded-full object-cover h-12 w-12 border-2 border-blue-900"></div>
    {/if}
    <!-- アシスタントの名前と説明 -->
    <div class="col-span-5 col-end-9 hidden lg:block text-center">
      <h2 class="text-2xl font-bold text-blue-900 dark:text-blue-100">
        {selectedAssistant ? selectedAssistant.name : 'Assistant'}
      </h2>
      <p class="text-blue-500 dark:text-blue-400 overflow-hidden line-clamp-2">
        {selectedAssistant ? selectedAssistant.description : 'description'}
      </p>
    </div>
    <!-- アシスタントのドロップダウンリスト -->
    <div
      class="col-span-4 col-end-auto relative z-50"
      on:click={() => (dropdownOpen = !dropdownOpen)}
      on:keydown={(e) => {
        if (e.key === 'Enter') dropdownOpen = !dropdownOpen
      }}
      role="button"
      tabindex="0"
    >
      <button
        type="button"
        role="combobox"
        aria-controls="radix-:rcq:"
        aria-expanded={dropdownOpen ? 'true' : 'false'}
        aria-autocomplete="none"
        class="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-36"
      >
        {selectedAssistant ? selectedAssistant.name : ''}
      </button>
      {#if dropdownOpen}
        <div class="absolute w-full bg-white pt-2">
          {#each $Assistants as assistant (assistant.assistant_id)}
            <button
              type="button"
              class="grid grid-cols-7 p-2 cursor-pointer rounded border-b-4 border-white hover:border-blue-100 w-full"
              on:click={() => selectAssistant(assistant.assistant_id)}
            >
              <div class="col-span-2 object-contain pt-2">
                <img
                  src="/assistants/{assistant.assistant_id}/icon.png"
                  alt={assistant.name}
                  class="rounded-full object-cover h-8 w-8 border-2 border-blue-900"
                />
              </div>
              <div class="col-span-5 flex flex-col">
                <span>{assistant.name}</span>
                <span class="text-xs overflow-hidden line-clamp-1">{assistant.description}</span>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</aside>
<!-- アシスタントの詳細設定表示 -->
<details
  open
  class="bg-blue-100 dark:bg-blue-800 p-4 shadow-md static {$showSettings
    ? 'rounded-t-md'
    : 'rounded-md'}"
>
  <summary class="cursor-pointer text-blue-900 dark:text-blue-100">Settings</summary>
  {#if $selectedAssistantId}
    <div class="grid grid-cols-12 gap-2 pt-2">
      {#each Object.keys(AssistantSchema.shape) as key}
        <div class="col-span-3 text-clip break-all text-blue-500 dark:text-blue-400 font-bold">
          {key}
        </div>
        <div class="col-span-9 text-clip break-all">{selectedAssistant[key]}</div>
      {/each}
    </div>
  {/if}
</details>
