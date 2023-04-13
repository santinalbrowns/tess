<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import { participants, socket } from '$lib/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const onJoin = (e: CustomEvent<{ host: any; cell: Cell }>) => {
		let message: ClientEventMessage;

		if (e.detail.host) {
			message = { token: data.token, action: 'join', data: e.detail };
		} else {
			message = { token: data.token, action: 'host', data: e.detail };
		}

		$socket.send(JSON.stringify(message));
	};
</script>

<Grid on:join={onJoin} participants={$participants} />
