<script lang="ts">
    import Dice from 'src/modules/dice/Dice.svelte';
    import RollDice from 'src/modules/dice/RollDice.svelte';
    import { createEventDispatcher, onMount } from 'svelte';
    import type { GameService } from './game-service';
    import type { GameAction, Line } from './types';
    import {
        cellMatches,
        checkLineIsFull,
        getBoardLinePoints,
        getBoardPoints,
        getPlayerEmoji,
        randomDice,
    } from './utils';
    import JSConfetti from 'js-confetti';

    export let game: GameService;
    const { state, player, competitor } = game;
    $: isYourMove = $state.type === 'playing' && player === $state.currentMove;
    $: disabled = $state.type !== 'playing' || $state.pause || !isYourMove;

    // release confetti when you win
    const jsConfetti = new JSConfetti();
    $: $state.type === 'end' &&
        $state.result === 'win' &&
        jsConfetti.addConfetti({ emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸', '🎉', '🎊', '💩'] });

    const dispatch = createEventDispatcher();
    const action = (ga: GameAction) => dispatch('action', ga);
    const makeTurn = (line: number) => action({ type: 'GAME', line: line as Line });
    const reset = () => action({ type: 'RESET' });

    onMount(() => {
        game.startGame();

        // the host rolls a dice on successful connection
        if (player === 1) {
            action({ type: 'DICE', value: randomDice() });
        }
    });
</script>

{#if $state.type === 'playing' || $state.type === 'end'}
    <div class="container">
        <!-- competitor info -->
        <h2 class="player-info competitor" class:turn={!isYourMove}>
            {getPlayerEmoji(competitor)} Player #{competitor}
        </h2>

        <!-- competitor game board -->
        <div class="board">
            {#each $state.boards[competitor] as line}
                <button class="line line-copmetitor" disabled>
                    <h2 class="line-points">{getBoardLinePoints(line)}</h2>
                    {#each line as cell (cell.id)}
                        <Dice
                            value={cell.value}
                            removing={cell.removing}
                            doubled={cellMatches(cell, line)}
                            side="competitor"
                        />
                    {/each}
                </button>
            {/each}
        </div>

        <!-- competitor points -->
        <h2 class="points">Score: {getBoardPoints($state.boards[competitor])}</h2>

        <!-- game state -->
        <div class="state">
            {#if $state.type === 'playing'}
                <h2>
                    {getPlayerEmoji($state.currentMove)}
                    {isYourMove ? 'Your turn' : "Opponent's move"}
                </h2>
                <RollDice value={$state.dice} />
            {:else if $state.type === 'end'}
                {#if $state.result === 'win'}<h2>🏆 You won!</h2>{/if}
                {#if $state.result === 'lose'}<h2>😥 You lose</h2>{/if}
                {#if $state.result === 'draw'}<h2>🤝 Draw</h2>{/if}
                <button on:click={reset}>🔄 Reset</button>
            {/if}
        </div>

        <!-- player points -->
        <h2 class="points">Score: {getBoardPoints($state.boards[player])}</h2>

        <!-- player game board -->
        <div class="board">
            {#each $state.boards[player] as line, i}
                <button class="line" disabled={disabled || checkLineIsFull(line)} on:click={() => makeTurn(i)}>
                    <h2 class="line-points">{getBoardLinePoints(line)}</h2>
                    {#each line as cell (cell.id)}
                        <Dice
                            value={cell.value}
                            removing={cell.removing}
                            doubled={cellMatches(cell, line)}
                            side="player"
                        />
                    {/each}
                </button>
            {/each}
        </div>

        <!-- player info -->
        <h2 class="player-info player" class:turn={isYourMove}>{getPlayerEmoji(player)} Player #{player}</h2>
    </div>
{/if}

<style>
    /*
        Layout.
        -------
        [competitor info]        15vh = 4vh (margin-top) + 4vh (font-size) + 7vh (margin-bottom)
        [competitor game board]  25vh = 2 * 2vh (padding) + 3 * 5vh (cell) + 3 * 1vh (gap) + 3vh (points)
        [competitor points]      6vh = 3vh (font-size) * 2 (line-height) 
        [game state]             1fr 
        [player points]          6vh = 3vh (font-size) * 2 (line-height)
        [player game board]      25vh ...
        [player info]            15vh = 7vh (margin-top) + 4vh (font-size) + 4vh (margin-bottom)
        -------
        Total: 92vh + 1fr.
    */

    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        position: relative;
    }

    .player-info {
        font-size: 4vh;
        line-height: 1;
    }
    .competitor {
        margin-top: 4vh;
        margin-bottom: 7vh;
    }
    .player {
        margin-top: 7vh;
        margin-bottom: 4vh;
    }
    .player-info::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: max(100vw, 100vh);
        height: max(100vw, 100vh);
        border-radius: 50%;
        background: var(--game-overlay-color);
        z-index: -1;
        transition: top 0.7s ease-out, bottom 0.7s ease-out;
    }
    .competitor::before {
        bottom: 88vh;
    }
    .player::before {
        top: 88vh;
    }
    .turn.competitor::before {
        bottom: 54vh;
    }
    .turn.player::before {
        top: 54vh;
    }

    .line-points {
        line-height: 1;
        font-size: 3vh;
        text-align: center;
    }

    .board {
        display: grid;
        gap: 1vh;
        grid-template-columns: repeat(3, 1fr);
    }

    .line {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1vh;
        padding: 2vh;
        color: var(--game-line-color);
        background-color: var(--game-line-active-color);
        border-radius: 10px;
        cursor: pointer;
        border: none;
        outline: none;
    }
    .line-copmetitor {
        flex-direction: column-reverse;
    }
    .line:disabled {
        cursor: not-allowed;
        background-color: var(--game-line-disabled-color);
    }
    .line:not(:disabled):hover {
        background-color: var(--game-line-active-hover-color);
        box-shadow: var(--game-line-active-hover-shadow);
    }

    .points {
        font-size: 3vh;
        line-height: 2;
    }

    .state {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex: 1;
    }
    .state > h2 {
        font-size: 4vh;
    }
</style>
