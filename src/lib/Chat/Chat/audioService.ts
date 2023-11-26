// audioService.ts

type ResponseType = {
    audioData: string;
    text: string;
};

export default {
    audioQueue: [] as HTMLAudioElement[],

    playNextAudio(): void {
        if (this.audioQueue.length === 0) return;
        let audio = this.audioQueue[0];
        if (!audio.paused) return;
        audio.onended = () => {
            this.audioQueue.shift();
            this.playNextAudio();
        };
        audio.play();
    },

    handleAudioData(response: ResponseType): void {
        // Base64文字列をデコード
        let binaryString = atob(response.audioData);
        let len = binaryString.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        let audioBlob = new Blob([bytes.buffer], { type: 'audio/wav' });
        let audioUrl = URL.createObjectURL(audioBlob);
        let audio = new Audio(audioUrl);
        this.audioQueue.push(audio);
        this.playNextAudio();
    }
};
