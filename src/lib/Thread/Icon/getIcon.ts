import { get } from 'svelte/store';
import { selectedAssistantId } from '../Assistant/Store.ts';

async function uploadIcon(file: File, assistant_id: string) {
    const AssistantId = get(selectedAssistantId);
    const formData = new FormData();
    formData.append('icon', file, 'icon.png');

    const response = await fetch(`/update_icon/${assistant_id}`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload icon');
    }

    // アップロードが成功したら、アイコンのURLを更新
    await getIcon();
}

// アイコンを取得する関数
async function getIcon(assistant_id: string) {
    const response = await fetch(`/get_icon/${assistant_id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch icon');
    }
    return response.blob();
}
