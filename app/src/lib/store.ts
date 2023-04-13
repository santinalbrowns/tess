import { writable, type Writable } from "svelte/store";

export const cells: Writable<Array<Cell>> = writable<Array<Cell>>([]);

export const socket: Writable<WebSocket> = writable<WebSocket>();
