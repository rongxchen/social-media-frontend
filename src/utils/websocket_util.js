import { ElNotification } from "element-plus";

class WebsocketUtil {
    constructor(wsUrl, onMessage) {
        this.wsUrl = wsUrl;
        this.onMessage = onMessage;
        this.socket = null;
        this.maxRetryTimes = 10;
        this.countRetryTimes = 0;
    }

    connect() {
        if (typeof WebSocket == "undefined") {
            ElNotification({
                message: "your browser does not support websocket, no notifications will be pushed",
                duration: 2500,
                type: "info"
            });
            return;
        }
        this.socket = new WebSocket(this.wsUrl);

        this.socket.onopen = () => {
            const token = localStorage.getItem("accessToken");
            this.sendMessage({mode: "init", token: token});
        }

        this.socket.onmessage = (event) => {
            const message = event.data;
            if (typeof this.onMessage == "function") {
                this.onMessage(message);
            }
        }

        this.socket.onerror = () => {
            if (this.countRetryTimes < this.maxRetryTimes) {
                this.socket = new WebSocket(this.wsUrl);
                this.countRetryTimes++;
            }
        }

        this.socket.onclose = (event) => {
            if (!event.wasClean && this.countRetryTimes < this.maxRetryTimes) {
                this.disconnect();
                this.countRetryTimes++;
                const reconnectInterval = 1000 * Math.pow(2, event.target.reconnectAttempts || 0);
                setTimeout(this.connect(), reconnectInterval);
            }
        }
    }

    sendMessage(message) {
        if (typeof message != "string") {
            message = JSON.stringify(message);
        }
        if (this.socket && this.socket.readyState == WebSocket.OPEN) {
            this.socket.send(message);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    getState() {
        if (this.socket) {
            return this.socket.readyState;
        }
        return WebSocket.CLOSED;
    }
}

export default WebsocketUtil;
