import { Howl } from 'howler';

class SoundService {
    private readonly diceSound = new Howl({ src: ['dice.mp3'] });
    private readonly clickSound = new Howl({ src: ['click.mp3'] });
    private readonly tadaSound = new Howl({ src: ['tada.mp3'] });
    private readonly destroySound = new Howl({ src: ['destroy.ogg'] });

    playDice() {
        this.diceSound.play();
    }

    playClick() {
        this.clickSound.play();
    }

    playTada() {
        this.tadaSound.play();
    }

    playDestroy() {
        this.destroySound.play();
    }
}

export const soundService = new SoundService();
