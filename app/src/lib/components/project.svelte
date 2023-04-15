<script lang="ts">
	export let project: IProject;
</script>

{#if project.pages}
	{#each project.pages as page}
		<div class="">
			{#if page.type === 'tasks'}
				<span class="material-symbols-rounded">people</span>
			{/if}

            <span>{project.name}</span>
		</div>
	{/each}
    {:else}
    <span>{project.name}</span>
{/if}
