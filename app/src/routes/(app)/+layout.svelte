<script lang="ts">
	import { socket } from '$lib/store';
	import type { LayoutData } from './$types';
	//import { socket } from '$lib/socket';

	export let data: LayoutData;
</script>

<slot />
