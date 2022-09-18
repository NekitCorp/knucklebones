<script lang="ts">
    // https://www.figma.com/file/m6qC1ZsEI8F4k5JfVEFJLU/Dice-(Community)?node-id=5%3A61
    import dice1 from 'src/assets/dice-1.svg';
    import dice2 from 'src/assets/dice-2.svg';
    import dice3 from 'src/assets/dice-3.svg';
    import dice4 from 'src/assets/dice-4.svg';
    import dice5 from 'src/assets/dice-5.svg';
    import dice6 from 'src/assets/dice-6.svg';
    import type { DiceValue } from 'src/modules/game/types';

    export let value: DiceValue | null;
    export let side: 'player' | 'competitor' | 'none';
    export let removing = false;
    export let doubled = false;
</script>

{#if value === 1}
    <img src={dice1} class={`dice ${side}`} class:removing class:doubled alt="Dice 1" />
{:else if value === 2}
    <img src={dice2} class={`dice ${side}`} class:removing class:doubled alt="Dice 2" />
{:else if value === 3}
    <img src={dice3} class={`dice ${side}`} class:removing class:doubled alt="Dice 3" />
{:else if value === 4}
    <img src={dice4} class={`dice ${side}`} class:removing class:doubled alt="Dice 4" />
{:else if value === 5}
    <img src={dice5} class={`dice ${side}`} class:removing class:doubled alt="Dice 5" />
{:else if value === 6}
    <img src={dice6} class={`dice ${side}`} class:removing class:doubled alt="Dice 6" />
{:else}
    <div class={`dice empty ${side}`} />
{/if}

<style>
    .dice {
        width: var(--dice-size);
        height: var(--dice-size);
        position: relative;
    }

    .removing {
        animation-name: shake !important;
        animation-iteration-count: infinite;
    }

    .doubled {
        box-shadow: 0 0 10px 3px #dd8500;
        border-radius: 6px;
    }

    .empty {
        border: 2px dashed #eee;
        border-radius: 5px;
    }

    .dice:not(.empty) {
        animation-fill-mode: both;
        animation-delay: 0s;
        animation-duration: 0.7s;
    }

    .dice:not(.empty).player {
        animation-name: backInUp;
    }

    .dice:not(.empty).competitor {
        animation-name: backInDown;
    }

    @media (prefers-color-scheme: dark) {
        .empty {
            border-color: #597686;
        }
    }

    @keyframes backInUp {
        0% {
            transform: translateY(1200px) scale(0.7);
            opacity: 0.7;
        }

        80% {
            transform: translateY(0px) scale(0.7);
            opacity: 0.7;
        }

        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes backInDown {
        0% {
            transform: translateY(-1200px) scale(0.7);
            opacity: 0.7;
        }

        80% {
            transform: translateY(0px) scale(0.7);
            opacity: 0.7;
        }

        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes shake {
        from,
        to {
            transform: translate3d(0, 0, 0);
        }

        10%,
        30%,
        50%,
        70%,
        90% {
            transform: translate3d(-5px, 0, 0);
        }

        20%,
        40%,
        60%,
        80% {
            transform: translate3d(5px, 0, 0);
        }
    }
</style>
