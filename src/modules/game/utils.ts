import type { Board, BoardLine, DiceValue, Player } from './types';

export function nonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export function padEnd<T, K>(array: T[], minLength: number, fillValue: K): (T | K)[] {
    return Object.assign(new Array(minLength).fill(fillValue), array);
}

export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomDice(): DiceValue {
    return randomNumber(1, 6) as DiceValue;
}

export const createInitialBoardLine = (): BoardLine => [null, null, null];

export const createInitialBoard = (): Board => [
    createInitialBoardLine(),
    createInitialBoardLine(),
    createInitialBoardLine(),
];

export function getBoardLinePoints(boardLine: BoardLine): number {
    return boardLine
        .filter(nonNullable)
        .map((cell) => cell * boardLine.filter((c) => c === cell).length)
        .reduce((a, b) => a + b, 0);
}

export function getBoardPoints(board: Board): number {
    return board.reduce((acc, line) => acc + getBoardLinePoints(line), 0);
}

export function checkBoardIsFull(board: Board): boolean {
    return board.every(checkLineIsFull);
}

export function revertPlayer(player: Player) {
    return player === 1 ? 2 : 1;
}

export function checkLineIsFull(line: BoardLine): boolean {
    return line.every((cell) => cell !== null);
}
