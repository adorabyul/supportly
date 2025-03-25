export class WebSocketService {
    private ws: WebSocket | null = null;
    private onMessageCallback: ((message: string) => void) | null = null;
  
    constructor(url: string) {
      this.ws = new WebSocket(url);
  
      this.ws.onopen = () => console.log("WebSocket connected");
      this.ws.onmessage = (event) => {
        if (this.onMessageCallback) this.onMessageCallback(event.data);
      };
      this.ws.onclose = () => console.log("WebSocket disconnected");
    }
  
    sendMessage(message: string) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(message);
      }
    }
  
    setOnMessageCallback(callback: (message: string) => void) {
      this.onMessageCallback = callback;
    }
  
    close() {
      if (this.ws) this.ws.close();
    }
  }