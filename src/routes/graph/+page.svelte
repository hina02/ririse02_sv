<script lang="ts">
    import Cytoscape from '$lib/Cytoscape/Cytoscape.svelte';

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    let pageTitle = "graph";

    import { onMount } from 'svelte';
    import { getAllNodes, getAllEdges, getTriplets } from '$lib/Cytoscape/gettriplets.ts';

    // sample text for cytoscpe
    const text = "Tom is an engineer";
    onMount(async () => {
        await getAllNodes(backendUrl);
        await getAllEdges(backendUrl);
    });

</script>
<Cytoscape {backendUrl} />
```
