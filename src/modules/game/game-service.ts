import { useMachine } from '@xstate/svelte';
import { createGameMachine } from './game-machine';
import type { GameEvent, GameState, Player } from './types';

export class GameService {
    public readonly state: GameState;
    public readonly send: (event: GameEvent) => void;

    constructor(public player: Player) {
        const { state, send, service } = useMachine(createGameMachine(player));

        this.state = state as unknown as GameState;
        this.send = send;

        service.onTransition((state) => {
            console.log('[GAME STATE]', state);
        });
    }
}
