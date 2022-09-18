<script lang="ts">
    import type { DiceValue } from 'src/modules/game/types';
    import Dice from './Dice.svelte';

    export let value: DiceValue | null;
</script>

{#if value}
    <div class={`dice show-${value}`}>
        <div class="side one"><Dice value={1} side="none" /></div>
        <div class="side two"><Dice value={2} side="none" /></div>
        <div class="side three"><Dice value={3} side="none" /></div>
        <div class="side four"><Dice value={4} side="none" /></div>
        <div class="side five"><Dice value={5} side="none" /></div>
        <div class="side six"><Dice value={6} side="none" /></div>
    </div>
{/if}

<style>
    .dice {
        position: relative;
        width: var(--dice-size);
        height: var(--dice-size);
        transform-style: preserve-3d;
        animation-duration: 1s;
        animation-timing-function: linear;
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
        animation-name: roll-1;
        transform: rotateX(720deg) rotateY(0deg) rotateZ(-720deg);
    }
    .show-2 {
        animation-name: roll-2;
        transform: rotateX(-900deg) rotateY(0deg) rotateZ(1080deg);
    }
    .show-3 {
        animation-name: roll-3;
        transform: rotateX(0deg) rotateY(810deg) rotateZ(720deg);
    }
    .show-4 {
        animation-name: roll-4;
        transform: rotateX(-810deg) rotateY(0deg) rotateZ(-1080deg);
    }
    .show-5 {
        animation-name: roll-5;
        transform: rotateX(450deg) rotateY(0deg) rotateZ(-720deg);
    }
    .show-6 {
        animation-name: roll-6;
        transform: rotateX(0deg) rotateY(-450deg) rotateZ(-1440deg);
    }

    @keyframes roll-1 {
        from {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
        to {
            transform: rotateX(720deg) rotateY(0deg) rotateZ(-720deg);
        }
    }
    @keyframes roll-2 {
        from {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
        to {
            transform: rotateX(-900deg) rotateY(0deg) rotateZ(1080deg);
        }
    }
    @keyframes roll-3 {
        from {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
        to {
            transform: rotateX(0deg) rotateY(810deg) rotateZ(720deg);
        }
    }
    @keyframes roll-4 {
        from {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
        to {
            transform: rotateX(-810deg) rotateY(0deg) rotateZ(-1080deg);
        }
    }
    @keyframes roll-5 {
        from {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
        to {
            transform: rotateX(450deg) rotateY(0deg) rotateZ(-720deg);
        }
    }
    @keyframes roll-6 {
        from {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
        to {
            transform: rotateX(0deg) rotateY(-450deg) rotateZ(-1440deg);
        }
    }
</style>
