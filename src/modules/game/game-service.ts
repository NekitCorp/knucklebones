import { get, writable } from 'svelte/store';
import type { Board, BoardLine, DiceValue, GameAction, GameState, Line, Player } from './types';
import {
    checkBoardIsFull,
    checkLineIsFull,
    createInitialBoard,
    createInitialCell,
    getBoardPoints,
    padEnd,
    revertPlayer,
} from './utils';

export class GameService {
    public readonly state = writable<GameState>({ type: 'init' });
    public readonly player: Player;
    public readonly competitor: Player;
    private firstPlayerMove: Player = 1;

    constructor(player: Player) {
        this.player = player;
        this.competitor = revertPlayer(player);
    }

    public startGame() {
        this.state.set({
            type: 'playing',
            boards: { 1: createInitialBoard(), 2: createInitialBoard() },
            currentMove: this.firstPlayerMove,
            dice: null,
            pause: false,
        });
    }

    public action(action: GameAction): boolean {
        switch (action.type) {
            case 'DICE':
                return this.setDice(action.value);
            case 'GAME':
                return this.makeTurn(action.line);
            case 'RESET':
                return this.resetGame();
            default:
                return false;
        }
    }

    private makeTurn(line: Line): boolean {
        const state = get(this.state);

        // Wrong game state
        if (state.type !== 'playing') return false;

        const { dice, currentMove, boards } = state;

        // Dice not ready
        if (!dice) return false;
        // Line is full
        if (checkLineIsFull(boards[currentMove][line])) return false;

        const updatedBoards = { ...boards };

        const opposite = revertPlayer(currentMove);
        const currentLine = updatedBoards[currentMove][line];
        const oppositeLine = updatedBoards[opposite][line];

        // Update current board
        const firstNullIndex = currentLine.findIndex((cell) => cell.value === null);
        currentLine[firstNullIndex] = createInitialCell(dice);

        // Remove opposite cells if there are matches
        if (oppositeLine.filter((cell) => cell.value === dice).length) {
            oppositeLine
                .filter((cell) => cell.value === dice)
                .forEach((cell) => {
                    cell.removing = true;
                });

            setTimeout(() => {
                updatedBoards[opposite][line] = padEnd(
                    oppositeLine.filter((cell) => cell.value !== dice),
                    3,
                    createInitialCell,
                ) as BoardLine;

                this.state.update((s) => (s.type === 'playing' ? { ...s, boards: updatedBoards } : s));
            }, 1500);
        }

        if (this.checkEnd(updatedBoards)) {
            this.state.set({ type: 'end', result: this.getEndResult(updatedBoards), boards: updatedBoards });
        } else {
            this.state.update((s) => ({
                ...s,
                boards: updatedBoards,
                currentMove: revertPlayer(currentMove),
                dice: null,
            }));
        }

        return true;
    }

    private setDice(value: DiceValue): boolean {
        const state = get(this.state);

        // Wrong game state
        if (state.type !== 'playing') return false;

        this.state.update((s) => ({ ...s, dice: value, pause: true }));

        // wait roll the dice animation
        setTimeout(() => {
            this.state.update((s) => ({ ...s, pause: false }));
        }, 1500);

        return true;
    }

    private resetGame(): boolean {
        const state = get(this.state);

        // Wrong game state
        if (state.type !== 'end') return false;

        this.state.set({
            type: 'playing',
            boards: { 1: createInitialBoard(), 2: createInitialBoard() },
            currentMove: revertPlayer(this.firstPlayerMove),
            dice: null,
            pause: false,
        });
        this.firstPlayerMove = revertPlayer(this.firstPlayerMove);

        return true;
    }

    private checkEnd(boards: Record<Player, Board>): boolean {
        return checkBoardIsFull(boards[1]) || checkBoardIsFull(boards[2]);
    }

    private getEndResult(boards: Record<Player, Board>): 'win' | 'lose' | 'draw' {
        const playerPoints = getBoardPoints(boards[this.player]);
        const competitorPoints = getBoardPoints(boards[this.competitor]);

        if (playerPoints === competitorPoints) return 'draw';
        return playerPoints > competitorPoints ? 'win' : 'lose';
    }
}
