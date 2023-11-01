import React from "react";
import CellGroup from "./cellgroup";
import { boardValuesContext } from "../App";

const Board = () => {
    const boardArray = React.useContext(boardValuesContext)!;
    React.useEffect(() => {
        boardArray.gameOver.addHandler(onGameOver);

        return () => {
            boardArray.gameOver.removeHandler(onGameOver);
        };
    }, [boardArray]);

    const onGameOver = () => {
        Array.from(document.getElementsByClassName("board-button-container")).map(x => x.classList.add("hidden"));
        Array.from(document.getElementsByClassName("board-solved")).map(x => x.classList.remove("hidden"));
    };

    const undo = () => {
        boardArray.undo();
    };
    const reset = () => {
        boardArray.reset();
    };

    return (
        <div className="board-container">
            <div className="grid-board">
                <CellGroup className="cell-item-1" region={0} />
                <CellGroup className="cell-item-2" region={1} />
                <CellGroup className="cell-item-3" region={2} />
                <CellGroup className="cell-item-4" region={3} />
                <CellGroup className="cell-item-1" region={4} />
                <CellGroup className="cell-item-1" region={5} />
                <CellGroup className="cell-item-1" region={6} />
                <CellGroup className="cell-item-1" region={7} />
                <CellGroup className="cell-item-1" region={8} />
            </div>
            <div className="board-button-container">
                <button className="board-button" onClick={undo}>Undo</button>
                <button className="board-button" onClick={reset}>Reset</button>
            </div>
            <div className="board-solved hidden">SOLVED!!!</div>
        </div>
    );
};

export default Board;
