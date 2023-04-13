<script lang="ts">
	import { socket } from '$lib/store';
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;

    const message: ClientEventMessage = {
        token: data.token,
        action: "collaborate",
        data: data.workspace.id,
    }

    $socket.send(JSON.stringify(message));
</script>

<slot/>