import { get } from 'svelte/store'; // 追加: ストアの現在の値を取得するため
import type { NodeSchemaType, RelationshipsSchemaType, TripletsSchemaType } from '../Schema.js';
import { Nodes, Relationships, Triplets } from './Store.js';

// update Triplets
export async function getTriplets(backendUrl: string, text: string) {
    let triplets: TripletsSchemaType[] = await fetch(`${backendUrl}/chat_wb/get_memory_from_triplet?text=${encodeURIComponent(text)}`).then(r => r.json());
    Triplets.set(triplets);
    // # Tripletsを表示
    console.log(`Triplets: ${JSON.stringify(get(Triplets), null, 2)}`)
}

// get All Nodes from store
export async function getAllNodes(backendUrl: string) {
    const allNodes = get(Nodes);
    if (allNodes.length === 0) {
        await updateAllNodes(backendUrl);
    }
}

// get All Relationships from store
export async function getAllEdges(backendUrl: string) {
    const allRelationships = get(Relationships);
    if (allRelationships.length === 0) {
        await updateAllEdges(backendUrl);
    }
}

// update All Nodes
export async function updateAllNodes(backendUrl: string) {
    let nodes: NodeSchemaType[] = await fetch(`${backendUrl}/chat_wb/all_nodes`).then(r => r.json());
    console.log(`nodes: ${JSON.stringify(nodes, null, 2)}`)
    console.log(`nodes length: ${nodes.length}`)
    Nodes.set(nodes);
}

// update All Relationships
export async function updateAllEdges(backendUrl: string) {
    let edges: RelationshipsSchemaType[] = await fetch(`${backendUrl}/chat_wb/all_relationships`).then(r => r.json());
    console.log(`edges: ${JSON.stringify(edges, null, 2)}`)
    console.log(`edges length: ${edges.length}`)
    Relationships.set(edges);
}
