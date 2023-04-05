<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import { participants } from '$lib/store';

	const onJoin = (e: CustomEvent) => {
		console.log(e.detail);
	};
</script>

<Grid on:join={onJoin} participants={$participants} />
