<script lang="ts">
    import CopyButton from 'src/components/CopyButton.svelte';
    import QRCode from 'src/components/QRCode.svelte';
    import type { PeerToPeerService } from './peer-to-peer-service';

    export let p2p: PeerToPeerService;
    const { connectionState } = p2p;

    $: link = $connectionState.type === 'ready' ? `${window.location.href}?id=${$connectionState.peerId}` : '';

    const goToStartPage = () => ((window as Window).location = window.location.pathname);
</script>

{#if $connectionState.type !== 'connected'}
    <section>
        {#if $connectionState.type === 'init'}
            <p class="loading">⌛ Connection to the PeerServer</p>
        {:else if $connectionState.type === 'connecting'}
            <p class="loading">⌛ Connectioning to the remote player</p>
        {:else if $connectionState.type === 'disconnected'}
            <p>Remote peer closes the data connection.</p>
            <button class="btn" on:click={goToStartPage}>🚪 Go to start page</button>
        {:else if $connectionState.type === 'ready'}
            <div class="ready-container">
                <h1 class="game-title">🎲 KNUCKLEBONES 🎲</h1>
                <p>Send the link below to another player: <a href={link}>{link}</a></p>

                <CopyButton textToCopy={link} />
                <QRCode value={link} />
            </div>
        {:else if $connectionState.type === 'error' || 1}
            <h1>😵 Error</h1>
            <p>{$connectionState.error}</p>
        {:else}
            <h1>🤔 Wrong state</h1>
            <p>{$connectionState}</p>
        {/if}
    </section>
{/if}

{#if $connectionState.type === 'connected'}
    <slot />
{/if}

<style>
    section {
        height: 100%;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .ready-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
    }

    .game-title {
        white-space: nowrap;
    }

    .loading::after {
        content: '';
        animation: dotty steps(1, end) 2s infinite;
    }

    @keyframes dotty {
        0% {
            content: '';
        }
        25% {
            content: '.';
        }
        50% {
            content: '..';
        }
        75% {
            content: '...';
        }
        100% {
            content: '';
        }
    }
</style>
