<script lang="ts">
    import Ririse from "$lib/Ririse.svelte";
    import Chatwb from '$lib/Chat/Chat.svelte';
    import History from '$lib/Chat/History/History.svelte';

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    let pageTitle = "home";

</script>

<Ririse />
<History {backendUrl}/>

<Chatwb {backendUrl}/>
