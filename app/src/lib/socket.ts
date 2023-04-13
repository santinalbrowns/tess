//export const socket = new WebSocket('ws://localhost:5000/ws');

import { socket } from "./store";

export default function websocket() {
    
    const ws = new WebSocket('ws://localhost:5000/ws');

    ws.addEventListener("open", (e) => {
        console.log('Connected');

        socket.set(ws);
    });
    
    ws.addEventListener("message", (e) => {
        
        const message: ServerEventMessage = JSON.parse(e.data);

        switch(message.action) {
            case "joined":
                console.log(message)
                break;
            case "error":
                console.log(message)
                break;
            default:
                break;
        }

    });
    
    ws.addEventListener("close", () => {
        setTimeout(() => {
            websocket();
            console.log("Reconnecting...") // Call the function to create a new WebSocket connection
        }, 3000);
    })

    return ws;
}