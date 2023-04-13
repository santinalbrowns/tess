import { writable, type Writable } from "svelte/store";
import websocket from "./socket";

export const participants: Writable<Array<Participant>> = writable<Array<Participant>>([
    {
        id: "1",
        user: {
            id: "1",
            username: "Santinal",
            color: "#1f8fce",
            email: "santinal@gmail.com"
        },
        host: {
            id: "1",
            label: "Testing",
            user: {
                id: "1",
                username: "Santinal",
                color: "76d6ff",
                email: "santinal@gmail.com"
            }
        },
        cell: {
            row: 5,
            column: 5,
        }
    },
    {
        id: "1",
        user: {
            id: "1",
            username: "Santinal",
            color: "#ff7e79",
            email: "santinal@gmail.com"
        },
        host: {
            id: "1",
            label: "Testing",
            user: {
                id: "1",
                username: "Santinal",
                color: "76d6ff",
                email: "santinal@gmail.com"
            }
        },
        cell: {
            row: 5,
            column: 6,
        }
    },
]);

export const socket: Writable<WebSocket> = writable<WebSocket>(websocket());
