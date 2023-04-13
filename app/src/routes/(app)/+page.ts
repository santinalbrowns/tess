import { workspaces } from '$lib/workspace';
import type { PageLoad } from './$types';

export const load = (async () => {
    return {
        workspaces: workspaces()
    };
}) satisfies PageLoad;