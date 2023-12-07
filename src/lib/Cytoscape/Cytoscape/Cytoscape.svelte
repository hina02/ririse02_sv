<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Nodes, Relationships, Triplets } from './Store';
  import { getAllNodes, getAllEdges, getTriplets, updateAllNodes, updateAllEdges } from './getTriplets';
  import { initializeBasicCytoscape, drawNodesAndEdges, changeTripletsColor } from '../cytoscape';
  import type { Core } from 'cytoscape';

  export let backendUrl: string;
  let cy: Core;
  let container: HTMLElement;
  let unsubscribeAll: () => void;
  let unsubscribeTriplets; 
  let isLoading = true; // ローディングステートを初期化

  // すべてのノードとエッジを描画
  async function drawAllNodesAndEdges() {
  unsubscribeAll = await Nodes.subscribe(nodes => {
      if (nodes) {
        Relationships.subscribe(relationships => {
          if (relationships) {
          drawNodesAndEdges(nodes, relationships, cy, "circle");  // or "grid", "random"
          isLoading = false; // データがロードされたら、ローディングステートを更新
          }
        });
      }
    })
  }

  // Tripletsのデータが更新されたとき、該当するノードとエッジの色を変更
  function drawTriplets() {  
    unsubscribeTriplets = Triplets.subscribe(triplets => {
      if (triplets.nodes && triplets.relationships) {
        changeTripletsColor(triplets, cy);
      }
    });
  }

  // Tripletsのデータが更新されたとき、該当するノードとエッジの色を変更
  Triplets.subscribe(() => {
    drawTriplets();
  });
  
  // 最初にすべてのノードとエッジを描画
  onMount(async () => {
    await getAllNodes(backendUrl);
    await getAllEdges(backendUrl);
    cy = initializeBasicCytoscape(container);
    drawAllNodesAndEdges();
  });
  
  // ページを離れるとき、監視を解除
  onDestroy(() => {
    if (unsubscribeAll) {
      unsubscribeAll();
    }
  });

  </script>
  <div class="w-96 h-96 bg-gray-100">
    <p class="flex px-4 justify-center">Entity Node</p>
    {#if isLoading} <!-- ローディングインジケーターを表示 -->
      <div class="h-full">Loading...</div>
    {/if}
    <div bind:this={container} class="h-full"></div>
    <div class="flex justify-center space-x-12 pl-12 lg:pl-0">
      <button on:click={async () => await getTriplets(backendUrl, "Tom is an engineer")} class="btn-default">get triplets</button>
      <!-- update all nodes and edges -->
      <button on:click={async () => { await updateAllNodes(backendUrl); await updateAllEdges(backendUrl); }} class="btn-default">update all</button>
    </div>
  </div>
  
