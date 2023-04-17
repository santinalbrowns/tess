<script lang="ts">
	import Grid from '$lib/components/Hive.svelte';
	import { inputs, socket, stream } from '$lib/store';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Peer from 'peerjs';
	import Appbar from '$lib/components/appbar.svelte';
	import { page } from '$app/stores';
	import { addAudioStream } from '$lib/media';

	export let data: PageData;

	const peer: Peer = new Peer();
	const peers: any = {}
	

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

		peers[id] = call;
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

	const onJoin = (e: CustomEvent<{ comb: any; row: number; column: number, peer: string }>) => {
		let message: ClientEventMessage;

		populateDevices();

		if (e.detail.comb) {
			connect(e.detail.peer, $stream);

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
					topic: data.workspace.id,
					peer: peer.id
				}
			};
		}

		/* My audio */
		const audio = document.createElement("audio");
		audio.muted = false;

		addAudioStream(audio, $stream);

		$socket.send(JSON.stringify(message));

	};

	const onLeave = (e: CustomEvent<{ id: string }>) => {
		

		const message: ClientEventMessage = {
			action: 'leave',
			token: data.token,
			data: {
				id: e.detail.id,
				topic: data.workspace.id
			}
		};

		$socket.send(JSON.stringify(message));

		peer.disconnect();

		close();
	};

	function close() {
		if ($stream) {
			$stream.getTracks().forEach((track) => {
				track.stop();
			});
		}
	}

	async function getUserMedia() {
		stream.set(await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false
		}));

		$stream.getTracks().forEach((track) => {
			track.onended = () => {
				console.log('Track ended');
			};
		});
	}

	async function ondevicechange() {
		close();
		await getUserMedia();
	}

	function populateDevices() {
		const devices = document.getElementById('device-list');

		if (!devices) return;

		devices.onchange = () => {
			ondevicechange();
		};

		navigator.mediaDevices
			.getUserMedia({
				audio: true
			})
			.then((strm) => {
				const audio = strm.getAudioTracks()[0];

				navigator.mediaDevices
					.enumerateDevices()
					.then((devs) => {
						devs
							.filter((d) => d.kind === 'audioinput')
							.forEach((dev) => {

								const device: AudioInput = {
									id: dev.deviceId,
									name: dev.label
								};

								inputs.update(input => {
									return [...input, device]
								});

								const d = document.createElement('option');
								d.value = dev.deviceId;
								d.innerText = dev.label;

								devices.appendChild(d);
							});
					})
					.then(() => {
						audio.stop();
						ondevicechange();
					});
			});
	}

	onMount(() => {
		populateDevices();
	});
</script>

<section class="overflow-hidden">
	<!-- <Appbar>
		<div class="flex items-center space-x-4">
			<select id="device-list" />
		</div>
	</Appbar> -->
	<div class="w-full">
		<Grid on:join={onJoin} on:leave={onLeave} />
	</div>
</section>
