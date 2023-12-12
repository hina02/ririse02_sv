<!-- Historyとして、Title listを表示。デフォルトは今のTitle。expandで、Titleに紐づくMessageを表示。 -->
<script lang="ts">
import { onMount } from 'svelte';
import { Titles, activeTitle } from '$lib/Chat/Chat/Store.js';
import { Messages } from './chatStore.js';
import { getTitles, getMessages } from './getChatHistory.js';

export let backendUrl: string;


// チャットタイトルの取得
onMount(() => {
    getTitles(backendUrl);
});

// activeTitleが変わったときにgetMessagesをトリガー
$: if ($activeTitle) {
    getMessages(backendUrl, $activeTitle);  // backendUrlも適切に提供する必要があります。
}

</script>


<!-- iconをクリックして表示するhistory欄 -->
<div class="w-96 h-full p-4">
    <h1 class="text-xl font-semibold text-gray-800">Chat History</h1>
    <div class="my-2">
        {#each $Titles as title}
            <!-- クリックした時に、titleをactiveにする -->
            <details on:toggle={() => activeTitle.set(title)} class="max-h-96 overflow-y-auto p-1">
                <summary class="overflow-x-hidden">{title}</summary>                
                {#if $activeTitle === title}
                <!-- メッセージをロード中であることを示す -->
                {#if $Messages[title] === undefined}
                    <p>Loading messages...</p>
                {:else}
                <!-- メッセージを表形式で表示 -->
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $Messages[title] as message}
                        <tr>
                            <td>{message.created_at}</td>
                            <td><strong>{message.role}:</strong> {message.content}</td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
                {/if}
                {/if}
            </details>
        {/each}
    </div>
</div>