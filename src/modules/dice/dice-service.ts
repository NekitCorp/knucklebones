import { writable } from 'svelte/store';
import type { DiceValue } from '../game/types';
import { randomNumber } from '../game/utils';

export class DiceService {
    public state = writable<{ value: DiceValue }>({ value: 6 });

    public setValue(value: DiceValue) {
        this.state.set({ value });
    }

    public roll(callback: (value: DiceValue) => void) {
        const value = this.random;
        this.state.set({ value });
        callback(value);
    }

    private get random() {
        return randomNumber(1, 6) as DiceValue;
    }
}
