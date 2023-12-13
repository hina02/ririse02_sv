<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount, onDestroy } from 'svelte';
  import { initializeBasicCytoscape, drawNodesAndEdges } from './cytoscape';
  import type { RelationshipsSchemaType } from '$lib/Chat/Schema';
  import type { Core } from 'cytoscape';
  let cy: Core;
  let container: HTMLElement;
  let unsubscribeAll: () => void;

  export let backendUrl: string;
  export let name: string;
  let edges: RelationshipsSchemaType[];
  let previousName: string;
  const dispatch = createEventDispatcher();

// fetch Edges (character node and relationship(without message))
  async function fetchEdges() {
    const label = "Person";

    edges = await fetch(`${backendUrl}/chat_wb/get_node_relationships/${label}/${name}`).then(r => r.json());
    if (edges && edges.length > 0) {
      drawNodesAndEdges([], edges, cy, "circle");  // or "grid", "random"
      dispatch('edges', true);
    }
    else {
      cy = initializeBasicCytoscape(container);
      dispatch('edges', false);
    }
  }

  // 最初にcytoscapeを初期化
  onMount(async () => {
    cy = initializeBasicCytoscape(container);
  });

  // 異なるnameが渡されると、ノードとエッジの描画を更新
  $: if (name !== previousName) {
  previousName = name;
  (async () => {
    await fetchEdges();
  })();
}

  $: if (edges && edges.length > 0) {
    drawNodesAndEdges([], edges, cy, "circle");  // or "grid", "random"
  }

  // ページを離れるとき、監視を解除
  onDestroy(() => {
    if (unsubscribeAll) {
      unsubscribeAll();
    }
  });

</script>
<div class="w-64 h-64 bg-gray-100">
  <p class="flex justify-center">{name}</p>
  <div bind:this={container} class="h-full"></div>
</div>
