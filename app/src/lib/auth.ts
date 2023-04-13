import { fail, redirect } from '@sveltejs/kit';
import { fetch, Body } from '@tauri-apps/api/http';

export const login = async (email: string, password: string) => {

    const response = await fetch('http://localhost:5000/auth', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: Body.json({ email, password })
    });

    const data: any = response.data;

    localStorage.setItem('token', data.token);

    return true;
}

export const user = async () => {

    const token = localStorage.getItem('token');

    try {

        const response = await fetch('http://localhost:5000/me', {
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