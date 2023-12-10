<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ShortMemory, ActivatedMemory } from './Store';
  import { getMemory } from './memoryService';
  import { initializeBasicCytoscape, drawNodesAndEdges, activateColor } from '../cytoscape';
  import type { Core } from 'cytoscape';

  export let backendUrl: string;
  let cy: Core;
  let container: HTMLElement;
  let unsubscribeAll: () => void;
  let unsubscribeActivatedMemory; 
  let isLoading = true; // ローディングステートを初期化

  let query: string = "Tom is an engineer"

  // ActivatedMemoryのデータが更新されたとき、該当するノードとエッジの色を変更
  function drawActivatedMemory() {
    if (cy) {
      // 全てのノードとエッジの色をデフォルトに戻す
      cy.style().selector('node').style({
        'background-color': '#666'
      });

      cy.style().selector('edge').style({
        'line-color': '#ccc',
        'target-arrow-color': '#ccc'
      });
    }
    // 該当するノードとエッジの色を変更
    unsubscribeActivatedMemory = ActivatedMemory.subscribe(activatedmemory => {
      if (activatedmemory.nodes && activatedmemory.relationships) {
        activateColor(activatedmemory, cy);
      }
    });
  }

  // ActivatedMemoryのデータが更新されたとき、該当するノードとエッジの色を変更
  $: if (ActivatedMemory) {
    drawActivatedMemory();
  }
  
  // 最初にcytoscapeを初期化
  onMount(async () => {
    cy = initializeBasicCytoscape(container);
  });

  // ShortMemoryが更新されると、ノードとエッジの描画を更新
  $: if ($ShortMemory && $ShortMemory.nodes && $ShortMemory.relationships) {
    drawNodesAndEdges($ShortMemory.nodes, $ShortMemory.relationships, cy, "circle");  // or "grid", "random"
    isLoading = false; // データがロードされたら、ローディングステートを更新
  }

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
      <button on:click={async () => await getMemory(backendUrl, query)} class="btn-default">get triplets</button>

    </div>
  </div>
  
