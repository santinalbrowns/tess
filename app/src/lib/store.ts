import { writable, type Writable } from "svelte/store";

export const participants: Writable<Array<Participant>> = writable<Array<Participant>>([
    {
        id: "1",
        user: {
            id: "1",
            username: "Santinal",
            color: "#1f8fce",
            email: "santinal@gmail.com"
        },
        host: {
            id: "1",
            label: "Testing",
            user: {
                id: "1",
                username: "Santinal",
                color: "76d6ff",
                email: "santinal@gmail.com"
            }
        },
        cell: {
            row: 5,
            column: 5,
        }
    },
    {
        id: "1",
        user: {
            id: "1",
            username: "Santinal",
            color: "#1f8fce",
            email: "santinal@gmail.com"
        },
        host: {
            id: "1",
            label: "Testing",
            user: {
                id: "1",
                username: "Santinal",
                color: "76d6ff",
                email: "santinal@gmail.com"
            }
        },
        cell: {
            row: 5,
            column: 6,
        }
    },
]);