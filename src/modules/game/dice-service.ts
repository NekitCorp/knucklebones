import { writable } from 'svelte/store';
import type { DiceValue } from './types';
import { randomNumber } from './utils';

type State = { type: 'rolling' } | { type: 'stopped'; value: DiceValue };

export class DiceService {
    constructor(private rollTime: number = 3000) {}

    public state = writable<State>({ type: 'rolling' });

    public setRollingState() {
        this.state.set({ type: 'rolling' });
    }

    public setValue(value: DiceValue) {
        this.state.set({ type: 'stopped', value });
    }

    public roll(callback: (value: DiceValue) => void) {
        this.setRollingState();

        setTimeout(() => {
            const value = randomNumber(1, 6) as DiceValue;
            this.state.set({ type: 'stopped', value });
            callback(value);
        }, this.rollTime);
    }
}
