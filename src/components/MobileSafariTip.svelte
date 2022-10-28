<script lang="ts">
    import { onMount } from 'svelte';

    let open = false;

    function isMobileSafari() {
        return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
    }

    function close() {
        open = false;
    }

    onMount(() => {
        if (isMobileSafari()) {
            open = true;
        }
    });
</script>

{#if open}
    <div class="overlay">
        <button class="button" on:click={close}>✖️</button>
        <p class="text">For a better gaming experience, it is recommended to hide the toolbar.</p>
        <img src="hide-toolbar.png" alt="hide toolbar guide" />
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        display: flex;
        flex-direction: column;
        bottom: 16px;
        left: 16px;
        right: 16px;
        background: red;
        padding: 8px;
        color: var(--button-color);
        background-color: var(--button-background-color);
        border-radius: 8px;
    }

    .text {
        padding: 16px 24px;
        text-align: center;
    }

    .button {
        align-self: flex-end;
    }
</style>
