import { user } from '$lib/auth';
import type { LayoutLoad } from './$types';

export const load = (async () => {
    return {
        user: user(),
    };
}) satisfies LayoutLoad;