<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import cytoscape from 'cytoscape';
  import { Triplets } from './Store.ts';
  import { getTriplets } from './gettriplets.ts';

  let cy;
  let container;
  let unsubscribe;
  let isLoading = true; // ローディングステートを初期化

  onMount(async () => {
    cy = cytoscape({
      container,
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'  // ノードのラベルとしてid(name)を表示
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      }
    });
    unsubscribe = await Triplets.subscribe(triplets => {
      if (triplets.nodes) {
      const cytoscapeData = {
        nodes: [],
        edges: []
      };
  
      triplets.nodes.forEach(node => {
        cytoscapeData.nodes.push({
          data: {
            id: node.name,
            label: node.label,
          }
        });
      });
  
      // エッジのデータを作成
      triplets.relationships.forEach(relationship => {
          // sourceとtargetのノードが存在するか確認
          const sourceNodeExists = cytoscapeData.nodes.some(node => node.data.id === relationship.start_node);
          const targetNodeExists = cytoscapeData.nodes.some(node => node.data.id === relationship.end_node);

          // sourceノードが存在しない場合、作成
          if (!sourceNodeExists) {
            cytoscapeData.nodes.push({
              data: {
                id: relationship.start_node,
                name: relationship.start_node, // 仮のname
                label: 'Unknown', // 仮のlabel
              }
            });
          }

          // targetノードが存在しない場合、作成
          if (!targetNodeExists) {
            cytoscapeData.nodes.push({
              data: {
                id: relationship.end_node,
                name: relationship.end_node, // 仮のname
                label: 'Unknown', // 仮のlabel
              }
            });
          }

          // エッジを作成 
          cytoscapeData.edges.push({
            data: {
              id: relationship.start_node + "->" + relationship.end_node,
              source: relationship.start_node,
              target: relationship.end_node,
              label: relationship.type
            }
          });
        });

      console.log(cytoscapeData);
      cy.elements().remove();
      cy.add(cytoscapeData);
      cy.layout({ name: 'grid', rows: 1 }).run();
      isLoading = false; // データがロードされたら、ローディングステートを更新
    }
    });

  });
  
  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  </script>
  <div class="absolute top-40 left-40 w-96 h-96 bg-gray-100">
    {#if isLoading} <!-- ローディングインジケーターを表示 -->
      <div class="h-full">Loading...</div>
    {/if}
    <div bind:this={container} class="h-full"></div>
  </div>

  