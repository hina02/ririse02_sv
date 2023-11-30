<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { MessageNodes, MessageRelationships } from './Store';
  import { updateMessageNodes, updateMessageEdges } from './getMessage';
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
  unsubscribeAll = await MessageNodes.subscribe(nodes => {
      if (nodes) {
        MessageRelationships.subscribe(relationships => {
          if (relationships) {
          drawNodesAndEdges(nodes, relationships, cy);
          isLoading = false; // データがロードされたら、ローディングステートを更新
          }
        });
      }
    })
  }
  
  // 最初にすべてのノードとエッジを描画
  onMount(async () => {
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
  <div class="absolute top-40 right-20 w-96 h-96 bg-gray-100">
    {#if isLoading} <!-- ローディングインジケーターを表示 -->
      <div class="h-full">Loading...</div>
    {/if}
    <div bind:this={container} class="h-full"></div>
    <div class="flex justify-center space-x-6">
      <button on:click={async () => { await updateMessageNodes(backendUrl); await updateMessageEdges(backendUrl); }} class="btn-default">update messages</button>
    </div>
  </div>
  
