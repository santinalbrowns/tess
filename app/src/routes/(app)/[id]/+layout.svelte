<script lang="ts">
	import { cells, socket } from '$lib/store';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import websocket from '$lib/socket';

	export let data: LayoutData;

	const ws = websocket(data.workspace.id, data.token);

	onMount(() => {
		ws.onopen = (e) => {
			const message: ClientEventMessage = {
				token: data.token,
				action: 'collaborate',
				data: data.workspace.id
			};

			ws.send(JSON.stringify(message));

			socket.set(ws);
		};

		ws.onmessage = (e) => {
			const message: ServerEventMessage = JSON.parse(e.data);

			switch (message.action) {
				case 'status':
					cells.set(message.data.cells);
					break;

				case 'joined':

                    cells.update(cell => {

                        const mm = cell.filter((part) => part.user.id !== message.data.user.id);

                        return [...mm, message.data]
                    })

					break;
				case 'error':
					
					break;
				default:
					break;
			}
		};
	});

	//socket.set(ws);
</script>

<slot />
