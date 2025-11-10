import type { PlayerId } from './index.ts';
import type { GameState } from './game.ts';

export type RoomId = string;

export type Room = {
    id: RoomId;
    name: string;
    players: Map<PlayerId, WebSocket>;
    state: GameState | null;
}

export type RoomSummary = Omit<Room, 'players'> & {
    players: number;
}