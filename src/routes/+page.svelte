<script lang="ts">
    // Chat
    import Ririse from "$lib/Ririse.svelte";
    import Chatwb from '$lib/Chat/Chat.svelte';
    import Settings from '$lib/Chat/Settings/Setting.svelte';

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    let pageTitle = "home";

    // Cytoscape
    import Cytoscape from '$lib/Cytoscape/Cytoscape/Cytoscape.svelte';
    import CyMessage from '$lib/Cytoscape/Message/CytoscapeMessage.svelte';

</script>
<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<Ririse />
<Settings {backendUrl}/>
<Chatwb {backendUrl}/>

<div class="absolute top-16 left-16 flex justify-between space-x-8 lg:space-x-10 -z-20">    
    <CyMessage {backendUrl} />
    <Cytoscape {backendUrl} />
</div>
