<script lang="ts">
    import Dice from 'src/components/Dice.svelte';
    import { createEventDispatcher } from 'svelte';
    import type { DiceService } from './dice-service';
    import type { GameService } from './game-service';
    import type { GameEvent } from './types';
    import { getBoardLinePoints, getBoardPoints, revertPlayer } from './utils';

    export let dice: DiceService;
    const { state: diceState } = dice;
    export let game: GameService;
    const { state, player } = game;
    const competitor = revertPlayer(player);
    $: isYourMove = player === $state.context.currentMove;

    const dispatch = createEventDispatcher();
    const move = (event: GameEvent) => {
        dispatch('move', event);
    };

    function makeTurn(line: number) {
        if (isYourMove && $diceState.type === 'stopped') {
            move({ type: 'MOVE', line: line as 0 | 1 | 2, value: $diceState.value });
        }
    }
</script>

<div class="container">
    <!-- competitor number, icon -->
    <h2 class="player-info competitor">{competitor === 1 ? '🐱' : '🐶'} Player #{competitor}</h2>

    <!-- competitor game board -->
    <div class="board">
        {#each $state.context.boards[competitor] as lines, i}
            <div class="line">
                {#each lines as cell}
                    <Dice value={cell} />
                {/each}
                <h2 class="points">{getBoardLinePoints(lines)}</h2>
            </div>
        {/each}
    </div>

    <!-- competitor points -->
    <h2>{getBoardPoints($state.context.boards[competitor])}</h2>

    <!-- game state -->
    <div class="state">
        {#if $state.value === 'playing'}
            <h2>
                {$state.context.currentMove === 1 ? '🐱' : '🐶'}
                {isYourMove ? 'Your turn' : "Opponent's move"}
            </h2>
            {#if $diceState.type === 'rolling'}
                <h2>Rolling the dice...</h2>
            {:else if $diceState.type === 'stopped'}
                <Dice value={$diceState.value} />
            {/if}
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
    <h2>{getBoardPoints($state.context.boards[player])}</h2>

    <!-- player game board -->
    <div class="board">
        {#each $state.context.boards[player] as lines, i}
            <div class="line" on:click={() => makeTurn(i)}>
                <h2 class="points">{getBoardLinePoints(lines)}</h2>
                {#each lines as cell}
                    <Dice value={cell} />
                {/each}
            </div>
        {/each}
    </div>

    <!-- player number, icon -->
    <h2 class="player-info player">{player === 1 ? '🐱' : '🐶'} Player #{player}</h2>
</div>

<style>
    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .player-info {
        text-decoration: underline dotted;
    }
    .competitor {
        margin-bottom: 1rem;
    }
    .player {
        margin-top: 1rem;
    }

    .points {
        line-height: 1;
    }

    .board {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: repeat(3, 1fr);
    }

    .line {
        display: grid;
        gap: 0.5rem;
        padding: 1rem;
        background-color: black;
        border-radius: 10px;
        color: white;
        cursor: pointer;
    }

    .line:hover {
        outline: 3px solid greenyellow;
    }

    .state {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex: 1;
    }
</style>
