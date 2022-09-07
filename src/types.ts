import type { DiceValue, GameEvent } from './modules/game/types';

export type Message = { type: 'game'; event: GameEvent } | { type: 'dice'; value: DiceValue };
