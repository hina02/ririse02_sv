<!-- storeの値を監視して、cytoscapeの描画を更新する -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import cytoscape from 'cytoscape';
  import { Nodes, Relationships, Triplets } from './Store.ts';
  import { getTriplets } from './gettriplets.ts';
  export let backendUrl: string;
  let cy;
  let container;
  let unsubscribeAll;
  let unsubscribeTriplets; 
  let isLoading = true; // ローディングステートを初期化

  // 全てのノードとリレーションシップを描画
  async function drawAllNodesAndRelationships() {  
    unsubscribeAll = await Nodes.subscribe(nodes => {
      if (nodes) {
        Relationships.subscribe(relationships => {
          if (relationships) {
            const cytoscapeData = {
              nodes: [],
              edges: []
            };

            // ノードのデータを作成
            nodes.forEach(node => {
              cytoscapeData.nodes.push({
                data: {
                  id: node.name,
                  label: node.label,
                  ...node.properties
                }
              });
            });
      
            // エッジのデータを作成
            relationships.forEach(relationship => {
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

            cy.elements().remove();
            cy.add(cytoscapeData);
            cy.layout({ name: 'circle' }).run();
            isLoading = false; // データがロードされたら、ローディングステートを更新
          }
        });
      }
    });
  }

  function drawTriplets() {  
    unsubscribeTriplets = Triplets.subscribe(triplets => {
      if (triplets.nodes) {
        // 色を変更するノードのIDを取得
        triplets.nodes.forEach(node => {
          const nodeId = node.name;
          // ノードの色を変更
          cy.style().selector(`node[id = "${nodeId}"]`).style({
            'background-color': 'blue'
          });
        });

        // 色を変更するエッジのIDを取得
        triplets.relationships.forEach(relationship => {
          const startnodeId = relationship.start_node ;
          const endnodeId = relationship.end_node;
          // エッジ始端終端の色を変更
          cy.style().selector(`node[id = "${startnodeId}"]`).style({
            'background-color': '#bfdbfe'
          });
          cy.style().selector(`node[id = "${endnodeId}"]`).style({
            'background-color': '#bfdbfe'
          });

          const edgeId = relationship.start_node + "->" + relationship.end_node;
          // エッジの色を変更
          cy.style().selector(`edge[id = "${edgeId}"]`).style({
            'line-color': '#3b82f6',
            'target-arrow-color': '#3b82f6'
          });
          cy.style().update();
          isLoading = false; // データがロードされたら、ローディングステートを更新
        });
      }
    });
  }

  // ローディングステートを更新
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

    // すべてのノードとエッジを描画
    drawAllNodesAndRelationships();
  });

  onDestroy(() => {
    if (unsubscribeAll) {
      unsubscribeAll();
    }
  });


  // Tripletsのデータが更新されたとき、該当するノードとエッジの色を変更
  Triplets.subscribe(() => {
    drawTriplets();
  });


  </script>
  <div class="absolute top-40 left-40 w-96 h-96 bg-gray-100">
    {#if isLoading} <!-- ローディングインジケーターを表示 -->
      <div class="h-full">Loading...</div>
    {/if}
    <div bind:this={container} class="h-full"></div>
    <button on:click={async () => await getTriplets(backendUrl, "Tom is an engineer")} class="btn-default">button</button>

  </div>
  