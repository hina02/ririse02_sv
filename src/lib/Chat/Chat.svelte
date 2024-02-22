<script lang="ts">
  import websocketService from './Chat/websocketService'
  import textService from './Chat/textService'
  import audioService from './Chat/audioService'
  import SceneSelector from '$lib/Chat/Chat/SceneSelector.svelte'
  import { currentScene, Player, setCharacters, withVoice } from './Store'

  let selectedScene: string // シーンの選択
  let scrollContainer: HTMLElement // メッセージ表示欄のDOM要素

  export let backendUrl: string
  let socket: WebSocket

  let systemMessage: string = 'System: '
  let inputText: string = '' // 入力文字
  let responseText: string = '' //　addCharacter: レスポンスのストリーム表示
  let responseMessages: string = `${$setCharacters}: `

  // TopicSettingsのデータを送信
  function sendTopicSettings() {
    const message = {
      type: 'topicSettings',
      data: {
        scene_id: $currentScene,
        characters: $setCharacters,
      },
    }
    socket.send(JSON.stringify(message))
  }

  // PlayerMessageのデータを送信
  function sendPlayerMessage() {
    const message = {
      type: 'playerMessage',
      data: {
        player: $Player,
        player_message: inputText,
        with_voice: $withVoice,
      },
    }
    socket.send(JSON.stringify(message))
    // 変数の初期化
    responseMessages = `${$setCharacters}: `
    inputText = ''
  }

  function openSocket() {
    socket = websocketService.connect(backendUrl, {
      onOpen: (event: Event) => {
        systemMessage = 'System: WebSocketが開きました。'
      },
    })
  }

  function closeSocket() {
    socket = websocketService.connect(backendUrl, {
      onClose: (event: CloseEvent) => {
        systemMessage = 'System: WebSocketが閉じました。'
      },
    })
  }

  // WebSocketからのメッセージをハンドリング
  function handleWebSocketMessage(response: { [key: string]: any; type: string }): void {
    try {
      switch (response.type) {
        case 'audio':
          audioService.handleAudioData(response)
          responseText += response.text // 音声に合わせた速度でレスポンスメッセージ欄にテキストを表示
          break
        case 'text':
          responseText += response.text // レスポンスメッセージ欄にテキストを表示（音声無しでチャンクごとに返す場合は、responseMessageに直接渡す）
          break
        default:
          console.error('Unknown message type:', response.type)
      }
    } catch (error) {
      console.error('Error during processing:', error)
    }
  }

  // 表示文字のストリーミング
  $: if (responseText) {
    textService.addCharacter(responseText, 'response', (char) => {
      responseMessages += char
    })
  }
</script>

<div class="h-1/4 sm:h-1/3 max-w-4xl min-w-screen w-full fixed bottom-0">
  <SceneSelector {backendUrl} bind:selectedScene />

  <!-- message container -->
  <div class="h-full px-4 py-2 bg-sky-50 opacity-95 text-center text-gray-500 lg:left-72">
    <div class="h-full flex flex-col">
      <div class="flex-none">
        <div class="flex justify-center">
          <input
            bind:value={inputText}
            type="text"
            placeholder="Type something..."
            class="w-11/12 p-2 border-2 rounded border-blue-300 focus:border-black"
          />
          <button on:click={sendMessage} class="ml-4 px-2 center hover:border-b-2 border-blue-300">
            <span class="material-icons base_icon"> chat </span>
          </button>
        </div>
        <div class="mt-4 bg-gray-200 border-2 border-blue-300">
          {systemMessage}
        </div>
      </div>
      <div
        bind:this={scrollContainer}
        class=" border-x-2 border-b-2 border-blue-300 p-2 whitespace-pre-line text-left flex-grow h-full overflow-y-scroll"
      >
        <!-- response  の表示 -->
        {responseMessages + `\n`}
        {`\n\n`}
      </div>
    </div>
  </div>
</div>
