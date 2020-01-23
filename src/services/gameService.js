const CORRECT_SCORE = 5;
const INCORRECT_SCORE = -1;
const colors = [
  'blue',
  'green',
  'red',
  'yellow',
  'orange',
  'brown',
  'gray',
  'pink',
];

/*

  {
    color: Color,
    isSelected: boolean,
    isRemoved: boolean,
  }

 */

function generateCells() {
  const cells = [];

  for (const color of colors) {
    cells.push(
      {
        isSelected: false,
        isRemoved: false,
        color,
      },
      {
        isSelected: false,
        isRemoved: false,
        color,
      },
    );
  }

  return cells;
}

function shuffle(arr, numOfSwap = arr.length * 2) {
  const arrClone = [...arr];

  for (let i = 0; i < numOfSwap; i++) {
    const idx1 = Math.floor(Math.random() * arrClone.length);
    const idx2 = Math.floor(Math.random() * arrClone.length);

    [arrClone[idx1], arrClone[idx2]] = [arrClone[idx2], arrClone[idx1]];
  }

  return arrClone;
}

function createBoard() {
  const cells = shuffle(generateCells());
  const cellColorByRow = [];

  cells.forEach((color, idx) => {
    if (idx % 4 === 0) {
      cellColorByRow.push([color]);
    } else {
      const rowIdx = Math.floor(idx / 4);

      cellColorByRow[rowIdx].push(color);
    }
  });

  return cellColorByRow;
}

// cell = { row: number; col: number };
function getBoardAction(board, selectedCells) {
  const boardInfo = {
    cardToFlipUp: [],
    cardToFlipDown: [],
    cardToRemove: [],
  };

  if (selectedCells.length === 1) {
    const { row, col } = selectedCells[0];

    boardInfo.cardToFlipUp.push({ row, col });
  } else if (selectedCells.length === 2) {
    const { row: row1, col: col1 } = selectedCells[0];
    const { row: row2, col: col2 } = selectedCells[1];

    if (isSameCell(selectedCells[0], selectedCells[1])) {
      return boardInfo;
    }

    boardInfo.cardToFlipUp.push({ row: row2, col: col2 });
    boardInfo.cardToFlipDown.push(
      { row: row1, col: col1 },
      { row: row2, col: col2 },
    );

    if (isMatch(board, selectedCells)) {
      boardInfo.cardToRemove.push(
        { row: row1, col: col1 },
        { row: row2, col: col2 },
      );
    }
  }

  return boardInfo;
}

function flipCard(board, cells, toBeFacedUp) {
  // deep clone the board
  const newBoard = board.map(row => row.map(col => ({ ...col })));

  cells.forEach(cell => {
    const { row, col } = cell;

    newBoard[row][col].isSelected = toBeFacedUp;
  });

  return newBoard;
}

function removeCard(board, cells) {
  // deep clone the board
  const newBoard = board.map(row => row.map(col => ({ ...col })));

  cells.forEach(cell => {
    const { row, col } = cell;

    newBoard[row][col].isRemoved = true;
  });

  return newBoard;
}

function getScoreChange(board, selectedCells) {
  if (selectedCells.length < 2) {
    return 0;
  }

  if (isMatch(board, selectedCells)) {
    return CORRECT_SCORE;
  } else {
    return INCORRECT_SCORE;
  }
}

function isMatch(board, selectedCells) {
  if (selectedCells.length < 2) {
    return false;
  }

  const { row: row1, col: col1 } = selectedCells[0];
  const { row: row2, col: col2 } = selectedCells[1];

  return board[row1][col1].color === board[row2][col2].color;
}

function isSameCell(cellA, cellB) {
  if (!cellA || !cellB) {
    return false;
  }

  return cellA.row === cellB.row && cellA.col === cellB.col;
}

function isGameOver(board) {
  return (
    board.length > 0 && board.every(row => row.every(cell => cell.isRemoved))
  );
}

function checkIsHighScore(scoreData, score) {
  if (scoreData.length < 5) {
    return true;
  }

  return scoreData[4].score < score;
}

export {
  createBoard,
  getBoardAction,
  flipCard,
  removeCard,
  getScoreChange,
  isMatch,
  isSameCell,
  isGameOver,
  checkIsHighScore,
};
