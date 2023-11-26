<!-- Historyとして、Title listを表示。デフォルトは今のTitle。expandで、Titleに紐づくMessageを表示。 -->
<script lang="ts">
import { onMount } from 'svelte';
import { Titles, activeTitle, Messages } from './chatStore.js';
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

// メニュー全体の表示
let showMenu = false;

function toggleMenu() {
    showMenu = !showMenu;
    console.log("toggleMenu function is called!");
    console.log(showMenu);
}
</script>


<!-- lg以下でiconを表示する -->
<div class="absolute top-20 left-0 z-10">
    <button on:click={toggleMenu} class="text-white px-4 py-2 rounded">
        <span class="material-icons base_icon">
            menu
        </span>
    </button>
</div>
<!-- iconをクリックして表示するhistory欄 -->
<div class={`min-w-[16rem] absolute top-20 bg-blue-50/50 h-2/5 overflow-hidden ${showMenu ? '' : 'hidden'}`}>
    <h1 class="mt-1 ml-6 text-center text-xl font-bold text-gray-800">chat history</h1>
    <div class="h-full my-4 m-4 bg-blue-100/50 p-2">
        {#each $Titles as title}
            <!-- クリックした時に、titleをactiveにする -->
            <details on:toggle={() => activeTitle.set(title)} class="max-h-96 overflow-y-auto">
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

<!-- lg以上ではバーを表示する
<div class="hidden lg:block absolute top-14 left-0 w-72 h-full border-r-2 shadow-lg">
    <div class="flex-col">
        {#each ChatTitles as title}
        <div class="mt-4 whitespace-pre-line">
            {title}
        </div>
        {/each}
    </div>
</div> -->
