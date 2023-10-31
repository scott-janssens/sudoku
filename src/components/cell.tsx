/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { boardValuesContext } from "../App";
import SudokuItem from "../sudokuItem";

interface Props {
    className: string,
    item: SudokuItem
}

export class ItemValueChangedParams {
    private _item: SudokuItem;
    get item(): SudokuItem {
        return this._item;
    }

    private _value: number;
    get value(): number {
        return this._value;
    }

    constructor(item: SudokuItem, value: number) {
        this._item = item;
        this._value = value;
    }
}

const Cell: React.FC<Props> = (props) => {
    const context = React.useContext(boardValuesContext)!;
    const [item, setItem] = React.useState(props.item);

    const onItemValueChanged = React.useCallback((newItem: SudokuItem) => {
        setItem(newItem);
    }, [item]);

    React.useEffect(() => {
        context.addItemChangedHandler(props.item.row, props.item.column, onItemValueChanged);

        return () => {
            context.removeItemChangeHandler(props.item.row, props.item.column, onItemValueChanged);
        };
    }, [item]);

    if (item.value < 0) {
        return (
            <div className="cell-puzzle">
                {item.solution}
            </div>
        );
    }

    if (item.value > 0) {
        const unsetValue = () => {
            context.setItemValue(item, 0);
        };

        return (
            <div className="cell-value" onClick={unsetValue}>
                {item.value}
            </div>
        );
    }

    const setValue = (value: number) => {
        context.setItemValue(item, value);
    };

    return (
        <div className="grid-cell">
            <div className={"cell-item-1" + (item.available.includes(1) ? '' : ' cell-item-unavailable')} onClick={() => setValue(1)}>1</div>
            <div className={"cell-item-2" + (item.available.includes(2) ? '' : ' cell-item-unavailable')} onClick={() => setValue(2)}>2</div>
            <div className={"cell-item-3" + (item.available.includes(3) ? '' : ' cell-item-unavailable')} onClick={() => setValue(3)}>3</div>
            <div className={"cell-item-4" + (item.available.includes(4) ? '' : ' cell-item-unavailable')} onClick={() => setValue(4)}>4</div>
            <div className={"cell-item-5" + (item.available.includes(5) ? '' : ' cell-item-unavailable')} onClick={() => setValue(5)}>5</div>
            <div className={"cell-item-6" + (item.available.includes(6) ? '' : ' cell-item-unavailable')} onClick={() => setValue(6)}>6</div>
            <div className={"cell-item-7" + (item.available.includes(7) ? '' : ' cell-item-unavailable')} onClick={() => setValue(7)}>7</div>
            <div className={"cell-item-8" + (item.available.includes(8) ? '' : ' cell-item-unavailable')} onClick={() => setValue(8)}>8</div>
            <div className={"cell-item-9" + (item.available.includes(9) ? '' : ' cell-item-unavailable')} onClick={() => setValue(9)}>9</div>
        </div>
    );
};

export default Cell;
