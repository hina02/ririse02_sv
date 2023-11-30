import { get } from 'svelte/store'; // 追加: ストアの現在の値を取得するため
import type { NodeSchemaType, RelationshipsSchemaType } from '../Schema';
import { MessageNodes, MessageRelationships } from './Store';

// get message nodes
export async function getMessageNodes(backendUrl: string) {
    const messageNodes = get(MessageNodes);
    if (messageNodes.length === 0) {
        await updateMessageNodes(backendUrl);
    }
}

// get message relationships
export async function getMessageEdges(backendUrl: string) {
    const messageRelationships = get(MessageRelationships);
    if (messageRelationships.length === 0) {
        await updateMessageEdges(backendUrl);
    }
}

// update message nodes
export async function updateMessageNodes(backendUrl: string) {
    let nodes: NodeSchemaType[] = await fetch(`${backendUrl}/chat_wb/message_nodes`).then(r => r.json());
    console.log(`nodes: ${JSON.stringify(nodes, null, 2)}`)
    console.log(`nodes length: ${nodes.length}`)
    MessageNodes.set(nodes);
}

// update message relationships
export async function updateMessageEdges(backendUrl: string) {
    let edges: RelationshipsSchemaType[] = await fetch(`${backendUrl}/chat_wb/message_relationships`).then(r => r.json());
    console.log(`edges: ${JSON.stringify(edges, null, 2)}`)
    console.log(`edges length: ${edges.length}`)
    MessageRelationships.set(edges);
}