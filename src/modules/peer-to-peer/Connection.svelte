<script lang="ts">
    import CopyButton from 'src/components/CopyButton.svelte';
    import type { PeerToPeerService } from './peer-to-peer-service';

    export let p2p: PeerToPeerService;
    const { connectionState } = p2p;

    $: link = $connectionState.type === 'ready' ? `${window.location.href}?id=${$connectionState.peerId}` : '';
</script>

{#if $connectionState.type !== 'connected'}
    <section>
        {#if $connectionState.type === 'init'}
            <p class="loading">⌛ Connection to the PeerServer</p>
        {:else if $connectionState.type === 'connecting'}
            <p class="loading">⌛ Connectioning to the remote player</p>
        {:else if $connectionState.type === 'disconnected'}
            <p>🚪 Remote peer closes the data connection.</p>
        {:else if $connectionState.type === 'ready'}
            <h1>🎲 KNUCKLEBONES 🎲</h1>
            <p>Send the link below to another player:</p>
            <p class="link"><a href={link}>{link}</a></p>
            <CopyButton textToCopy={link} />
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

    .link {
        line-height: 1;
        margin: 1.5rem 0;
    }
</style>
