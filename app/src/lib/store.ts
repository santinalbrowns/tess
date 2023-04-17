import Peer from "peerjs";
import { writable, type Writable } from "svelte/store";

export const cells: Writable<Array<Cell>> = writable<Array<Cell>>([]);

export const socket: Writable<WebSocket> = writable<WebSocket>();

export const user: Writable<User> = writable<User>();

export const stream: Writable<MediaStream> = writable<MediaStream>();
export const inputs: Writable<Array<AudioInput>> = writable<Array<AudioInput>>([]);

export const offline: Writable<boolean> = writable<boolean>(false);
export const connected: Writable<boolean> = writable<boolean>(true);

