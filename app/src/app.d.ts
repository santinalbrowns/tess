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

	interface Comb {
		id: string;
        label?: string;
        user: ObjectId
    }

    interface Cell {
		id: string;
        user: User,
        comb: Comb,
        row: number;
        column: number;
    }

	interface User {
		id: string;
        username: string;
        email: string;
        color: string;
    }

    interface Workspace {
		id: string;
        name: string;
        color: string;
    }

    interface Member {
		id: string;
        user: ObjectId;
        workspace: ObjectId;
        role: string;
    }

	interface ClientEventMessage<T = any> {
		token?: string;
        action: ClientEventAction;
        data: T;
    }

    interface ServerEventMessage<T = any> {
        action: ServerEventAction;
        data: T;
    }

	type ClientEventAction = "join" | "host" | "collaborate";
    type ServerEventAction = "joined" | "error" | "status";
}

export { };
