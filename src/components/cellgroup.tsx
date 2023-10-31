import React from "react";
import Cell from "./cell";
import { boardValuesContext } from "../App";

interface Props {
    className: string,
    region: number
}

const CellGroup: React.FC<Props> = (props) => {
    const context = React.useContext(boardValuesContext)!;
    let items = context.getRegionItems(props.region);

    return (
        <div className="grid-cell-group">
            <Cell className="cell-item-1" item={items[0]} />
            <Cell className="cell-item-2" item={items[1]} />
            <Cell className="cell-item-3" item={items[2]} />
            <Cell className="cell-item-4" item={items[3]} />
            <Cell className="cell-item-5" item={items[4]} />
            <Cell className="cell-item-6" item={items[5]} />
            <Cell className="cell-item-7" item={items[6]} />
            <Cell className="cell-item-8" item={items[7]} />
            <Cell className="cell-item-9" item={items[8]} />
        </div>
    );
};

export default CellGroup;
