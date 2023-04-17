<script lang="ts">
	import { createForm } from 'felte';
	import { validateSchema } from '@felte/validator-yup';
	import * as yup from 'yup';
	import reporter from '@felte/reporter-dom';
	import { goto } from '$app/navigation';

	const schema = yup.object({
		email: yup.string().email().required(),
		password: yup.string().required().min(6)
	});

	const { form } = createForm<yup.InferType<typeof schema>>({
		extend: reporter(),
		onSubmit: async ({email, password}, context) => {
			try {
				const response = await fetch('http://localhost:5000/auth', {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify({ email, password })
				});

                const json = await response.json();

                console.log(json);

			} catch (error) {
				console.log(error);
			}
		}
		//validate: (values) => validateSchema(schema)(values)
	});
</script>

<form use:form class="p-16 space-y-3">
	<input
		type="email"
		name="email"
		value="santinal@gmail.com"
		id="email"
		aria-describedby="email-validation"
		placeholder="Email"
	/>
	<div id="email-validation" data-felte-reporter-dom-for="email" aria-live="polite" />

	<input
		type="password"
		name="password"
		value="pass1234"
		id="password"
		aria-describedby="email-validation"
		placeholder="Passowrd"
	/>
	<div id="password-validation" data-felte-reporter-dom-for="password" aria-live="polite" />

	<button class="p-2 bg-blue-500 text-white">Submint</button>
</form>

<style lang="postcss">
	/* .material-symbols-rounded {
		font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48;
	}
 */
	input {
		@apply dark:bg-gray-800 dark:border-gray-600 h-10 px-4 text-gray-600;
	}
</style>
