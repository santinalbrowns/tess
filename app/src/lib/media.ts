import { peer } from "./store";

export const addAudioStream = (audioElement: HTMLAudioElement, mediaStream: MediaStream) => {
    audioElement.srcObject = mediaStream;

    audioElement.addEventListener('loadedmetadata', () => {
        audioElement.play();
    });
};

/* export function connect(id: string, mediaStream: MediaStream) {
    peer.subscribe((p) => {
        const call = p.call(id, mediaStream);

        const audio = document.createElement('audio');

        call.on('stream', (st: MediaStream) => {
            addAudioStream(audio, st);
        });

        call.on('close', () => {
            console.log('removed');
            audio.remove();
        });
    });
} */