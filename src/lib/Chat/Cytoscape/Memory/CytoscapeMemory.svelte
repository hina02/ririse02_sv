<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ShortMemory, RetrievedMemory } from './Store';
  import { initializeBasicCytoscape, drawNodesAndEdges, activateColor } from '../cytoscape';
  import type { Core } from 'cytoscape';

  let cy: Core;
  let container: HTMLElement;
  let unsubscribeAll: () => void;
  let unsubscribeRetrievedMemory; 


  // ストアのShortMemoryの変更を監視し、ノードとエッジを描画
  async function drawShortMemory() {
    unsubscribeAll = await ShortMemory.subscribe(({ shortmemory }) => {
        // 描画処理
        if(!shortmemory) return;
        const nodes = shortmemory.nodes;
        const relationships = shortmemory.relationships;
        cy.elements().remove(); // 既存の描画を削除
        drawNodesAndEdges(nodes, relationships, cy, "circle");
      });
    }

  // 最初にcytoscapeを初期化
  onMount(async () => {
    cy = initializeBasicCytoscape(container);
    drawShortMemory();
  });


  // ページを離れるとき、監視を解除
  onDestroy(() => {
    if (unsubscribeAll) {
      unsubscribeAll();
    }
  });



  // RetrievedMemoryのデータが更新されたとき、該当するノードとエッジの色を変更
  function drawActivatedMemory() {
    // ...
    unsubscribeRetrievedMemory = RetrievedMemory.subscribe(memory => {
      if (memory && memory.nodes && memory.relationships) {
        // 全てのノードとエッジの色をデフォルトに戻す
        cy.style().selector('node').style({
          'background-color': '#666'
        });

        cy.style().selector('edge').style({
          'line-color': '#ccc',
          'target-arrow-color': '#ccc'
        });

        drawNodesAndEdges(memory.nodes, memory.relationships, cy, "circle");
        // 該当するノードとエッジの色を変更
        activateColor(memory, cy);
      }
    });
  }

  // RetrievedMemoryが更新されたとき、該当するノードとエッジの色を変更
  $: if (RetrievedMemory) {
    drawActivatedMemory();
  }


  </script>
  <div class="w-96 h-[32rem] bg-gray-100">
    <p class="flex px-4 justify-center">Entity Node</p>
    <div bind:this={container} class="h-full"></div>
  </div>
  
