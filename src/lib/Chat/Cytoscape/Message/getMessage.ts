import { get } from 'svelte/store' // 追加: ストアの現在の値を取得するため
import type { TripletsSchemaType } from '$lib/Chat/Schema'
import { MessageNodes, MessageRelationships } from './Store'
import { activeScene } from '$lib/Chat/Store'

// update latest message nodes, relationships upto n
export async function getLatestMessages(backendUrl: string, scene: string, n: number = 7) {
  // let triplets: TripletsSchemaType = await fetch(
  //   `${backendUrl}/chat/get_latest_messages/${scene}/${n}`
  // ).then((r) => r.json())
  // let nodes = triplets.nodes
  // let relationships = triplets.relationships
  // console.log(`nodes length: ${nodes.length} relationships length: ${relationships.length}`)
  // MessageNodes.set(nodes)
  // MessageRelationships.set(relationships)
}
