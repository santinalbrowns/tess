import { ObjectId } from "mongoose";


declare global {

    interface User {
        username: string;
        email: string;
        password: string;
        color: string;
    }

    interface Workspace {
        name: string;
        color: string;
    }

    interface Member {
        user: ObjectId;
        workspace: ObjectId;
        role: string;
    }

    interface Comb {
        label?: string;
        user: ObjectId
        workspace: ObjectId;
    }

    interface Cell {
        user: ObjectId,
        comb: ObjectId,
        row: number;
        column: number;
    }

    interface ClientEvent<T = any> {
        token: string;
        action: ClientEventAction;
        data: T;
    }

    interface ServerEvent<T = any> {
        action: ServerEventAction,
        data: T;
    }

    type ClientEventAction = "join" | "host" | "collaborate";
    type ServerEventAction = "joined" | "error" | "status";


}

export { };