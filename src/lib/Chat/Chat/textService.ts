type CallbackType = (char: string) => void;

export default {
    index: 0,

    addCharacter(text: string, type: string, callback: CallbackType): void {
        if (this.index < text.length) {
            let char = text.charAt(this.index);
            this.index++;

            callback(char === '\n' ? "\n" : char);

            setTimeout(() => this.addCharacter(text, type, callback), 500);
        }
    }
};
