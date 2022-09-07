import { assign, createMachine } from 'xstate';
import type { BoardLine, Context, Events, Player } from './types';
import { checkBoardIsFull, createInitialBoard, getBoardPoints, padEnd, revertPlayer } from './utils';

const initialContext: Context = {
    boards: { 1: createInitialBoard(), 2: createInitialBoard() },
    currentMove: 1,
    firstPlayerMove: 1,
    result: null,
};

export function createGameMachine(player: Player) {
    const competitor = revertPlayer(player);

    return createMachine<Context, Events>(
        {
            id: 'knucklebones-machine',
            initial: 'playing',
            context: initialContext,
            states: {
                playing: {
                    on: {
                        '': [{ target: 'end', cond: 'checkEnd' }],
                        MOVE: [
                            {
                                target: 'playing',
                                cond: 'isValidMove',
                                actions: 'updateBoard',
                            },
                        ],
                    },
                },
                end: {
                    entry: 'setResult',
                },
            },
            on: {
                RESET: {
                    target: 'playing',
                    actions: 'resetGame',
                },
            },
        },
        {
            actions: {
                updateBoard: assign({
                    boards: (ctx, e) => {
                        const updatedBoards = { ...ctx.boards };

                        if (e.type === 'MOVE') {
                            const currentLine = updatedBoards[ctx.currentMove][e.line];
                            const competitor = revertPlayer(ctx.currentMove);
                            const competitorLine = updatedBoards[competitor][e.line];

                            // update player board
                            const firstNullIndex = currentLine.findIndex((cell) => cell === null);
                            currentLine[firstNullIndex] = e.value;

                            // remove competitor cells if there are matches
                            updatedBoards[competitor][e.line] = padEnd(
                                competitorLine.filter((cell) => cell !== e.value),
                                3,
                                null,
                            ) as BoardLine;
                        }

                        return updatedBoards;
                    },
                    currentMove: (ctx) => revertPlayer(ctx.currentMove),
                }),
                resetGame: assign((ctx) => ({
                    ...initialContext,
                    boards: { 1: createInitialBoard(), 2: createInitialBoard() },
                    firstPlayerMove: revertPlayer(ctx.firstPlayerMove),
                })),
                setResult: assign({
                    result: (ctx) => {
                        const playerPoints = getBoardPoints(ctx.boards[player]);
                        const competitorPoints = getBoardPoints(ctx.boards[competitor]);

                        if (playerPoints === competitorPoints) return 'draw';
                        return playerPoints > competitorPoints ? 'win' : 'lose';
                    },
                }),
            },
            guards: {
                checkEnd: (ctx) => checkBoardIsFull(ctx.boards[1]) || checkBoardIsFull(ctx.boards[2]),
                isValidMove: (ctx, e) =>
                    e.type === 'MOVE' && ctx.boards[ctx.currentMove][e.line].some((cell) => cell === null),
            },
        },
    );
}
