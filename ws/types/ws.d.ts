import WebSocket from "ws";

declare module 'ws' {
    interface WebSocket { 
        roomId: string
    }
}