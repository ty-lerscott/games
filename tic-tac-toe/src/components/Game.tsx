import { useEffect, useMemo, useState } from 'react';

import Board from './Board';

import type { BoardState, WinnerResult, SquareValue } from '../types';

const WINNING_LINES: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],      // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],      // columns
    [0, 4, 8], [2, 4, 6],                 // diagonals
]

const calculateWinner = (sq: BoardState): WinnerResult => {
    for (const [a, b, c] of WINNING_LINES) {
        if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
            return {
                winner: sq[a],
                line: [a, b, c]
            }
        }
    }

    return {
        winner: null,
        line: []
    }
}

function useLocalState<T>(key: string, init: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? (JSON.parse(raw) as T) : init;
        } catch {
            return init;
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {

        }
    }, [key, value])

    return [value, setValue] as const
}

const Game = () => {
    const [squares, setSquares] = useLocalState<BoardState>('ttt:squares', Array<SquareValue>(9).fill(null));
    const [isXNext, setIsXNext] = useLocalState<boolean>('ttt:isXNext', true);

    const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
    
    const hasMovesLeft = squares.some(s => s === null);

    const draw = !winner && !hasMovesLeft;

    const status = winner ? `Winner ${winner}` : draw ? 'Draw' : `Turn ${isXNext ? 'X' : '0'}`;

    const play = (i: number) => {
        if (squares[i] || winner) {
            return;
        }
        const next = squares.slice();
        next[i] = isXNext ? 'X' : 'O';

        setSquares(next);
        setIsXNext(prevState => !prevState);
    }

    const reset = () => {
        setSquares(Array<SquareValue>(9).fill(null));
        setIsXNext(true);
    }

    const start = () => {
        setSquares(Array<SquareValue>(9).fill(null));
        setIsXNext(prevState => !prevState);
    }

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (winner) return
            const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8 }
            if (e.key in map) play(map[e.key])
        }

        window.addEventListener('keydown', onKey)

        return () => window.removeEventListener('keydown', onKey)
    }, [winner, isXNext, squares])

    return (
        <>
            <div className="header">
                <div className="title">Tic-Tac-Toe</div>
                <div className="meta">
                    <div className="badge">{status}</div>
                    <small>X = first, O = second</small>
                </div>
            </div>

            <Board squares={squares} onPlay={play} winLine={line} />

            <div className="controls">
                <button onClick={reset}>Reset</button>
                <button onClick={start} disabled={squares.every(s => s === null)}>
                    New game (swap starter)
                </button>
            </div>
        </>
    )
}

export default Game;