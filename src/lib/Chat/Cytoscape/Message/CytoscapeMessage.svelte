<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { MessageNodes, MessageRelationships } from './Store';
  import { getMessageNodes, getMessageEdges, updateMessageNodes, updateMessageEdges } from './getMessage';
  import { initializeBasicCytoscape, drawNodesAndEdges } from '../cytoscape';
  import { activeTitle } from '$lib/Chat/Chat/Store';
  import type { Core } from 'cytoscape';

  export let backendUrl: string;
  let cy: Core;
  let container: HTMLElement;
  let unsubscribeAll: () => void;
  let unsubscribeTriplets; 
  let isLoading = true; // ローディングステートを初期化

  // すべてのノードとエッジを描画
  async function drawAllNodesAndEdges() {
    if ($activeTitle == "") {
      $activeTitle = "test";
    }
  unsubscribeAll = await MessageNodes.subscribe(nodes => {
      if (nodes) {
        MessageRelationships.subscribe(relationships => {
          if (relationships) {
          drawNodesAndEdges(nodes, relationships, cy, "breadthfirst");
          isLoading = false; // データがロードされたら、ローディングステートを更新
          }
        });
      }
    })
  }

  // 最初にcytoscapeを初期化
  onMount(async () => {
    cy = initializeBasicCytoscape(container);
    drawAllNodesAndEdges();
  });

  // Titleを指定すると、メッセージのノードとエッジを更新
  $: if ($activeTitle && $activeTitle !== "new") {
    updateMessageNodes(backendUrl, $activeTitle);
    updateMessageEdges(backendUrl, $activeTitle);
  }

  // ページを離れるとき、監視を解除
  onDestroy(() => {
    if (unsubscribeAll) {
      unsubscribeAll();
    }
  });

  </script>
  <div class="w-96 h-[32rem] bg-gray-100">
    <p class="flex justify-center px-4">Message Node</p>
    {#if isLoading} <!-- ローディングインジケーターを表示 -->
      <div class="h-full">Loading...</div>
    {/if}
    <div bind:this={container} class="h-full"></div>
    <div class="flex justify-center space-x-6">
      <button on:click={async () => { await updateMessageNodes(backendUrl, $activeTitle); await updateMessageEdges(backendUrl, $activeTitle); }} class="btn-default">update messages</button>
    </div>
  </div>
  
