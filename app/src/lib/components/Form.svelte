<script lang="ts">
	export let current: string;

	let data = {
		email: '',
		password: ''
	};
</script>

<form>
	{#if current === 'email'}
		<input type="email" bind:value={data.email} name="email" id="email" />
	{:else if current === 'password'}
		<input type="email" bind:value={data.password} name="email" id="email" />
	{/if}
</form>
