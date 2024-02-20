<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { MessageNodes, MessageRelationships } from './Store'
  import { getLatestMessages } from './getMessage'
  import { initializeBasicCytoscape, drawNodesAndEdges, activateColor } from '../cytoscape'
  import { activeTitle } from '$lib/Chat/Chat/Store'
  import type { Core } from 'cytoscape'

  let cy: Core
  let container: HTMLElement
  let unsubscribeAll: () => void
  export let backendUrl: string

  // ストアのMessagesの変更を監視し、ノードとエッジを描画
  async function drawMessages() {
    unsubscribeAll = await MessageNodes.subscribe((nodes) => {
      if (nodes) {
        MessageRelationships.subscribe((relationships) => {
          if (relationships) {
            // 描画処理
            cy.elements().remove() // 既存の描画を削除
            drawNodesAndEdges(nodes, relationships, cy, 'breadthfirst')
          }
        })
      }
    })
  }

  // 最初にcytoscapeを初期化し、ストアの購読を開始
  onMount(async () => {
    cy = initializeBasicCytoscape(container)
    drawMessages()
  })

  // Titleを指定すると、message nodes, edgesを更新
  $: if ($activeTitle && $activeTitle !== 'new') {
    getLatestMessages(backendUrl, $activeTitle)
  }

  // ページを離れるとき、ストアの購読を解除
  onDestroy(() => {
    if (unsubscribeAll) {
      unsubscribeAll()
    }
  })

  // 色変更は未検討
  // 該当するノードとエッジの色を変更
  function changeColor() {
    if (!cy) {
      return // cyが初期化されていない場合、関数を早期に終了
    }
    // 全てのノードとエッジの色をデフォルトに戻す
    cy.style().selector('node').style({
      'background-color': '#666',
    })

    cy.style().selector('edge').style({
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
    })
  }
</script>

<div class="w-96 h-[32rem] bg-gray-100">
  <p class="flex justify-center px-4">Message Node</p>
  <div bind:this={container} class="h-full"></div>
  <div class="flex justify-center space-x-6">
    <button
      on:click={async () => {
        await getLatestMessages(backendUrl, $activeTitle)
      }}
      class="btn-default">update messages</button
    >
  </div>
</div>
