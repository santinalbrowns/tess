export default function websocket(workspace: string, token?: string) {

    const ws = new WebSocket('ws://localhost:5000');

    ws.addEventListener("close", () => {
        setTimeout(() => {
            websocket(workspace, token);
        }, 3000);
    })

    return ws;
}