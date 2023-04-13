<script lang="ts">
	import { cells } from '$lib/store';
	import GridCell from './GridCell.svelte';
	import { createEventDispatcher } from 'svelte';

	export let size: number = 20;

	const dispatch = createEventDispatcher();

	const even = (num: number) => {
		return num % 2 === 0;
	};

	const getCell = ({ row, column }: { row: number; column: number }) => {
		return $cells.find((cell) => cell.row === row && cell.column === column);
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
				boundaries.find((p) => cell.row === p?.row && cell.column === p.column)
			);

			if (connector) {
				const linker = boundaries.find(
					(p) => p?.row === connector.row && p.column === connector.column
				);

				if (linker) {
					//linker.user.id !== $user.id
					/* if (linker) {
						dispatch('join', { host: linker.host, cell: { row, column } });
					} else {
						dispatch('join', { host: undefined, cell: { row, column } });
					} */
				}
			}
		} else {
			dispatch('join', { comb: undefined, row: row, column: column });
		}
	};
</script>

<div class="grid">
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
						box={box(row, column)}
						on:click={() => click(row, column)}
					/>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style lang="postcss">
	.grid {
		@apply bg-gray-100;
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
</style>
