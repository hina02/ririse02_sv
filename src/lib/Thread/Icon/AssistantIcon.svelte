<script lang="ts">
  import Dropzone from 'svelte-file-dropzone'
  import { showSettings, selectedAssistantId } from '$lib/Thread/Assistant/Store'
  export let backendUrl: string

  let selectedFileId: string | null = null
  let files = {
    accepted: [] as File[],
    rejected: [] as File[],
  }
  function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail
    resetFiles()
    if (acceptedFiles.length > 0) {
      files.accepted = [acceptedFiles[0]]
    }
    if (fileRejections.length > 0) {
      files.rejected = [fileRejections[0]]
    }
  }
  function resetFiles() {
    files.accepted = []
    files.rejected = []
  }
</script>

<div class="bg-blue-100 dark:bg-blue-800 px-4 pb-4 rounded-b-md shadow-md">
  <div class="relative p-4 bg-white shadow rounded">
    <details class="w-full">
      <summary class="text-blue-900 dark:text-blue-100">Assistant Icon</summary>

      <button on:click={resetFiles} class="absolute top-0 right-0 p-3">
        <span
          class="material-symbols-outlined text-gray-400 text-md hover:text-blue-400"
          title="reset files">restart_alt</span
        >
      </button>

      <!-- Selected Assistant ID -->
      <div class="p-2 text-blue-900 text-xs">
        Selected Assistant ID:
        {#if $selectedAssistantId}<p class="text-black">{$selectedAssistantId}</p>{/if}
      </div>

      <!-- {`/assistants/${assistant_id}/icon.png`} -->

      <!-- Image Uploader -->
      <div class="p-2 pl-4 text-blue-900">
        Image Uploader
        <Dropzone
          on:drop={handleFilesSelect}
          maxSize={1000000}
          accept={'image/jpeg,image/png,image/jpg'}
        />
        <ol>
          {#each files.accepted as item}
            <li>{item.name}</li>
          {/each}
        </ol>
      </div>

      <!-- Button -->
      <div class="mt-4 space-x-2 relative">
        <button
          class="btn-default"
          title="Upload New Image"
          on:click={() => {
            uploadIcon(files.accepted[0])
            resetFiles()
          }}>Upload New Image</button
        >
      </div>
    </details>
  </div>
</div>
