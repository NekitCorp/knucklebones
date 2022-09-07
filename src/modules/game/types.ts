import type { Readable } from 'svelte/store';
import type { Event, State } from 'xstate';

export type Player = 1 | 2;
export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
export type Cell = DiceValue | null;
export type BoardLine = [Cell, Cell, Cell];
export type Board = [BoardLine, BoardLine, BoardLine];

export type Context = {
    boards: Record<Player, Board>;
    currentMove: Player;
    firstPlayerMove: Player;
    result: 'win' | 'lose' | 'draw' | null;
};

export type Events = { type: 'MOVE'; line: 0 | 1 | 2; value: NonNullable<Cell> } | { type: 'RESET' };
export type GameEvent = Event<Events>;

export type GameState = Readable<State<Context, Events>>;
