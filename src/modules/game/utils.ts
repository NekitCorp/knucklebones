import type { Board, BoardLine, Cell, DiceValue, Player } from './types';

export function nonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

export function padEnd<T, K>(array: T[], minLength: number, fillValue: () => K): (T | K)[] {
    return Object.assign(
        new Array(minLength).fill(null).map(() => fillValue()),
        array,
    );
}

export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomDice(): DiceValue {
    return randomNumber(1, 6) as DiceValue;
}

export const createInitialCell = (value: DiceValue | null = null): Cell => ({
    id: getNewCellId(),
    removing: false,
    value,
});

export const createInitialBoardLine = (): BoardLine => [createInitialCell(), createInitialCell(), createInitialCell()];

export const createInitialBoard = (): Board => [
    createInitialBoardLine(),
    createInitialBoardLine(),
    createInitialBoardLine(),
];

export function getBoardLinePoints(boardLine: BoardLine): number {
    return boardLine
        .filter((cell) => cell.value !== null)
        .map((cell) => (cell.value as DiceValue) * boardLine.filter((c) => c.value === cell.value).length)
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
    return line.every((cell) => cell.value !== null);
}

let cellId = 0;

export function getNewCellId() {
    return ++cellId;
}

export function cellMatches(cell: Cell, line: BoardLine): boolean {
    return line.filter((c) => c.value === cell.value).length > 1;
}

export function getPlayerEmoji(player: Player) {
    return player === 1 ? '🦄' : '🐼';
}
