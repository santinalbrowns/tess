import type { PageLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
//import { fetch, Body } from '@tauri-apps/api/http';

/* const user = async () => {

    const token = localStorage.getItem('token');

    try {

        const response = await fetch('http://localhost:5000/api/data', {
            method: 'GET',
            headers: {
                'content-type': 'text',
                'authorization': `bearer ${token}`
            },
        });

        console.log(response.headers)
        const data: any = response;


        return data;

    } catch (error) {
        console.log(error);
    }
} */

export const load = (async ({ fetch }) => {

    const response = await fetch('http://localhost:5000/api/data', {
        mode: "cors",
        referrerPolicy: "strict-origin-when-cross-origin",
        referrer: "http://localhost:5000"
    });

    return {};
}) satisfies PageLoad;