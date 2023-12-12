import { get } from 'svelte/store'; // 追加: ストアの現在の値を取得するため
import type { NodeSchemaType, RelationshipsSchemaType } from '../Schema';
import { MessageNodes, MessageRelationships } from './Store';
import { activeTitle } from '$lib/Chat/Chat/Store';

// get message nodes
export async function getMessageNodes(backendUrl: string) {
    const title = get(activeTitle);
    if (title) {
    const messageNodes = get(MessageNodes);
        if (messageNodes.length === 0) {
            await updateMessageNodes(backendUrl, title);
        }
    }
}

// get message relationships
export async function getMessageEdges(backendUrl: string) {
    const title = get(activeTitle);
    if (title) {
    const messageRelationships = get(MessageRelationships);
        if (messageRelationships.length === 0) {
            await updateMessageEdges(backendUrl, title);
        }
    }
}

// update message nodes
export async function updateMessageNodes(backendUrl: string, title: string) {
    let nodes: NodeSchemaType[] = await fetch(`${backendUrl}/chat_wb/message_nodes/${title}`).then(r => r.json());
    console.log(`nodes length: ${nodes.length}`)
    MessageNodes.set(nodes);
}

// update message relationships
export async function updateMessageEdges(backendUrl: string, title: string) {
    let edges: RelationshipsSchemaType[] = await fetch(`${backendUrl}/chat_wb/message_relationships/${title}`).then(r => r.json());
    console.log(`edges length: ${edges.length}`)
    MessageRelationships.set(edges);
}
