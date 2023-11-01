import seedrandom from "seedrandom";
import SudokuItem from "./sudokuItem";
import AppEvent, { IAppEvent } from "./appEvent";

class SudokuArray {
    private _random: seedrandom;
    private _items: SudokuItem[];
    private _numbersAvailable: number[][] = [];
    private _undo: UndoItem[] = [];

    private _itemChanged: IAppEvent<SudokuItem>[] = [];
    public gameOver: IAppEvent<void> = new AppEvent<void>();

    public constructor(seed?: string) {
        this._random = new (seedrandom as any)(seed);
        this._items = [];
        this._numbersAvailable = [[]];

        for (let i = 0; i < 81; i++) {
            this._itemChanged.push(new AppEvent<SudokuItem>());
        }

        this.create();
    }

    public addItemChangedHandler(row: number, column: number, handler: { (data: SudokuItem): void }): void {
        this._itemChanged[this.toIndex(row, column)].addHandler(handler);
    }
    public removeItemChangeHandler(row: number, column: number, handler: { (data: SudokuItem): void }): void {
        this._itemChanged[this.toIndex(row, column)].removeHandler(handler);
    }

    public toIndex(row: number, column: number): number {
        return row * 9 + column;
    }
    public indexToRow(index: number): number {
        return Math.floor(index / 9);
    }
    public indexToColumn(index: number): number {
        return Math.floor(index % 9);
    }
    public toRegionNumber(row: number, col: number): number {
        return Math.floor(row / 3) * 3 + Math.floor(col / 3);
    }
    private toRegionIndex(regionNumber: number): number {
        return this.toIndex(Math.floor(regionNumber / 3) * 3, Math.floor(regionNumber % 3) * 3);
    }
    private getRow(arr: number[], row: number): number[] {
        let index = this.toIndex(row, 0);
        return arr.slice(index, index + 9);
    }
    private getColumn(arr: number[], col: number): number[] {
        let result = [];
        for (let index = this.toIndex(0, col); index < 81; index += 9) {
            result.push(arr[index]);
        }
        return result;
    }

