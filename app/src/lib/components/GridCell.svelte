<script lang="ts">
	export let cell: Cell | undefined = undefined;
	export let box: Box | undefined = undefined;
</script>

{#if cell}
	<div class="cell flex justify-center items-center relative">
		{#if box}
			<!--  left: -10px; top: -10px; margin-left: -1.25px; margin-top: -1.5px; -->
			<div
				class="bg-sky-500 group/edit bg-opacity-20 absolute rounded-3xl"
				style="width: {box.width}px; height: {box.height}px; z-index: 1; left: {box.left}px; top: {box.top}px;"
			>
				{#if cell.comb.label}
					<div class="absolute -top-7 left-1 bg-sky-500 text-xs px-3 py-1 rounded-lg text-white">
						{cell.comb.label}
					</div>
				{/if}
			</div>
		{/if}

		<div
			class="absolute h-12 w-12 rounded-full"
			style="z-index: 99; background-color: {cell.user.color};"
		/>
	</div>
{:else}
	<div class="cell flex group/item justify-center items-center relative">
		<button
			on:click
			class="absolute opacity-0 group/edit group-hover/item:opacity-100 h-12 w-12 bg-sky-500 bg-opacity-50 border-2 border-sky-500 rounded-full transition-opacity duration-500"
			style="z-index: 99;"
		/>
	</div>
{/if}

<style lang="postcss">
	.cell {
		position: relative;
		height: 64px;
	}

	.cell:before {
		content: '';
		width: 100%;
		height: 100%;
		clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
		@apply bg-white;
	}
</style>
