<script lang="ts">
	import Grid from '$lib/components/Hive.svelte';
	import { cells, socket } from '$lib/store';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const onJoin = (e: CustomEvent<{ comb: any; row: number; column: number }>) => {
		let message: ClientEventMessage;

		if (e.detail.comb) {
			message = {
				token: data.token,
				action: 'join',
				data: {
					...e.detail,
					topic: data.workspace.id
				}
			};
		} else {
			message = {
				token: data.token,
				action: 'host',
				data: {
					...e.detail,
					topic: data.workspace.id
				}
			};
		}

		$socket.send(JSON.stringify(message));
	};
</script>

<Grid on:join={onJoin} />
