import { get } from 'svelte/store'; // 追加: ストアの現在の値を取得するため
import { Titles, Messages, activeTitle} from './chatStore.js';

export async function getTitles(backendUrl: string) {
    const currentTitles = get(Titles); // 現在のTitlesの値を取得

    // ストアにタイトルがない場合、バックエンドからTitlesノードのリストを取得
    if (currentTitles.length === 0) {
        updateTitles(backendUrl);
    }
}

export async function updateTitles(backendUrl: string) {
    const titles = await fetch(`${backendUrl}/chat_wb/get_titles`).then(r => r.json());
    Titles.set(titles);
}

export async function createTitle(backendUrl: string, title: string) {
    if (["new"].includes(title)) {
        alert("予約語はタイトルとして使用できません。");
        return;
    }
    const response = await fetch(`${backendUrl}/chat_wb/create_and_update_title?title=${title}`);
    if (response.ok) {
        updateTitles(backendUrl);
        return;
    }
}

export async function getMessages(backendUrl: string, title: string) {
    const currentMessages = get(Messages); // 現在のMessagesの値を取得
    // ストアにメッセージがない場合、バックエンドから指定Titleに関連するMessageノードの中身を取得
    if (!currentMessages[title]) {
        const messages = await fetch(`${backendUrl}/chat_wb/get_messages?title=${title}`).then(r => r.json());
        Messages.update(allMessages => {
            allMessages[title] = messages;
            return allMessages;
        });
    }    
}