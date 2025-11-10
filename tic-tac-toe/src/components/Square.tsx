import type { SquareValue } from "../types";

type SquareProps = {
    value: SquareValue;
    onClick(): void;
    highlight: boolean;
}

const Square = ({
    value,
    onClick,
    highlight
}: SquareProps) => {
    return (
        <button
            className={`square${highlight ? 'win' : ''}`}
            onClick={onClick}
            aria-label="square">
            {value}
        </button>
    )
}

export default Square;