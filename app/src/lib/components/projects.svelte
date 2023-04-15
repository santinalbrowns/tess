<script context="module">
	// retain module scoped expansion state for each tree node
	const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	};
</script>

<script lang="ts">
	import { slide } from 'svelte/transition';
	export let project: Project;

	const { name, pages } = project;

	// @ts-ignore
	let expanded = _expansionState[name] || false;

	const toggleExpansion = () => {
		// @ts-ignore
		expanded = _expansionState[name] = !expanded;
	};
	$: arrowDown = expanded;
</script>

<ul>
	<!-- transition:slide -->
	<li>
		{#if pages}
			<div class=" text-sm group/item">
				<button
					on:click={toggleExpansion}
					class="flex items-center justify-between relative hover:bg-gray-300 hover:bg-opacity-40 w-full px-2 py-1 rounded-lg"
				>
					<div
						class="absolute group/edit invisible group-hover/item:visible"
						style="left: -10px; top: 5px;"
					>
						<span class="arrow text-gray-400" class:arrowDown style="font-size: 8px;">&#x25b6</span>
					</div>
					<a href="#/" class="flex items-center space-x-2">
						<div
							class="h-5 w-5 text-white rounded-md text-xs flex items-center justify-center"
							style="background-color: {project.color}; border-radius: 5px"
						>
							<span>{name.charAt(0).toUpperCase()}</span>
						</div>
						<span class="text-gray-800">{name}</span>
					</a>

					<button class="group/edit group-hover/item:visible invisible px-2 flex justify-center items-center rounded-md text-gray-500  hover:scale-125">
						<span class="material-symbols-rounded !text-xl"> more_horiz </span>
					</button>
				</button>
				{#if expanded}
					<div class="">
						{#each pages as page}
							<div class="pl-6 flex items-center space-x-2 text-sm">
								{#if page.type === 'tasks'}
									<span class="material-symbols-rounded text-gray-400">format_list_bulleted</span>
								{/if}

								<span>{page.name}</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<span>
				<span class="no-arrow" />
				{name}
			</span>
		{/if}
	</li>
</ul>

<style lang="postcss">
	.arrow {
		cursor: pointer;
		display: inline-block;
		transition: transform 200ms;
	}
	.arrowDown {
		transform: rotate(90deg);
	}

	.material-symbols-rounded {
		font-variation-settings: 'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24;

		@apply text-lg;
	}
</style>
