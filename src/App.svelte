<script lang="ts">
    import { GameService } from './modules/game';
    import Game from './modules/game/Game.svelte';
    import type { GameEvent } from './modules/game/types';
    import { randomDice } from './modules/game/utils';
    import { PeerToPeerService } from './modules/peer-to-peer';
    import Connection from './modules/peer-to-peer/Connection.svelte';

    const p2p = new PeerToPeerService((data) => {
        const event = data as GameEvent;

        if (game) {
            game.send(event);

            if (typeof event !== 'string' && event.type === 'MOVE') {
                const dice = randomDice();
                const event: GameEvent = { type: 'DICE', value: dice };
                game.send(event);
                p2p.send(event);
            }
        }
    });
    const { connectionState } = p2p;

    $: game = $connectionState.type === 'connected' ? new GameService($connectionState.side === 'host' ? 1 : 2) : null;
    $: if ($connectionState.type === 'connected' && $connectionState.side === 'host' && game) {
        const dice = randomDice();
        const event: GameEvent = { type: 'DICE', value: dice };
        game.send(event);
        p2p.send(event);
    }

    function move(event: CustomEvent<GameEvent>) {
        if (event.detail && game) {
            // change game state
            game.send(event.detail);

            // send game event to another player
            p2p.send(event.detail);
        }
    }
</script>

<Connection {p2p}>
    {#if game}<Game {game} on:move={move} />{/if}
</Connection>
