<script lang="ts">
    import { GameService } from './modules/game';
    import { DiceService } from './modules/game/dice-service';
    import Game from './modules/game/Game.svelte';
    import type { GameEvent } from './modules/game/types';
    import { PeerToPeerService } from './modules/peer-to-peer';
    import Connection from './modules/peer-to-peer/Connection.svelte';
    import type { Message } from './types';

    const p2p = new PeerToPeerService((data) => {
        const message = data as Message;

        if (message.type === 'game' && game) {
            game.send(message.event);
            dice.roll((value) => {
                const message: Message = { type: 'dice', value };
                p2p.send(message);
            });
        }

        if (message.type === 'dice') {
            dice.setValue(message.value);
        }
    });
    const { connectionState } = p2p;

    const dice = new DiceService();
    $: game = $connectionState.type === 'connected' ? new GameService($connectionState.side === 'host' ? 1 : 2) : null;
    $: if ($connectionState.type === 'connected' && $connectionState.side === 'host') {
        dice.roll((value) => {
            const message: Message = { type: 'dice', value };
            p2p.send(message);
        });
    }

    function move(event: CustomEvent<GameEvent>) {
        if (event.detail && game) {
            // change game state
            game.send(event.detail);

            // send game event to another player
            const message: Message = { type: 'game', event: event.detail };
            p2p.send(message);

            // roll the dice (another player)
            dice.setRollingState();
        }
    }
</script>

<Connection {p2p}>
    {#if game}<Game {game} {dice} on:move={move} />{/if}
</Connection>
