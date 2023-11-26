<script lang="ts">
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
    import { Files } from './Store.js';
    import { getFiles, uploadFiles, deleteFile } from './getFile.js';
    export let backendUrl: string;
    let selectedFileId: string | null = null;
    let files = {
        accepted: [] as File[],
        rejected: [] as File[]
    };
    function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
    }
    function resetFiles() {
    files.accepted = [];
    files.rejected = [];
    }

</script>
  
<div class="bg-blue-100 dark:bg-blue-800 px-4 pb-4 rounded-b-md shadow-md">
<div class="relative p-4 bg-white shadow rounded">
    <details class="w-full">
        <summary class="text-blue-900 dark:text-blue-100">File Settings</summary>


        <button on:click={resetFiles} class="absolute top-0 right-0 p-3">
            <span class="material-symbols-outlined text-gray-400 text-md hover:text-blue-400" title="reset files">restart_alt</span>
        </button>

        <!-- Selected File ID -->
        <div class="p-2 text-blue-900 text-xs">Selected File ID: 
            {#if selectedFileId}<p class="text-black">{selectedFileId}</p>{/if}
        </div>
    
        <!-- File List -->
        <details class="w-full" on:toggle={() => getFiles(backendUrl)}>
            <summary class="cursor-pointer text-blue-900 dark:text-blue-100">File List</summary>
            {#if $Files}
            <table class="w-full text-xs overflow-y-scroll">
                <thead class="border-b-2 border-blue-200">
                    <tr>
                        <th>file_id</th>
                        <th>file_name</th>
                        <th>date</th>
                    </tr>
                </thead>
                <tbody class="w-full break-all text-[0.5rem]">
                    {#each $Files as file}
                    <tr class="border-b-2 border-blue-200">
                        <td class="pr-1" on:click={() => selectedFileId = file.file_id }>{file.file_id}</td>
                        <td>{file.filename}</td>
                        <td>{file.created_at.toLocaleDateString()}</td>
                    </tr>
                    {/each}
                </tbody>
            </table>
            {/if}
        </details>

        <!-- File Uploader -->
        <div class="p-2 pl-4 text-blue-900">File Uploader
            <Dropzone on:drop={handleFilesSelect}/>
            <ol>
            {#each files.accepted as item}
                <li>{item.name}</li>
            {/each}
            </ol>
        </div>

        <!-- Button -->
        <div class="mt-4 space-x-2 relative">

            <button class="btn-default" title="Upload Files" on:click={() => { uploadFiles(backendUrl, files.accepted); resetFiles(); } }>Upload Files</button>
        {#if selectedFileId}
            <button class="btn-default absolute right-0" title="{selectedFileId}" on:click={() => { if (selectedFileId) { deleteFile(backendUrl, selectedFileId); selectedFileId = null; } }}>Delete</button>
        {/if}
        </div>
    </details>
    
</div>
</div>
