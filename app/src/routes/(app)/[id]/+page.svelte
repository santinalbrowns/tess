<script lang="ts">
	import Grid from '$lib/components/Hive.svelte';
	import { socket, stream } from '$lib/store';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Peer from 'peerjs';
	import Appbar from '$lib/components/appbar.svelte';
	import { page } from '$app/stores';

	export let data: PageData;

	const peer = new Peer();

	const addAudioStream = (audioElement: HTMLAudioElement, mediaStream: MediaStream) => {
		audioElement.srcObject = mediaStream;

		audioElement.addEventListener('loadedmetadata', () => {
			audioElement.play();
		});
	};

	function getStream() {
		navigator.mediaDevices
			.getUserMedia({ video: false, audio: true })
			.then((mediaStream) => {
				//localStream.set(stream);
				stream.set(mediaStream);
			})
			.catch((err) => {
				console.error(`You got an error: ${err}`);
			});
	}

	function connect(id: string, mediaStream: MediaStream) {
		const call = peer.call(id, mediaStream);

		const audio = document.createElement('audio');

		call.on('stream', (st: MediaStream) => {
			addAudioStream(audio, st);
		});

		call.on('close', () => {
			console.log('removed');
			audio.remove();
		});

		//peers[id] = call;
	}

	peer.on('call', (call) => {
		const answer = confirm('Do you want to answer?');

		if (answer) {
			call.answer($stream);

			const audio = document.createElement('audio');

			call.on('stream', (userStream) => {
				addAudioStream(audio, userStream);
			});
		}
	});

	const onJoin = (e: CustomEvent<{ comb: any; row: number; column: number }>) => {
		let message: ClientEventMessage;

		if (e.detail.comb) {
			navigator.mediaDevices
				.getUserMedia({ video: false, audio: true })
				.then((mediaStream) => {
					//localStream.set(stream);
					stream.set(mediaStream);
					connect(e.detail.comb, mediaStream);
				})
				.catch((err) => {
					console.error(`You got an error: ${err}`);
				});

			message = {
				token: data.token,
				action: 'join',
				data: {
					...e.detail,
					topic: data.workspace.id
				}
			};
		} else {
			message = {
				token: data.token,
				action: 'host',
				data: {
					...e.detail,
					topic: data.workspace.id
				}
			};
		}

		$socket.send(JSON.stringify(message));
	};

	const onLeave = (e: CustomEvent<{ id: string }>) => {
		peer.disconnect();

		const message: ClientEventMessage = {
			action: 'leave',
			token: data.token,
			data: {
				id: e.detail.id,
				topic: data.workspace.id
			}
		};

		$socket.send(JSON.stringify(message));
	};

	onMount(() => {
		getStream();
	});
</script>



<section class="overflow-hidden">
	<Appbar>
		<div class="flex items-center space-x-4">
			
		</div>
	</Appbar>
	<div class="w-full">
		<Grid on:join={onJoin} on:leave={onLeave} />
	</div>
</section>

