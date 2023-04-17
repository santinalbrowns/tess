// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User;
		}
		// interface PageData {}
		// interface Platform {}
	}

	interface User {
		id: string;
        username: string;
        email: string;
        color: string;
	}
}

export {};
