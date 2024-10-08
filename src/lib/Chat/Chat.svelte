<script lang="ts">
	import { onMount } from 'svelte';
	import websocketService from './Chat/websocketService';
	import textService from './Chat/textService';
	import audioService from './Chat/audioService';
	import { handleShortMemory, handleRetrievedMemory } from '$lib/Chat/Cytoscape/Memory/memoryService';
	// import hljs from '../../css/my-highlight.js'
	import { Titles, activeTitle, user, AI, withVoice } from './Chat/Store';
	import { createTitle, getTitles } from './Settings/History/getChatHistory';
	let selectedTitle: string;	// タイトルの選択
	let scrollContainer: HTMLElement;	// メッセージ表示欄のDOM要素

	export let backendUrl: string;
	let socket: WebSocket;

	let NewTitle: string = "";	// 新規タイトルの入力
	let systemMessage:string = 'System: ';	
	let inputText:string = "";	// 入力文字

	let responseText:string = '';	//　addCharacter: レスポンスのストリーム表示
    let responseMessages:string = `${$AI}: `;
	let codeMessages: string[] = [];	//　コードの表示
    let index:number = 0;
	
	// create title
	async function createNewTitle(title: string) {
		await createTitle(backendUrl, title);
		activeTitle.set(title);
		selectedTitle = title;
		NewTitle = "";
	}

	// type imageの画像指示を処理する関数
	function handleImageData(response: { emote: string; }) {
		console.log(response.emote);
	}

	// type codeのコード指示を処理する関数
	function handleCodeData(response: { code: string; }) {
    	codeMessages = [...codeMessages, response.code];

		// コードブロックのハイライトを適用
		setTimeout(() => {
			document.querySelectorAll('pre code').forEach((block) => {
				hljs.highlightBlock(block);
			});
		}, 0); // setTimeoutを使用して、DOMが更新された後にハイライトを適用する
		console.log(response.code);
}

  
	function sendMessage(): void {
		// activeTitleがない場合、送信しない
		if (!$activeTitle || $activeTitle === 'new') {
			systemMessage = "System: Titleを選択してください。";
			return;
		}

		socket = websocketService.connect(backendUrl, {
			onOpen: (event: Event) => {
				// メッセージの送信
				systemMessage = "System: WebSocketが開かれました。";

				const data = {
							user: $user,
							AI: $AI,
							source: $user,	// 仮のsource。Assistantも受け取るようにする。
							user_input: inputText,
							title: $activeTitle,
							with_voice: $withVoice,
							};				
				socket.send(JSON.stringify(data));
				// 変数の初期化
				responseMessages = `${$AI}: `;
				codeMessages = [];	
				inputText = "";
			},
			onMessage: handleWebSocketMessage,
			onClose: (event: CloseEvent) => {
				systemMessage = "System: WebSocketが閉じました。";
			}
		});
	}

	// WebSocketからのメッセージをハンドリング
	function handleWebSocketMessage(response: { type: string; [key: string]: any }): void {
		try {
			switch (response.type) {
				case 'audio':
					audioService.handleAudioData(response);
					responseText += response.text;	// 音声に合わせた速度でレスポンスメッセージ欄にテキストを表示
					break;
				case 'text':
					responseText += response.text;			// レスポンスメッセージ欄にテキストを表示（音声無しでチャンクごとに返す場合は、responseMessageに直接渡す）
					break;
				case 'image':
					handleImageData(response);
					break;
				case 'code':
					handleCodeData(response);
					break;
				case 'close':
					if (response) {
						handleShortMemory(response);
						socket.close();
					}
					break;
				case 'retrieved_memory':
					if (response) {
						handleRetrievedMemory(response);
					}
					break;
				default:
					console.error("Unknown message type:", response.type);
			}
		} catch (error) {
			console.error("Error during processing:", error);
		}
	}

    // 表示文字のストリーミング
	$: if (responseText) {
		textService.addCharacter(responseText, 'response', char => {
			responseMessages += char;
		});
	}

	onMount(() => {
		// タイトルの取得
		getTitles(backendUrl);
		// ハイライトの適用
    	document.querySelectorAll('pre code').forEach((block) => {
      	hljs.highlightBlock(block);
    });
  });


</script>
<div class="h-1/4 sm:h-1/3 max-w-4xl min-w-screen w-full fixed bottom-0">
	<!-- title -->
	<div class="absolute bottom-full w-full mb-2 grid grid-cols-3 items-center h-6">
		<!-- Selected Title -->
		<div class="col-start-2 justify-self-center">
			<select bind:value={selectedTitle} on:change={() => activeTitle.set(selectedTitle)} class="text-center overflow-y-scroll">
				<option disabled selected value> -- Titleを選択してください -- </option>
				<option value="new">新規タイトルを追加...</option>
				{#each $Titles as title}
					<option value={title} selected={$activeTitle === title}>{title}</option>
				{/each}
			</select>
		</div>
		<!-- New Title -->
		{#if selectedTitle === 'new'}
		<div class="col-start-3 justify-self-start flex justify-center items-center">
			<input bind:value={NewTitle} type="text" placeholder="New Title..." class="w-11/12 border-2 rounded border-blue-300 focus:border-black">
			<button on:click={() => createNewTitle(NewTitle)} class="ml-2 border-blue-300">
				<span class="material-icons base_icon text-sm">
					add
				</span>
		</div>
		{/if}
	</div>
	<!-- message container -->
	<div class="h-full px-4 py-2 bg-sky-50 opacity-95 text-center text-gray-500 lg:left-72">
		<div class="h-full flex flex-col">
			<div class="flex-none">
				<div class="flex justify-center">
					<input bind:value={inputText} type="text" placeholder="Type something..." class="w-11/12 p-2 border-2 rounded border-blue-300 focus:border-black">
					<button on:click={sendMessage} class="ml-4 px-2 center hover:border-b-2 border-blue-300">
						<span class="material-icons base_icon">
							chat
						</span>
					</button>
				</div>
				<div class="mt-4 bg-gray-200 border-2 border-blue-300">{systemMessage}</div>
			</div>
			<div bind:this={scrollContainer} class=" border-x-2 border-b-2 border-blue-300 p-2 whitespace-pre-line text-left flex-grow h-full overflow-y-scroll">
				<!-- response  の表示 -->
				{responseMessages + `\n`}
				<!-- code blockの表示 -->
				{#each codeMessages as code}
				<div class = "mx-6 mb-6 md:mx-10 border-2 border-gray-400">
					<pre><code>
						{code}
					</code></pre>
				</div>
				{/each}
				{`\n\n`}
			</div>
		</div>
	</div>
</div>