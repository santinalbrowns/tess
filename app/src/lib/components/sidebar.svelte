<script lang="ts">
	import { connected, offline } from '$lib/store';
	import Project from './project.svelte';
	import Projects from './projects.svelte';

	export let projects: any = [];
</script>

<aside
	class="fixed w-72 bg-gray-50 border-r border-r-gray-100 left-0 top-0 h-screen flex flex-col select-none"
>
	<!-- Drag area zone -->
	<div data-tauri-drag-region class="h-8 w-full" />

	<div class="px-5 pb-3 space-y-4">
		<div class="flex items-center justify-between">
			<!-- Active workspace -->
			<div class="flex items-center space-x-2">
				<div
					class:!bg-yellow-500={$offline}
					class="w-7 h-7 flex justify-center items-center text-gray-200 text-sm bg-sky-600 rounded-full"
				>
					{#if !$offline}
						<span>C</span>
					{:else}
						<span class="material-symbols-rounded !text-sm text-black"
							>signal_wifi_statusbar_not_connected</span
						>
					{/if}
				</div>
				<div class="text-sm h-10 flex flex-col justify-center dark:text-gray-200">
					<span>Community</span>
					{#if $offline}
						<div class="flex items-center space-x-1 text-xs">
							<div class="w-2 h-2 bg-sky-600 rounded-full" id="wifi-icon" />
							<span class="text-xs text-slate-500">waiting for network</span>
						</div>
					{:else if !$connected}
						<div class="flex items-center space-x-1 text-xs">
							<div class="w-2 h-2 bg-sky-600 rounded-full" id="wifi-icon" />
							<span class="text-xs text-slate-500">Connecting...</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Dropdown button-->
			<button class="hidden items-center justify-center rounded-md bg-gray-200">
				<span class="material-symbols-rounded">expand_more</span>
			</button>
		</div>
		<!-- Search bar -->
		<div class="hidden space-x-5 items-center justify-between">
			<div class="relative flex items-center flex-1">
				<label for="query" class="absolute left-2 top-1.5">
					<span class="material-symbols-rounded !text-base text-slate-500">search</span>
				</label>
				<input
					type="search"
					name="query"
					id="query"
					placeholder="Search..."
					class="dark:bg-background-light w-full px-2 pl-7 py-1.5 rounded-lg text-sm text-slate-300"
				/>
			</div>
		</div>

		<!-- Projects -->

		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<div class="flex">
					<span class="uppercase text-gray-500 text-xs">Projects</span>
				</div>
			</div>

			<ul>
				<li>
					<button
						class="flex items-center justify-between relative hover:bg-gray-300 hover:bg-opacity-40 w-full px-2 py-1 rounded-lg"
					>
						<div
							class="absolute group/edit invisible group-hover/item:visible"
							style="left: -10px; top: 5px;"
						>
							<span class="arrow text-gray-400" style="font-size: 8px;">&#x25b6</span>
						</div>
						<a href="#/" class="flex items-center space-x-2">
							<div
								class="h-5 w-5 text-white bg-gray-200 rounded-md text-xs flex items-center justify-center"
								style="border-radius: 5px"
							>
								<span class="material-symbols-rounded  text-gray-500 !text-base"> view_cozy </span>
							</div>
							<span class="text-gray-800">Everything</span>
						</a>

						<button
							class="group/edit group-hover/item:visible invisible px-2 flex justify-center items-center rounded-md text-gray-500 hover:scale-125"
						>
							<span class="material-symbols-rounded !text-xl"> more_horiz </span>
						</button>
					</button>
				</li>
				{#each projects as project}
					<li><Projects {project} /></li>
				{/each}
			</ul>
		</div>
	</div>
</aside>

<style lang="postcss">
	.material-symbols-rounded {
		font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;

		@apply text-lg;
	}
</style>
