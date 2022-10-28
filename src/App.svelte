<script lang="ts">
    import MobileSafariTip from './components/MobileSafariTip.svelte';
    import { GameService } from './modules/game';
    import Game from './modules/game/Game.svelte';
    import type { GameAction } from './modules/game/types';
    import { randomDice } from './modules/game/utils';
    import { PeerToPeerService } from './modules/peer-to-peer';
    import Connection from './modules/peer-to-peer/Connection.svelte';

    const idParam = new URLSearchParams(window.location.search).get('id');
    const p2p = new PeerToPeerService(idParam, onMessage);
    const game = new GameService(idParam ? 2 : 1);

    function onMessage(data: unknown) {
        const action = data as GameAction;

        game.action(action);

        // roll the dice after the opponent's move
        if (action.type === 'GAME' || action.type === 'RESET') {
            const dice = randomDice();
            const diceAction: GameAction = { type: 'DICE', value: dice };
            game.action(diceAction);
            p2p.send(diceAction);
        }
    }

    function action(event: CustomEvent<GameAction>) {
        // if game turn is valid, send game event to the opponent
        if (game.action(event.detail)) {
            p2p.send(event.detail);
        }
    }
</script>

<Connection {p2p}>
    <Game {game} on:action={action} />
</Connection>

<MobileSafariTip />