    private getRegion(arr: number[], regionNumber: number): number[] {
        let index = this.toRegionIndex(regionNumber);
        return [
            arr[index], arr[index + 1], arr[index + 2],
            arr[index + 9], arr[index + 10], arr[index + 11],
            arr[index + 18], arr[index + 19], arr[index + 20]
        ];
    }
    private isValidValue(arr: number[], row: number, column: number, value: number): boolean {
        if (value < 1 || value > 9) {
            return false;
        }

        let arrRow = this.getRow(arr, row);
        let arrCol = this.getColumn(arr, column);
        let arrReg = this.getRegion(arr, this.toRegionNumber(row, column));

        return !(arrRow.includes(value) || arrRow.includes(-value)) &&
            !(arrCol.includes(value) || arrCol.includes(-value)) &&
            !(arrReg.includes(value) || arrReg.includes(-value));
    }
    private resetNumbersAvailable(): void {
        this._numbersAvailable.length = 0;
        for (let i = 0; i < 81; i++) {
            this._numbersAvailable.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }
    }
    private resetNumbersAvailableForIndex(index: number): void {
        this._numbersAvailable[index] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    private getAvailableNumber(index: number): number {
        if (this._numbersAvailable[index].length === 0) {
            throw Error("NoAvailableNumbers");
        }
        let item = this.getRandomInt(this._numbersAvailable[index].length);
        let value = this._numbersAvailable[index][item];
        this._numbersAvailable[index].splice(item, 1);
        return value;
    }
    private getValidNumber(arr: number[], index: number): number {
        let value = 0;
        while (!this.isValidValue(arr, this.indexToRow(index), this.indexToColumn(index), value)) {
            if (this._numbersAvailable[index].length === 0) {
                return 0;
            }
            value = this.getAvailableNumber(index);
        }
        return value;
    }
    private getAvailableNumbers(arr: number[], index: number): number[] {
        let result = [];
        let row = this.indexToRow(index);
        let col = this.indexToColumn(index);

        for (let i = 1; i < 10; i++) {
            if (this.isValidValue(arr, row, col, i)) {
                result.push(i);
            }
        }
        return result;
    }
    private create(): void {
        let values: number[] = [81];
        let puzzle: number[] = [81];
        let solution: number[];

        this.resetNumbersAvailable();
        for (let index = 0; index < 81; index++) {
            values[index] = this.getValidNumber(values, index);

            if (values[index] === 0) {
                // backtrack
                this.resetNumbersAvailableForIndex(index);
                index -= 2;
                continue;
            }
        }
        solution = values.slice(0);

        let lastPuzzle = values.slice(0);
        let iteration = values.slice(0);

        iteration[this.toIndex(0, 1)] = 0;
        iteration[this.toIndex(1, 0)] = 0;
        this.blankSquares(iteration);

        while (this.getNumberOfSolutions(values, iteration) === 1) {
            lastPuzzle = iteration.slice(0);
            this.blankSquares(iteration);
        }
        puzzle = lastPuzzle;
        values = puzzle.slice(0);

        for (let index = 0; index < 81; index++) {
            let row = Math.floor(index / 9);
            let column = Math.floor(index % 9);
            this._items[index] = new SudokuItem(row, column, -values[index], solution[index], this.getAvailableNumbers(values, index));
        }
    }
    private blankSquares(arr: number[]): void {
        let r = this.getRandomInt(9);
        let c = this.getRandomInt(9);

        while (arr[this.toIndex(r, c)] === 0) {
            r = this.getRandomInt(9);
            c = this.getRandomInt(9);
        }
        arr[this.toIndex(r, c)] = 0;
    }
    private solveValues(values: number[], puz: number[]): void {
        values = puz.slice(0);
        this._numbersAvailable.length = 0;
        for (let i = 0; i < 81; i++) {
            values[i] = -values[i];
            this._numbersAvailable.push(values[i] === 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [values[i]]);
        }
        for (let index = 0; index < 81; index++) {
            if (index < 0) {
                throw new Error("No Solutions");
            }

            if (values[index] < 0) {
                continue;
            }

            values[index] = this.getValidNumber(values, index);

            if (values[index] === 0) {
                // backtrack
                this.resetNumbersAvailableForIndex(index);
                let i = index - 1;
                for (; i > -1; i--) {
                    if (values[i] > 0) {
                        break;
                    }
                }
                index = i - 1;
                continue;
            }
        }

        for (let i = 0; i < 81; i++) {
            values[i] = Math.abs(values[i]);
        }
    }
    private getNumberOfSolutions(values: number[], puz: number[]): number {
        let firstIndex = -1;
        for (let i = 0; i < 81; i++) {
            if (puz[i] === 0) {
                firstIndex = i;
                break;
            }
        }
        let validFirstValues = [];
        values = puz.slice(0);

        for (let i = 1; i <= 9; i++) {
            if (this.isValidValue(values, this.indexToRow(firstIndex), this.indexToColumn(firstIndex), i)) {
                validFirstValues.push(i);
            }
        }
        let result = 0;
        for (let i = 0; i < validFirstValues.length; i++) {
            puz[firstIndex] = validFirstValues[i];
            try {
                this.solveValues(values, puz);
                result++;
            }
            catch (err) { }
            finally {
                puz[firstIndex] = 0;
            }
        }
        return result;
    }
    private getRandomInt(max: number): number {
        return Math.floor(this._random() as unknown as number * max);
    }
    private rowColFromRegion(reg: number): number[] {
        return [Math.floor(reg / 3) * 3, Math.floor(reg % 3) * 3];
    }
    public setItemValue(item: SudokuItem, value: number): void {
        this.setItemValueInternal(item, value);
    }
    private setItemValueInternal(item: SudokuItem, value: number, pushUndo: boolean = true): void {
        let index = this.toIndex(item.row, item.column);
        let values = this._items.map(x => x.value);

        if (pushUndo) {
            this._undo.push(new UndoItem(index, values[index]));
        }

        values[index] = value;

        let itemEvent = this._itemChanged as AppEvent<SudokuItem>[];

        let indexes: number[] = [];

        let rowIndex = this.toIndex(item.row, 0);
        for (let i = rowIndex; i < rowIndex + 9; i++) {
            indexes.push(i);
        }

        for (let i = this.toIndex(0, item.column); i < 81; i += 9) {
            indexes.push(i);
        }

        let regionIndex = this.toRegionIndex(this.toRegionNumber(item.row, item.column));
        indexes.push(regionIndex);
        indexes.push(regionIndex + 1);
        indexes.push(regionIndex + 2);
        indexes.push(regionIndex + 9);
        indexes.push(regionIndex + 10);
        indexes.push(regionIndex + 11);
        indexes.push(regionIndex + 18);
        indexes.push(regionIndex + 19);
        indexes.push(regionIndex + 20);

        let distinct = new Set(indexes);
        distinct.forEach(i => {
            if (this._items[i].value === 0 || i === index) {
                let oldItem = this._items[i];
                this._items[i] = new SudokuItem(oldItem.row, oldItem.column, (i === index) ? value : oldItem.value, oldItem.solution, this.getAvailableNumbers(values, i));
                itemEvent[i].raiseEvent(this._items[i]);
            }
        });

        if (!this._items.some(x => x.value === 0)) {
            (this.gameOver as AppEvent<void>).raiseEvent();
        }
    }
    public getRegionItems(region: number): SudokuItem[] {
        let regOrig = this.rowColFromRegion(region);
        let index = this.toIndex(regOrig[0], regOrig[1]);

        return [
            this._items[index],
            this._items[index + 1],
            this._items[index + 2],
            this._items[index + 9],
            this._items[index + 10],
            this._items[index + 11],
            this._items[index + 18],
            this._items[index + 19],
            this._items[index + 20]
        ];
    }
    public undo(): void {
        if (this._undo.length > 0) {
            let undoItem = this._undo.pop()!;
            this.setItemValueInternal(this._items[undoItem.index], undoItem.value, false);
        }
    }
    public reset(): void {
        this._undo.length = 0;
        this._items.forEach(x => {
            if (x.value > 0) {
                this.setItemValueInternal(x, 0);
            }
        });
    }
}

class UndoItem {
    index: number;
    value: number;

    constructor(index: number, value: number) {
        this.index = index;
        this.value = value;
    }
}

export default SudokuArray;
