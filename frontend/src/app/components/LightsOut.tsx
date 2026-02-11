"use client";
import { useState, useEffect } from "react";
import RoundedImage from "./RoundedImage";
import "./LightsOut.css";

interface Cell {
  on: boolean;
}

type Grid = boolean[][];

const LightsOut = () => {
  const [board, setBoard] = useState<Grid | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [gridSize, setBoardSize] = useState<number>(3);
  const [tempGridSize, setTempGridSize] = useState<number>(3);

  function createBoard(): Grid {
    return Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => Math.random() < 0.5),
    );
  }

  function toggleCell(board: Grid, row: number, col: number): Grid {
    const newBoard = board.map((r) => r.slice());
    newBoard[row][col] = !newBoard[row][col];
    if (row > 0) newBoard[row - 1][col] = !newBoard[row - 1][col];
    if (row < gridSize - 1) newBoard[row + 1][col] = !newBoard[row + 1][col];
    if (col > 0) newBoard[row][col - 1] = !newBoard[row][col - 1];
    if (col < gridSize - 1) newBoard[row][col + 1] = !newBoard[row][col + 1];

    return newBoard;
  }

  useEffect(() => {
    setBoard(createBoard());
  }, [gridSize]);

  if (!board) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-4 text-gray-600">Loading...</span>
      </div>
    );
  }

  const isWin = board.every((row) => row.every((cell) => !cell));

  const handleCellClick = (row: number, col: number) => {
    setBoard((prevBoard) => {
      if (!prevBoard) return prevBoard;
      return toggleCell(prevBoard, row, col);
    });
  };

  const handleReset = () => {
    setBoard(createBoard());
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempGridSize(parseInt(e.target.value, 10));
  };

  const handleSliderRelease = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    setBoardSize(parseInt(target.value, 10));
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <button
        onClick={() => setShow((s) => !s)}
        className="rounded-full border border-amber-500 px-6 py-3 font-semibold text-amber-200/90 hover:bg-amber-900/40 font-semibold transition-colors duration-200"
      >
        {show ? "Hide Game" : "Show Game"}
      </button>
      {show && (
        <>
          <h3 className="text-xl font-semibold mb-4">Recreation of the app</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {board.map((rowArr, rowIdx) => (
              <div key={rowIdx} style={{ display: "flex" }}>
                {rowArr.map((on, colIdx) => (
                  <button
                    key={colIdx}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    className={`w-10 h-10 m-1 rounded border border-gray-500 transition-colors duration-100
                      ${
                        on
                          ? "bg-[var(--square-color-on)]"
                          : "bg-[var(--square-color-off)]"
                      }`}
                    aria-label={`Toggle light at row ${rowIdx + 1}, column ${
                      colIdx + 1
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-row flex-wrap items-center gap-16 justify-center mt-6">
            <button
              onClick={handleReset}
              className="rounded-full border border-amber-500 px-6 py-3 font-semibold text-amber-200/90 hover:bg-amber-900/40 font-semibold transition-colors duration-200"
            >
              New Game
            </button>
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="gridSizeSlider" className="text-sm font-medium">
                Grid Size: {tempGridSize}x{tempGridSize}
              </label>
              <input
                id="gridSizeSlider"
                type="range"
                min="3"
                max="9"
                value={tempGridSize}
                onChange={handleSliderChange}
                onMouseUp={handleSliderRelease}
                onTouchEnd={handleSliderRelease}
                className="slider"
              />
              <div className="flex justify-between w-32 text-xs text-gray-500">
                <span>3</span>
                <span>9</span>
              </div>
            </div>
          </div>
          {isWin && (
            /* <h3 className="mt-4 text-[var(--square-color-on)] text-lg font-bold">Congratulations! You won!</h3> */
            <div className="mt-4">
              <RoundedImage
                src="/congratulations.gif"
                alt="Congratulations!"
                width={300}
                height={500}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LightsOut;
