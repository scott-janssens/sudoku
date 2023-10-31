import Board from "./components/board";
import './App.css';
import React from "react";
import SudokuArray from "./sudokuArray";

const boardValuesContext = React.createContext<SudokuArray | undefined>(undefined);

function App() {
  let boardArray = new SudokuArray();
  const [boardKey, setBoardKey] = React.useState(0);
  const newPuzzle = () => {
    setBoardKey(boardKey + 1);
  };

  return (
    <boardValuesContext.Provider value={boardArray}>
      <div className="App">
        <Board key={boardKey}/>
        <div>
            <button className="button" onClick={newPuzzle}>New Puzzle</button>
        </div>
      </div>
    </boardValuesContext.Provider>
  );
}

export { boardValuesContext };
export default App;
