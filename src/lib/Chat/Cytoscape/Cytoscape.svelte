<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount, onDestroy } from 'svelte';
  import { initializeBasicCytoscape, drawNodesAndEdges } from './cytoscape';
  import type { TripletsSchemaType, RelationshipsSchemaType } from '$lib/Chat/Schema';
  import type { Core } from 'cytoscape';
  let cy: Core;
  let container: HTMLElement;

  export let backendUrl: string;
  export let name: string;
  let triplets: TripletsSchemaType;
  let edges: RelationshipsSchemaType[];
  let previousName: string;
  const dispatch = createEventDispatcher();

// fetch Edges (character node and relationship(without message))
  async function fetchEdges() {
    const label = "Person";

    triplets = await fetch(`${backendUrl}/chat_wb/get_node_relationships/${name}`).then(r => r.json());
    if (triplets) {
      edges = triplets.relationships;
      if (edges && edges.length > 0) {
        drawNodesAndEdges([], edges, cy, "circle");  // or "grid", "random"
        dispatch('edges', true);
      }
      else {
        cy = initializeBasicCytoscape(container);
        dispatch('edges', false);
      }
    }
  }

  // 最初にcytoscapeを初期化
  onMount(async () => {
    cy = initializeBasicCytoscape(container);
  });

  // 異なるnameが渡されると、Neo4jからデータを取得し、ノードとエッジを描画
  $: if (name !== previousName) {
  previousName = name;
  (async () => {
    await fetchEdges();
  })();
}

  $: if (edges && edges.length > 0) {
    cy.elements().remove(); // 既存の描画を削除
    drawNodesAndEdges([], edges, cy, "circle");  // or "grid", "random"
  }


</script>
<div class="w-64 h-64 bg-gray-100">
  <p class="flex justify-center">{name}</p>
  <div bind:this={container} class="h-full"></div>
</div>
