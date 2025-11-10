export type SquareValue = 'X' | 'O' | null;
export type BoardState = SquareValue[];

export type WinnerResult = {
    winner: 'X' | 'O' | null;
    line: number[]
}
