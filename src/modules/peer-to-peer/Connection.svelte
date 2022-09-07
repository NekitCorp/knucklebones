<script lang="ts">
    import CopyButton from 'src/components/CopyButton.svelte';
    import type { PeerToPeerService } from './peer-to-peer-service';

    export let p2p: PeerToPeerService;
    const { id, connectionState } = p2p;

    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    let remoteId: string;

    $: link = `${window.location.href}?id=${$id}`;
    $: if ($connectionState.type === 'ready' && idParam) {
        p2p.connect(idParam);
    }

    function connect(e: SubmitEvent) {
        e.preventDefault();
        if (remoteId) {
            p2p.connect(remoteId);
        }
    }
</script>

{#if $connectionState.type === 'init'}
    <p>Connection to the PeerServer...</p>
{:else if $connectionState.type === 'connecting'}
    <p>Connectioning to the remote player...</p>
{:else if $connectionState.type === 'ready' || $connectionState.type === 'disconnected'}
    <div class="window animate__animated animate__backInLeft">
        <div class="title-bar">
            <h1 class="title">Connection setup</h1>
        </div>
        {#if $connectionState.type === 'disconnected'}
            <div class="details-bar">Remote peer closes the data connection.</div>
        {/if}
        <div class="separator" />
        <div class="window-pane">
            <p>
                Send <a href={link}>link</a>
                <CopyButton textToCopy={link} /> or my peer id
                <span class="id">{$id}</span>
                <CopyButton textToCopy={$id} /> to another player.
            </p>
            <div class="connectForm">
                <p>Or paste another player's id here:</p>
                <form on:submit={connect}>
                    <input type="text" bind:value={remoteId} />
                    <button type="submit" class="btn">Connect</button>
                </form>
            </div>
        </div>
    </div>
{:else if $connectionState.type === 'connected'}
    <slot />
{:else if $connectionState.type === 'error'}
    <div class="window animate__animated animate__backInLeft">
        <div class="title-bar">
            <h1 class="title">Error</h1>
        </div>
        <div class="separator" />
        <div class="window-pane">{$connectionState.error}</div>
    </div>
{:else}
    <p>Wrong state</p>
{/if}

<style>
    .id {
        text-decoration: underline;
    }

    .connectForm {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    @media (min-width: 960px) {
        .connectForm {
            flex-direction: row;
        }
    }

    .connectForm p {
        margin: 0;
    }
</style>
