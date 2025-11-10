export type Disc = 'R' | 'Y' | null;

export type Board = Disc[][];

export type WinResult = {
    winner: 'R' | 'Y' | null;
    line: Array<[number, number]>
}