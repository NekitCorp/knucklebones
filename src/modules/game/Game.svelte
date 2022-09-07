<script lang="ts">
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
        if ($diceState.type === 'stopped') {
            move({ type: 'MOVE', line: line as 0 | 1 | 2, value: $diceState.value });
        }
    }
</script>

<section>
    <h1>Player #{player}</h1>

    <!-- competitor game board -->
    <div class="grid">
        {#each $state.context.boards[competitor] as lines, i}
            <div class="line">
                {#each lines as line}
                    <button class="cell" disabled>{line}</button>
                {/each}
                <h2>{getBoardLinePoints(lines)}</h2>
            </div>
        {/each}
    </div>
    <h2>{getBoardPoints($state.context.boards[competitor])}</h2>

    <!-- game state -->
    <div class="header">
        {#if $state.value === 'playing'}
            <h2>{isYourMove ? 'Your turn' : "Opponent's move"}</h2>
            {#if $diceState.type === 'rolling'}
                <h2>Rolling the dice...</h2>
            {:else if $diceState.type === 'stopped'}
                <h2>Dice: {$diceState.value}</h2>
            {/if}
        {:else if $state.value === 'end'}
            {#if $state.context.result === 'win'}<h2>You won!</h2>{/if}
            {#if $state.context.result === 'lose'}<h2>You lose</h2>{/if}
            {#if $state.context.result === 'draw'}<h2>Draw</h2>{/if}
            <button class="btn" on:click={() => move('RESET')}>Reset</button>
        {:else}
            <h2>Wrong state!</h2>
            <p>{$state.value}</p>
        {/if}
    </div>

    <!-- player game board -->
    <h2>{getBoardPoints($state.context.boards[player])}</h2>
    <div class="grid">
        {#each $state.context.boards[player] as lines, i}
            <div class="line">
                <h2>{getBoardLinePoints(lines)}</h2>
                {#each lines as line}
                    <button
                        class="cell"
                        disabled={!isYourMove || $diceState.type === 'rolling'}
                        on:click={() => makeTurn(i)}>{line}</button
                    >
                {/each}
            </div>
        {/each}
    </div>
</section>

<style>
    .grid {
        display: flex;
    }

    .line {
        display: flex;
        flex-direction: column;
        padding: 4px;
        gap: 4px;
    }

    .line:hover {
        outline: 1px dashed blue;
    }
</style>
