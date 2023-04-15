<script>
</script>

<header
	data-tauri-drag-region
	class="h-14 flex w-full items-center px-4 border-b border-b-gray-100 justify-between"
>
	<!-- <ul class="space-y-0.5 text-gray-500 dark:text-gray-400">
		<li>
			<a
				href="/chats"
				class="flex items-center px-2 py-0.5 justify-center rounded-md space-x-1 active"
			>
			<span class="material-symbols-rounded !text-base">group</span>
				<span class="text-sm">People</span>
			</a>
		</li>
		<li>
			<a
				href="/chats"
				class="flex items-center px-2 py-0.5 justify-center rounded-md space-x-1 active"
			>
				<span class="material-symbols-rounded !text-base">settings</span>
				<span class="text-sm">Chat</span>
			</a>
		</li>
	</ul>

	<ul>
		<li>
			<button>
				<span class="material-symbols-rounded">call</span>
			</button>
		</li>
	</ul> -->

	<slot/>
</header>

<!-- <style lang="postcss">
	li {
		@apply inline-block;
	}
	.active {
		@apply bg-white dark:bg-background-light dark:text-gray-200;
	}

	.material-symbols-rounded {
		font-variation-settings: 'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 24;
	}

	ion-icon {
		color: blue;
	}
</style> -->
