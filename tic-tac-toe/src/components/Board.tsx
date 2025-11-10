import Square from './Square';

import { type BoardState } from '../types';

type BoardProps = {
    squares: BoardState,
    onPlay(index: number): void,
    winLine: number[]
}

const Board = ({ squares, onPlay, winLine}: BoardProps) => {
    return (
        <div className="row">
           {squares.map((val, i) => {
                return (
                    <Square
                        key={i}
                        value={val}
                        onClick={() => onPlay(i)}
                        highlight={winLine.includes(i)}
                    />
                )
           })} 
        </div>
    )
}

export default Board;