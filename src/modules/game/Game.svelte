<script lang="ts">
    import Dice from 'src/modules/dice/Dice.svelte';
    import RollDice from 'src/modules/dice/RollDice.svelte';
    import { createEventDispatcher } from 'svelte';
    import type { GameService } from './game-service';
    import type { GameEvent } from './types';
    import { checkLineIsFull, getBoardLinePoints, getBoardPoints, revertPlayer } from './utils';

    export let game: GameService;
    const { state, player } = game;
    const competitor = revertPlayer(player);
    $: isYourMove = player === $state.context.currentMove;

    const dispatch = createEventDispatcher();
    const move = (event: GameEvent) => {
        dispatch('move', event);
    };

    function makeTurn(line: number) {
        if (isYourMove && !checkLineIsFull($state.context.boards[player][line])) {
            move({ type: 'MOVE', line: line as 0 | 1 | 2 });
        }
    }
</script>

<div class="container">
    <!-- competitor info -->
    <h2 class="player-info competitor">{competitor === 1 ? '🐱' : '🐶'} Player #{competitor}</h2>

    <!-- competitor game board -->
    <div class="board">
        {#each $state.context.boards[competitor] as line}
            <div class="line line-copmetitor line-block">
                <h2 class="line-points">{getBoardLinePoints(line)}</h2>
                {#each line as cell}
                    <Dice value={cell} />
                {/each}
            </div>
        {/each}
    </div>

    <!-- competitor points -->
    <h2 class="points">{getBoardPoints($state.context.boards[competitor])}</h2>

    <!-- game state -->
    <div class="state">
        {#if $state.value === 'playing'}
            <h2>
                {$state.context.currentMove === 1 ? '🐱' : '🐶'}
                {isYourMove ? 'Your turn' : "Opponent's move"}
            </h2>
            <RollDice roll={$state.context.dice} />
        {:else if $state.value === 'end'}
            {#if $state.context.result === 'win'}<h2>🏆 You won!</h2>{/if}
            {#if $state.context.result === 'lose'}<h2>😥 You lose</h2>{/if}
            {#if $state.context.result === 'draw'}<h2>🤝 Draw</h2>{/if}
            <button on:click={() => move('RESET')}>🔄 Reset</button>
        {:else}
            <h2>Wrong state!</h2>
            <p>{$state.value}</p>
        {/if}
    </div>

    <!-- player points -->
    <h2 class="points">{getBoardPoints($state.context.boards[player])}</h2>

    <!-- player game board -->
    <div class="board">
        {#each $state.context.boards[player] as line, i}
            <div class="line" on:click={() => makeTurn(i)} class:line-block={!isYourMove || checkLineIsFull(line)}>
                <h2 class="line-points">{getBoardLinePoints(line)}</h2>
                {#each line as cell}
                    <Dice value={cell} />
                {/each}
            </div>
        {/each}
    </div>

    <!-- player info -->
    <h2 class="player-info player">{player === 1 ? '🐱' : '🐶'} Player #{player}</h2>
</div>

<style>
    /*
        Layout.
        -------
        [competitor info]        5.5vh = 3vh * 1.5 (line-height) + 1vh (margin-top)
        [competitor game board]  25vh = 2 * 2vh (padding) + 3 * 5vh (cell) + 3 * 1vh (gap) + 3vh (points)
        [competitor points]      6vh = 4vh * 1.5 (line-height) 
        [game state]             1fr 
        [player points]          6vh = 4vh * 1.5 (line-height)
        [player game board]      25vh 
        [player info]            5.5vh = 3vh * 1.5 (line-height) + 1vh (margin-bottom) 
        -------
        Total: 73vh + 1fr.
    */

    /* 980 / 100 = 9.8px = 1vh */

    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .player-info {
        text-decoration: underline dotted;
        font-size: 3vh;
    }
    .competitor {
        margin-bottom: 1vh;
    }
    .player {
        margin-top: 1vh;
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
        gap: 1vh;
        padding: 2vh;
        background-color: #296e76;
        border-radius: 10px;
        color: white;
        cursor: pointer;
    }
    .line-copmetitor {
        flex-direction: column-reverse;
    }
    .line-block {
        cursor: not-allowed;
        background-color: #1a464b;
    }
    .line:not(.line-block):hover {
        background-color: #33858f;
    }

    .points {
        font-size: 4vh;
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
