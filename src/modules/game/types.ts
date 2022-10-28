export type Player = 1 | 2;
export type Line = 0 | 1 | 2;
export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
export type Cell = { id: number; value: DiceValue | null; removing: boolean };
export type BoardLine = [Cell, Cell, Cell];
export type Board = [BoardLine, BoardLine, BoardLine];

export type GameState =
    | { type: 'init' }
    | {
          type: 'playing';
          boards: Record<Player, Board>;
          currentMove: Player;
          dice: DiceValue | null;
          /** dice spinning */
          pause: boolean;
      }
    | { type: 'end'; result: 'win' | 'lose' | 'draw'; boards: Record<Player, Board> };

export type GameAction = { type: 'DICE'; value: DiceValue } | { type: 'GAME'; line: Line } | { type: 'RESET' };
