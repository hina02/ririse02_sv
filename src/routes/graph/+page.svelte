<script lang="ts">
    import Cytoscape from '$lib/Cytoscape/Cytoscape/Cytoscape.svelte';
    import CyMessage from '$lib/Cytoscape/Message/CytoscapeMessage.svelte';

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    let pageTitle = "graph";

    import { onMount } from 'svelte';
    import { getAllNodes, getAllEdges } from '$lib/Cytoscape/Cytoscape/getTriplets';
    import { getMessageNodes, getMessageEdges } from '$lib/Cytoscape/Message/getMessage';

    // sample text for cytoscpe
    const text = "Tom is an engineer";
    onMount(async () => {
        await getAllNodes(backendUrl);
        await getAllEdges(backendUrl);
        await getMessageNodes(backendUrl);
        await getMessageEdges(backendUrl);
    });

</script>
<Cytoscape {backendUrl} />
<CyMessage {backendUrl} />

```
