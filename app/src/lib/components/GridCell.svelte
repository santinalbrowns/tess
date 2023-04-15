<script lang="ts">
	import { cells } from '$lib/store';

	export let cell: Cell | undefined = undefined;
	let box: Box | undefined = undefined;

	const rooms = () => {
		const groups: Record<string, Cell[]> = {};

		$cells.forEach((cell) => {
			const { comb } = cell;

			if (!groups[comb.id]) {
				groups[comb.id] = [];
			}
			groups[comb.id].push(cell);
		});

		return Object.entries(groups).map(([id, cells]) => ({
			id,
			cells
		}));
	};

	cells.subscribe((ce) => {
		if (cell) {
			const row = cell.row;
			const column = cell.column;

			const pa = $cells.find((c) => c.id === cell?.id);

			if (pa) {
				const roo = rooms();

				const room = roo.find((r) => r.id === pa.comb.id);

				if (room) {
					const item_cells = room.cells.map((p) => {
						return {
							row: p.row,
							column: p.column
						};
					});

					const first = item_cells.reduce((acc, cur) => {
						if (cur.row < acc.row || (cur.row === acc.row && cur.column < acc.column)) {
							return cur;
						} else {
							return acc;
						}
					});

					if (first.row === row && first.column === column) {
						const rows = Array.from(new Set(item_cells.map((obj) => obj.row)));
						const columns = Array.from(new Set(item_cells.map((obj) => obj.column)));

						const w = 56 * columns.length + (2.5 * columns.length - 2.5) + 28;

						box = {
							width: w,
							height: 50.5 * rows.length + 13.5 + 20,
							top: -10,
							left: -14
						};
					}
				}
			}
		}
	});
</script>

{#if cell}
	<div class="cell flex justify-center items-center relative">
		{#if box}
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
			class="absolute h-12 w-12 rounded-full flex justify-center items-center"
			style="z-index: 99; background-color: {cell.user.color};"
		>
			<span class="text-white">{cell.user.email.charAt(0).toLocaleUpperCase()}</span>
		</div>
	</div>
{:else}
	<div class="cell flex group/item justify-center items-center relative">
		<button
			on:click
			class="absolute opacity-0 group/edit group-hover/item:opacity-100 h-12 w-12 bg-sky-500 bg-opacity-50 border-2 border-sky-500 rounded-full transition-opacity duration-500"
			style="z-index: 10;"
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
		@apply bg-white dark:bg-gray-900;
	}
</style>
