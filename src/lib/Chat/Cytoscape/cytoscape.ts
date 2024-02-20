import cytoscape from 'cytoscape'
import type { Core } from 'cytoscape'
import type { NodeSchemaType, RelationshipsSchemaType, TripletsSchemaType } from '$lib/Chat/Schema'

export function initializeBasicCytoscape(container: HTMLElement): Core {
  return cytoscape({
    container,
    elements: [],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          label: 'data(id)', // ノードのラベルとしてid(name)を表示
        },
      },
      {
        selector: 'edge',
        style: {
          width: 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          label: 'data(label)',
        },
      },
    ],
    layout: {
      name: 'grid',
      rows: 1,
    },
  })
}

export function drawNodesAndEdges(
  nodes: NodeSchemaType[],
  relationships: RelationshipsSchemaType[],
  cy: cytoscape.Core,
  layoutName: string
) {
  // 新しいノードとエッジを保持する配列
  const newNodes = []
  const newEdges = []

  // ノードのデータを作成
  nodes.forEach((node) => {
    if (cy.getElementById(node.name).empty()) {
      newNodes.push({
        group: 'nodes',
        data: {
          id: node.name,
          label: node.label,
          color: node.label === 'Message' ? 'pink' : 'blue', // ラベルが"Message"の場合はピンク、それ以外は青
          ...node.properties,
        },
      })
    }
  })

  // エッジのデータを作成
  relationships.forEach((relationship) => {
    const sourceId = relationship.start_node
    const sourceLabel = relationship.start_node_label
    const targetId = relationship.end_node
    const targetLabel = relationship.end_node_label
    const edgeId = sourceId + '->' + targetId

    // 始点ノードが存在しない場合、作成
    if (cy.getElementById(sourceId).empty()) {
      newNodes.push({
        group: 'nodes',
        data: {
          id: sourceId,
          label: sourceLabel ?? 'Unknown', // 仮のラベル
        },
      })
    }
    // 終点ノードが存在しない場合、作成
    if (cy.getElementById(targetId).empty()) {
      newNodes.push({
        group: 'nodes',
        data: {
          id: targetId,
          label: targetLabel ?? 'Unknown', // 仮のラベル
        },
      })
    }
    // エッジが存在しない場合、作成
    if (cy.getElementById(edgeId).empty()) {
      newEdges.push({
        group: 'edges',
        data: {
          id: edgeId,
          source: sourceId,
          target: targetId,
          label: relationship.type,
        },
      })
    }
  })
  // 新しいノードとエッジを追加
  cy.add([...newNodes, ...newEdges])
  // レイアウトの更新
  cy.layout({ name: layoutName }).run()
}

export function activateColor(triplets: TripletsSchemaType, cy: cytoscape.Core) {
  // 色を変更するノードのIDを取得
  triplets.nodes.forEach((node) => {
    const nodeId = node.name
    // ノードの色を変更
    cy.style().selector(`node[id = "${nodeId}"]`).style({
      'background-color': 'blue',
    })
  })

  // 色を変更するエッジのIDを取得
  triplets.relationships.forEach((relationship) => {
    const startnodeId = relationship.start_node
    const endnodeId = relationship.end_node
    // エッジ始端終端の色を変更
    cy.style().selector(`node[id = "${startnodeId}"]`).style({
      'background-color': '#bfdbfe',
    })
    cy.style().selector(`node[id = "${endnodeId}"]`).style({
      'background-color': '#bfdbfe',
    })

    const edgeId = relationship.start_node + '->' + relationship.end_node
    // エッジの色を変更
    cy.style().selector(`edge[id = "${edgeId}"]`).style({
      'line-color': '#3b82f6',
      'target-arrow-color': '#3b82f6',
    })
    cy.style().update()
  })
}
