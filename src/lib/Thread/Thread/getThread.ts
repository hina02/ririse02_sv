import { get } from 'svelte/store'; // 追加: ストアの現在の値を取得するため
import type { ThreadSchemaType, ThreadSettingSchemaType } from './Schema.ts';
import { Threads, Tags, activeThread} from './Store';

// Function to get the list of threads from Store
export async function getThreads(backendUrl: string) {
    const currentThreads = get(Threads); // 現在のthreadのリストを取得

    // ストアにThreadsがない場合、バックエンドからthreadのリストを取得
    if (currentThreads.length === 0) {
        await updateThreads(backendUrl);
    }
}

// Function to get the list of threads
export async function updateThreads(backendUrl: string) {
    let threads: ThreadSchemaType[] = await fetch(`${backendUrl}/openai_api/get_threads`).then(r => r.json());
    console.log(`threads: ${JSON.stringify(threads, null, 2)}`)
    Threads.set(threads);

    // Store a list of unique tags
    let uniqueTags : string[] = [...new Set(threads.flatMap(thread => thread.tags ?? []))];
    Tags.set(uniqueTags);
}


// create thread
export async function createThread(backendUrl: string, metadata: ThreadSettingSchemaType) {
    const response = await fetch(`${backendUrl}/create_thread`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
        });
    if (response.ok) {
        const responseText = response.text();
        console.log(responseText);
        updateThreads(backendUrl);  // update thread list
        return responseText;
    }
    else if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
}


// delete thread
export async function deleteThread(backendUrl: string, thread_id: string) {
    const response = await fetch(`${backendUrl}/openai_api/delete_thread/${thread_id}`, {
        method: 'DELETE',
        });
    if (response.ok) {
        const responseText = response.text();
        console.log(responseText);
        updateThreads(backendUrl);  // update thread list
        activeThread.set(null); // activeThreadをnullにする
        return responseText;
    }
    else if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
}