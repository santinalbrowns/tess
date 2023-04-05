// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface Room {
		id: string;
		participants: Array<Participant>;
	}

	interface Box {
		width: number;
		height: number;
		top: number;
		left: number
	}

	interface Cell {
		row: number;
		column: number;
	}

	interface User {
		id: string;
		username: string;
		email: string;
		color: string;
	}

	interface Participant {
		id: string
		user: User,
		host: {
			id: string;
			label?: string;
			user: User;
		},
		cell: {
			row: number;
			column: number;
		};
	}
}

export { };
