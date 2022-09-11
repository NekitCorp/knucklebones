<script lang="ts">
    import type { DiceValue } from 'src/modules/game/types';
    import Dice from './Dice.svelte';

    export let roll: { value: DiceValue } | null;
    let value: DiceValue = 1;

    $: {
        if (roll) {
            value = ((roll.value + 3) % 6) as DiceValue;
            setTimeout(() => (value = roll.value), 750);
        }
    }
</script>

{#if roll}
    <div class={`dice show-${value}`}>
        <div class="side one"><Dice value={1} /></div>
        <div class="side two"><Dice value={2} /></div>
        <div class="side three"><Dice value={3} /></div>
        <div class="side four"><Dice value={4} /></div>
        <div class="side five"><Dice value={5} /></div>
        <div class="side six"><Dice value={6} /></div>
    </div>
{/if}

<style>
    .dice {
        position: relative;
        width: var(--dice-size);
        height: var(--dice-size);
        transform-style: preserve-3d;
        transition: transform 1s;
    }

    .side {
        position: absolute;
        width: var(--dice-size);
        height: var(--dice-size);
    }

    .side:nth-child(1) {
        transform: translateZ(calc(var(--dice-size) / 2));
    }

    .side:nth-child(6) {
        transform: rotateY(90deg) translateZ(calc(var(--dice-size) / 2));
    }

    .side:nth-child(3) {
        transform: rotateY(-90deg) translateZ(calc(var(--dice-size) / 2));
    }

    .side:nth-child(4) {
        transform: rotateX(90deg) translateZ(calc(var(--dice-size) / 2));
    }

    .side:nth-child(5) {
        transform: rotateX(-90deg) translateZ(calc(var(--dice-size) / 2));
    }

    .side:nth-child(2) {
        transform: rotateY(-180deg) translateZ(calc(var(--dice-size) / 2));
    }

    .show-1 {
        transform: rotateX(720deg) rotateZ(-720deg);
    }

    .show-2 {
        transform: rotateX(-900deg) rotateZ(1080deg);
    }

    .show-3 {
        transform: rotateY(810deg) rotateZ(720deg);
    }

    .show-4 {
        transform: rotateX(-810deg) rotateZ(-1080deg);
    }

    .show-5 {
        transform: rotateX(450deg) rotateZ(-720deg);
    }

    .show-6 {
        transform: rotateY(-450deg) rotateZ(-1440deg);
    }
</style>
