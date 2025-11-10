import { useEffect, useMemo } from 'react';
import useLocalState from './hooks/use-local-state';

import type { Board, Disc, WinResult } from '../types';

/** Board dimensions. Standard Connect 4 is 6 rows × 7 columns. */
const ROWS = 6
const COLS = 7

const emptyBoard = (): Board => {
	return Array.from({ length: ROWS }, () => Array<Disc>(COLS).fill(null))	
}

const dropDisc = (board: Board, col: number, disc: 'R' | 'Y'): Board | null => {
	for (let r = ROWS - 1; r  >= 0; r--) {
		if (board[r][col] === null) {
			const next = board.map(row => row.slice());
			next[r][col] = disc;
			return next;
		}
	}
	return null;
}

const scanWinner = (board: Board): WinResult => {
	const directions: Array<[number, number]> = [
		[0, 1], // right
		[1, 0], // down
		[1, 1], // diagonal right down
		[1, -1], // diagonal left down
	]

	for (let row = 0; row < ROWS; row++) {
		for (let col = 0; col < COLS; col++) {
			const start = board[row][col];
			if (!start) {
				continue;
			}

			for (const [dr, dc] of directions) {
				const line: Array<[number, number]> = [[row, col]];
				for (let k = 1; k < 4; k++) {
					const rr = row + dr * k;
					const cc = col + dc * k;
					if (rr < 0 || rr >= ROWS || cc <  0 || cc >= COLS) {
						break;
					}

					if (board[rr][cc] !== start) {
						break;
					}

					line.push([rr, cc]);
				}
				if (line.length === 4) {
					return {
						winner: start,
						line
					}
				}
			}
		}
	}

	return {
		winner: null,
		line: []
	}
}

const hasMoves = (board: Board): boolean => {
	return board[0].some(cell => cell === null);
}

const CHIP = {
	R: 'bg-rose-500',
	Y: 'bg-amber-400'
}

const Game = () => {
	const [board, setBoard] = useLocalState<Board>("c4:board", emptyBoard());
	const [isRedNext, setIsRedNext] = useLocalState<boolean>("c4:red", true);

	const { winner, line } = useMemo(() => scanWinner(board), [board]);
	const draw = !winner && !hasMoves(board);
	const turnDisc: 'R' | 'Y' = isRedNext ? 'R' : 'Y';

	const status = winner ?
		`Winner: ${winner === 'R' ? 'Red' : 'Yellow'}` :
		draw ?
			"Draw" :
			`Turn ${turnDisc === 'R' ? 'Red' : 'Yellow'}`

	const play = (col: number) => {
		if (winner) {
			return;
		}
		const next = dropDisc(board, col, turnDisc);
		if (!next) {
			return;
		}
		setBoard(next);
		setIsRedNext(prevState => !prevState);
	}

	const reset = () => {
		setBoard(emptyBoard());
		setIsRedNext(true);
	}

	const swapStarter = () => {
		setBoard(emptyBoard());
		setIsRedNext(prevState => !prevState);
	}

	const isWinningCell = (row: number, col: number) => {
		return line.some(([rr, cc]) => rr === row && cc === col);
	}

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (winner) {
				return;
			}
			// this assumes that the user hits a number key that corresponds to the column to insert into
			const col = Number(e.key) - 1;

			if (col >= 0 && col < COLS) {
				play(col);
			}
		}

		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
		}
	}, [winner, board, isRedNext]);


    return (
        <div className="mx-auto">
            {/* Header */}
			<div className="flex items-end justify-between mb-4">
				<div>
					<h1 className="text-xl font-bold tracking-tight">Connect 4</h1>
					<p className="text-xs text-slate-400">6x7 grid - first to four-in-a-row</p>
				</div>
				<div className="inline-flex items-center gap-2">
					<span className="text-xs px-2 py-1 rounded-full border border-slate-700 bg-slate-900/60">
						{status}
					</span>
					<div className="flex items-center gap-1 text-xs text-slate-400">
						<span className={`inline-block w-3 h-3 rounded-full ${CHIP.R}`} />
						Red
						<span className="mx-1 opacity-50">/</span>
						<span className={`inline-block w-3 h-3 rounded-full ${CHIP.Y}`} />
						Yellow
					</div>
				</div>
			</div>

			{/* Column click targets (big and friendly) */}
			<div className="grid grid-cols-7 gap-1 mb-2">
				{Array.from({ length: COLS }, (_, c) => {
					const full = board[0][c] !== null
					return (
						<button
						key={c}
						onClick={() => play(c)}
						disabled={full || !!winner}
						className={`h-9 rounded-md border border-slate-700 bg-slate-900/60 text-xs font-semibold
									hover:bg-slate-800/70 disabled:opacity-40`}
						title={`Drop in column ${c + 1}`}
						>
						Col {c + 1}
						</button>
					)
				})}
			</div>

			{/* Board */}
			<div
				className="relative rounded-2xl p-3 pb-4 bg-blue-800/60 border border-blue-900 shadow-lg"
				aria-label="Connect 4 board"
			>
				<div className="grid grid-cols-7 gap-2">
				{board.map((row, r) =>
					row.map((cell, c) => {
					const highlight = isWinningCell(r, c)
					const color =
						cell === "R" ? CHIP.R : cell === "Y" ? CHIP.Y : "bg-slate-800"
					return (
						<button
						key={`${r}-${c}`}
						onClick={() => play(c)}
						className={`aspect-square rounded-full border
							${color}
							${highlight ? "ring-4 ring-emerald-400/70" : "ring-0"}
							border-slate-900 shadow-inner`}
						aria-label={`row ${r + 1} col ${c + 1}`}
						/>
					)
					})
				)}
				</div>
			</div>

			{/* Controls */}
			<div className="mt-4 flex gap-2">
				<button
					onClick={reset}
					className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800/70 font-semibold"
				>
					Restart (Red starts)
				</button>
				
				<button
					onClick={swapStarter}
					disabled={board.every(row => row.every(c => c === null))}
					className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800/70 font-semibold disabled:opacity-40"
				>
					New game (swap starter)
				</button>
			</div>
        </div>
    )
}

export default Game;