<script lang="ts">
    import dice1 from 'src/assets/dice-1.svg';
    import dice2 from 'src/assets/dice-2.svg';
    import dice3 from 'src/assets/dice-3.svg';
    import dice4 from 'src/assets/dice-4.svg';
    import dice5 from 'src/assets/dice-5.svg';
    import dice6 from 'src/assets/dice-6.svg';
    import type { Cell } from 'src/modules/game/types';

    export let value: Cell;
</script>

{#if value === 1}
    <img src={dice1} class="dice" alt="Dice 1" />
{:else if value === 2}
    <img src={dice2} class="dice" alt="Dice 2" />
{:else if value === 3}
    <img src={dice3} class="dice" alt="Dice 3" />
{:else if value === 4}
    <img src={dice4} class="dice" alt="Dice 4" />
{:else if value === 5}
    <img src={dice5} class="dice" alt="Dice 5" />
{:else if value === 6}
    <img src={dice6} class="dice" alt="Dice 6" />
{:else}
    <div class="dice" />
{/if}

<style>
    .dice {
        width: 5vh;
        height: 5vh;
    }
</style>
