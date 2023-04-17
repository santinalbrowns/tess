<script lang="ts">
	import { cells, socket, user } from '$lib/store';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import websocket from '$lib/socket';
	import Sidebar from '$lib/components/sidebar.svelte';

	export let data: LayoutData;

	const ws = websocket(data.workspace.id, data.token);

	user.set(data.user);

	const tree: Array<Project> = [
		{
			id: '1',
			color: '#ff9300',
			name: 'Get started',
			pages: [
				{
					id: '1',
					name: 'Florida',
					type: 'tasks'
				},
				{
					id: '2',
					name: 'California',
					type: 'tasks'
				}
			]
		},
		{
			id: '1',
			color: '#009193',
			name: 'Tutorial noted',
			pages: [
				{
					id: '1',
					name: 'Florida',
					type: 'tasks'
				},
				{
					id: '2',
					name: 'California',
					type: 'tasks'
				}
			]
		},
	];

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
					cells.update((cell) => {
						const mm = cell.filter((part) => part.user.id !== message.data.user.id);

						return [...mm, message.data];
					});

					break;
				case 'left':
					cells.update((cell) => {
						return cell.filter((part) => part.id !== message.data.id);
					});
					break;
				case 'comb-joined':
					console.log('Comb joined')
					break;
				case 'error':
					console.log(message.data);
					break;
				default:
					break;
			}
		};
	});

	
</script>

<!-- <Sidebar projects={tree} /> -->

<main> <!-- ml-72 -->
	<slot />
</main>
