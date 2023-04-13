import type { LayoutLoad } from './$types';
import * as workspace from '$lib/workspace';

export const load = (async ({ params }) => {

    const token = localStorage.getItem('token');

    return {
        token: token || undefined,
        workspace: workspace.get(params.id),
    };
}) satisfies LayoutLoad;