<script lang="ts">
	import GridCell from './GridCell.svelte';
	import { createEventDispatcher } from 'svelte';

	export let size: number = 20;
	export let participants: Array<Participant>;

	const dispatch = createEventDispatcher();

	const even = (num: number) => {
		return num % 2 === 0;
	};

	const participant = ({ row, column }: { row: number; column: number }) => {
		return participants.find(
			(participant) => participant.cell.row === row && participant.cell.column === column
		);
	};

	const rooms = () => {
		const groups: Record<string, Participant[]> = {};

		participants.forEach((participant) => {
			const { host } = participant;

			if (!groups[host.id]) {
				groups[host.id] = [];
			}
			groups[host.id].push(participant);
		});

		return Object.entries(groups).map(([id, participants]) => ({
			id,
			participants
		}));
	};

	const box = (row: number, column: number) => {
		const roo = rooms();

		const pa = participant({ row, column });

		if (!pa) return undefined;

		const room = roo.find((r) => r.id === pa.host.id);

		if (!room) return undefined;

		const cells = room.participants.map((p) => p.cell);

		const cell = cells.reduce((acc, cur) => {
			if (cur.row < acc.row || (cur.row === acc.row && cur.column < acc.column)) {
				return cur;
			} else {
				return acc;
			}
		});

		if (cell.row === row && cell.column === column) {
			const rows = Array.from(new Set(cells.map((obj) => obj.row)));
			const columns = Array.from(new Set(cells.map((obj) => obj.column)));

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

	const bounds = (row: number, column: number) => {
		if (even(row)) {
			const cell_1: Cell = { row: row - 1, column: column };
			const cell_2: Cell = { row: row - 1, column: column + 1 };
			const cell_3: Cell = { row: row, column: column + 1 };
			const cell_4: Cell = { row: row + 1, column: column + 1 };
			const cell_5: Cell = { row: row + 1, column: column };
			const cell_6: Cell = { row: row, column: column - 1 };

			return [cell_1, cell_2, cell_3, cell_4, cell_5, cell_6];
		} else {
			const cell_1: Cell = { row: row - 1, column: column - 1 };
			const cell_2: Cell = { row: row - 1, column: column };
			const cell_3: Cell = { row: row, column: column + 1 };
			const cell_4: Cell = { row: row + 1, column: column };
			const cell_5: Cell = { row: row + 1, column: column - 1 };
			const cell_6: Cell = { row: row, column: column - 1 };

			return [cell_1, cell_2, cell_3, cell_4, cell_5, cell_6];
		}
	};

	const click = (row: number, column: number) => {
		const cells = bounds(row, column);

		const cell = cells.find((cell) => {
			return participants.some((participant) => {
				if (participant.cell) {
					return cell.row === participant.cell.row && cell.column === participant.cell.column;
				}
			});
		});

		if (cell) {
			const connector = cells.find((cell) =>
				participants.find((p) => cell.row === p.cell?.row && cell.column === p.cell.column)
			);

			if (connector) {
				const linker = participants.find(
					(p) => p.cell?.row === connector.row && p.cell.column === connector.column
				);

				if (linker) {
					//linker.user.id !== $user.id
					if (linker.user.id) {
						dispatch('join', { host: linker.host, cell: { row, column } });
					} else {
						dispatch('join', { host: undefined, cell: { row, column } });
					}
				}
			}
		} else {
			dispatch('join', { host: undefined, cell: { row, column } });
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
						participant={participant({ row, column })}
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
