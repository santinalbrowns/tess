<script lang="ts">
	import type { PageData } from './$types';
    
    export let data: PageData;
</script>


<div class="grid grid-cols-4 gap-4 p-3">
	{#each data.workspaces as workspace}
		<a href="/{workspace.id}" class="p-4" style="background-color: {workspace.color};">
			<div class="">
				<div class="">{workspace.name}</div>
			</div>
		</a>
	{/each}
</div>

<a href="/data">hello</a>