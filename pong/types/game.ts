import type { PlayerId } from './index.ts';

export type GameState = {
    ball: {
        x: number;
        y: number;
        vx: number;
        vy: number;
    };
    paddles: Record<PlayerId, { y: number; }>;
    score: Record<PlayerId, number>;
    lastUpdated: number;
}