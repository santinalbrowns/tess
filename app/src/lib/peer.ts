import Peer from 'peerjs';

const peer = new Peer({
    host: "localhost",
    port: 443,
    path: "/app",
});

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
            //stream.set(mediaStream);
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
        //call.answer($stream);

        const audio = document.createElement('audio');

        call.on('stream', (userStream) => {
            addAudioStream(audio, userStream);
        });
    }
});