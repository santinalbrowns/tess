<script lang="ts">
	import { cells, user } from '$lib/store';
	import GridCell from './GridCell.svelte';
	import { createEventDispatcher } from 'svelte';

	export let size: number = 20;

	const dispatch = createEventDispatcher();

	const even = (num: number) => {
		return num % 2 === 0;
	};

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

	const box = (row: number, column: number) => {
		const roo = rooms();

		const pa = $cells.find((cell) => cell.row === row && cell.column === column);

		if (!pa) return undefined;

		const room = roo.find((r) => r.id === pa.comb.id);

		if (!room) return undefined;

		const item_cells = room.cells.map((p) => {
			return {
				row: p.row,
				column: p.column
			};
		});

		const cell = item_cells.reduce((acc, cur) => {
			if (cur.row < acc.row || (cur.row === acc.row && cur.column < acc.column)) {
				return cur;
			} else {
				return acc;
			}
		});

		if (cell.row === row && cell.column === column) {
			const rows = Array.from(new Set(item_cells.map((obj) => obj.row)));
			const columns = Array.from(new Set(item_cells.map((obj) => obj.column)));

			//console.log(even(rows[rows.length - 1]), rows[rows.length - 1])

			const w = 56 * columns.length + (2.5 * columns.length - 2.5) + 28;

			//even(columns[columns.length - 1]) ? w - 28 - 2.5 :


			const cms = item_cells.filter(d => even(d.row));

			console.log(cms);
			
			const box = {
				width: w,
				height: 50.5 * rows.length + 13.5 + 20,
				top: -10,
				left: -14
			};

			return box;
		}

		return undefined;
	};

	function location() {
		const cell = $cells.find((cell) => cell.user.id === $user.id);

		const het = document.getElementById('het');

		if (het && cell) {
			if (cell) {
				const width = cell.column * 53;
				const height = cell.row * 53;
				const top = het.offsetHeight / 2;
				const left = het.offsetLeft / 2;

				het.scrollTo({
					top: height - top + 25,
					left: width + left - 53 * 3,
					behavior: 'smooth'
				});
			}
		}
	}

	const getBounds = (row: number, column: number) => {
		if (even(row)) {
			const cell_1 = { row: row - 1, column: column };
			const cell_2 = { row: row - 1, column: column + 1 };
			const cell_3 = { row: row, column: column + 1 };
			const cell_4 = { row: row + 1, column: column + 1 };
			const cell_5 = { row: row + 1, column: column };
			const cell_6 = { row: row, column: column - 1 };

			return [cell_1, cell_2, cell_3, cell_4, cell_5, cell_6];
		} else {
			const cell_1 = { row: row - 1, column: column - 1 };
			const cell_2 = { row: row - 1, column: column };
			const cell_3 = { row: row, column: column + 1 };
			const cell_4 = { row: row + 1, column: column };
			const cell_5 = { row: row + 1, column: column - 1 };
			const cell_6 = { row: row, column: column - 1 };

			return [cell_1, cell_2, cell_3, cell_4, cell_5, cell_6];
		}
	};

	const click = (row: number, column: number) => {
		const boundaries = getBounds(row, column);

		const participant = boundaries.find((cell) => {
			return $cells.some((participant) => {
				return cell.row === participant.row && cell.column === participant.column;
			});
		});

		if (participant) {
			const connector = boundaries.find((cell) =>
				$cells.find((p) => cell.row === p?.row && cell.column === p.column)
			);

			if (connector) {
				const linker = $cells.find(
					(cell) => cell.row == connector.row && cell.column == connector.column
				);

				if (linker) {
					if (linker.user.id !== $user.id) {
						dispatch('join', { comb: linker.comb.id, row: row, column: column });
					} else {
						dispatch('join', { comb: undefined, row: row, column: column });
					}
				}
			}
		} else {
			dispatch('join', { comb: undefined, row: row, column: column });
		}
	};

	function onLeave() {
		const participant = $cells.find((participant) => participant.user.id === $user.id);

		if (participant) {
			dispatch('leave', { id: participant.id });
		}
	}
</script>

<section class="hive relative">
	<div
		id="het"
		class="box-border h-full w-full overflow-x-auto overflow-y-auto flex flex-col flex-1 justify-center items-center"
	>
	<!-- style="margin-left: -55.5px; margin-top: -56px;" -->
		<div class="max-w-full max-h-full" style="margin-left: -55.5px; margin-top: -56px;">
			{#each Array.from({ length: size }) as index, row}
				<div
					class="row"
					class:first={row === 0}
					class:even={even(row)}
					style="grid-template-columns: repeat({size}, 56px);"
				>
					{#each Array.from({ length: size }) as co, column}
						<div class="column">
							<GridCell
								cell={$cells.find((cell) => cell.row === row && cell.column === column)}
								on:click={() => click(row, column)}
								
							/>
						</div>
					{/each}
				</div>
			{/each}
		</div>

		<div
			class="absolute bg-slate-500 bottom-0 left-0 w-full flex justify-center items-center"
			style="z-index: 100;"
		>
			<nav class="-top-16 absolute flex items-center space-x-1">
				{#if $cells.some((participant) => participant.user.id === $user.id)}
					<div class="bg-blue-900 h-12 flex items-center bg-opacity-25 px-3 rounded-3xl">
						<ul class="list-none flex space-x-3">
							<!-- <li>
								<button class="w-8 h-8 bg-gray-600 rounded-full flex justify-center items-center">
									<span class="material-symbols-rounded !text-base text-gray-100"> mic </span>
								</button>
							</li> -->
							<!-- <li>
								<a
									href="/chats"
									class="w-8 h-8 bg-gray-600 rounded-full flex justify-center items-center"
								>
									<span class="material-symbols-rounded !text-base text-gray-100">chat</span>
								</a>
							</li> -->
							<li>
								<button
									on:click={location}
									class="w-8 h-8 bg-gray-500 rounded-full flex justify-center items-center"
								>
									<span class="material-symbols-rounded !text-base text-gray-100">my_location</span>
								</button>
							</li>

							<li>
								<button
									on:click={onLeave}
									class="w-10 h-8 bg-red-500 rounded-full flex justify-center items-center"
								>
									<span class="material-symbols-rounded !text-base text-gray-100">call_end</span>
								</button>
							</li>
						</ul>
					</div>
				{/if}
			</nav>
		</div>
	</div>
</section>

<style lang="postcss">
	.hive {
		height: calc(100vh - 56px);
		@apply bg-gray-100 bg-opacity-60 dark:bg-gray-800 flex-col relative flex justify-center items-center;
	}
	.row {
		display: grid;
		gap: 2.5px;
		margin-top: -13.5px;
	}
	.column {
	}

	.even {
		margin-left: 29.5px;
	}

	.first {
		margin-top: 0;
	}

	.material-symbols-rounded {
		font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' -25, 'opsz' 48;
	}
</style>
