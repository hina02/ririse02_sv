// websocketService.ts

type WebSocketCallbacks = {
  onOpen?: (event: Event) => void
  onMessage?: (response: any) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
}

export default {
  connect(backendUrl: string, callbacks: WebSocketCallbacks) {
    const socket = new WebSocket(`${backendUrl.replace('http', 'ws')}/ws`)

    socket.onopen = function (event: Event) {
      console.log('WebSocket is open now.')
      if (callbacks.onOpen) callbacks.onOpen(event)
    }

    socket.onmessage = function (event: MessageEvent) {
      try {
        let response = JSON.parse(event.data)
        if (callbacks.onMessage) callbacks.onMessage(response)
      } catch (error) {
        console.error('Error during message processing:', error)
      }
    }

    socket.onclose = function (event: CloseEvent) {
      console.log('WebSocket is closed now.')
      if (callbacks.onClose) callbacks.onClose(event)
    }

    socket.onerror = function (event: Event) {
      console.error('WebSocket encountered an error.')
      if (callbacks.onError) callbacks.onError(event)
    }

    return socket
  },
}
