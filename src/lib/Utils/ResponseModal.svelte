<script lang="ts">
    import { Modal, bind } from 'svelte-simple-modal';
    import PopupModal from '$lib/Utils/PopupModal.svelte';
    import { writable } from 'svelte/store';
    export let promise: Promise<any>;
    const modal = writable(null);
    const showModal = (value: any) => modal.set(bind(PopupModal, { value: value }));
    
</script>
  
<Modal show={$modal}>
    {#await promise then value}
        <button on:click={() => showModal(value)} class="btn-showresponse">Show Response</button>
    {:catch error}
        <button on:click={() => showModal(error.message)} class="btn-showerror">Error</button>
    {/await}
</Modal>