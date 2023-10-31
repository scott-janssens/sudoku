export default class SudokuItem {
    public constructor(row: number, column: number, value: number, solution: number, available: number[]) {
        this._row = row;
        this._column = column;
        this._value = value;
        this._solution = solution
        this._available = available;
    }

    private _row: number = 0;
    get row(): number {
        return this._row;
    }

    private _column: number = 0;
    get column(): number {
        return this._column;
    }

    private _value: number = 0;
    get value(): number {
        return this._value;
    }

    private _solution: number = 0;
    get solution(): number {
        return this._solution;
    }

    private _available: number[] = [];
    get available(): number[] {
        return this._available;
    }
}
