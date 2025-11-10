import type { PlayerId } from './index.ts';
import type { GameState } from './game.ts';
import type { RoomId } from './room.ts';

export type ClientMessage =
| { type: 'client_ping' }
| { type: 'client_state'; state: GameState }
| { type: 'sync_request' }

export type ServerMessage =
| { type: 'server_welcome'; roomId: RoomId; you: PlayerId }
| { type: 'player_joined'; playerId: PlayerId }
| { type: 'player_left'; playerId: PlayerId }
| { type: 'state_update'; state: GameState }
| { type: 'pong' }
| { type: 'error'; message: string };