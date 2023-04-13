import { redirect } from "@sveltejs/kit";
import { fetch, Body } from '@tauri-apps/api/http';

export const workspaces = async () => {

    const token = localStorage.getItem('token');

    if(!token) throw redirect(303, '/signin');

    try {

        const response = await fetch('http://localhost:5000/workspaces', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${token}`
            },
        });

        const data: any = response.data;

        return data as Array<Workspace>;

    } catch (error) {
        throw redirect(303, '/signin');
    }
}

export const workspace = async () => {

    const token = localStorage.getItem('token');
    const workspace = localStorage.getItem('workspace');

    if(!workspace) {
        throw redirect(302, '/workspaces');
    }

    try {

        const space = JSON.parse(workspace);

        const response = await fetch(`http://localhost:5000/workspaces/${space.id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${token}`
            },
        });

        const data: any = response.data;


        return data as User;

    } catch (error) {
        throw redirect(303, '/signin');
    }
}

export const get = async (id: string) => {

    const token = localStorage.getItem('token');

    try {

        const response = await fetch(`http://localhost:5000/workspaces/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `bearer ${token}`
            },
        });

        const data: any = response.data;


        return data as User;

    } catch (error) {
        throw redirect(303, '/signin');
    }
}