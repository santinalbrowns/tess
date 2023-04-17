<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="bg-slate-100 h-screen">
	<div class="max-w-2xl m-auto space-y-5">
		<div class="pt-10 flex">
			<div class="">Workspaces</div>
		</div>
		<div class="grid grid-cols-3 gap-4">
			{#each data.workspaces as workspace}
				<a href="/{workspace.id}" class="p-4">
					<div class="">
						<div class="">{workspace.name}</div>
					</div>
					<div class="h-1" style="background-color: {workspace.color};"></div>
				</a>
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	a {
		@apply rounded-lg shadow-md bg-white
	}
</style>
