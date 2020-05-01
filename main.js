/* 
    Minesweeper 

    Beginner: 9 rows, 9 columns, 10 mines
    Intermediate: 16 rows, 16 columns, 40 mines
    Expert: 16 rows, 30 columns, 99 mines
*/

/* Factory function for a field */
// value could be a number, nothing, or a mine
const Field = (x, y, value) => {
    let revealed = false;

    const reveal = () => {
        revealed = true;
    }

    return {x, y, value, reveal};
}

// Board module (because only need one Board)
const Board = ( () => {
    let _board = [];
    let _numOfColumns = 0; 
    let _numOfRows = 0; 
    let _mine = "X";

    const createCompleteBoard = (columns, rows, numOfMines) => {
        createEmptyBoard(columns, rows);
        _numOfColumns = _board.length === 0 ? 0 : _board[0].length;
        _numOfRows = _board.length;

        // Add mines
        let mines = createMines(numOfMines);
        addMinesToBoard(mines);

        // Add numbers
        addNumbersToBoard();
    }

    const createEmptyBoard = (columns, rows) => {
        for (let row = 0; row < rows; row++){

            let completeRow = []
            for (let col = 0; col < columns; col++){
                let field = Field(col, row, "o");
                completeRow.push(field);
            }
            _board.push(completeRow);
        }
        return _board;
    };

    const getBoard = () => {
        return _board;
    }

    const showBoard = () => {
        for (let i = 0; i < _numOfRows; i++) {
            let row = "";
            for (j = 0; j < _numOfColumns; j++){
                row += _board[i][j].value;
            }
            console.log(row);
        }
    }

    const createMines = (numOfMines) => {
        let mines = [];

        while (mines.length < numOfMines) {
            let boardcolumns  = _board[0].length;
            let boardrows = _board.length;
            let randomX = Math.floor(Math.random() * boardcolumns);
            let randomY = Math.floor(Math.random() * boardrows);

            // No mine should be on the same field (no duplicates)
            if (!arrayWithArrayIncludesArray(mines, [randomX, randomY])){
                mines.push([randomX, randomY]);
            }
        }

        return mines;
    }

    const addMinesToBoard = (mines) => {
        mines.forEach(mine => {
            let x = mine[0];
            let y = mine[1];

            // Attention: x = columns, y = rows, so we have to switch
            _board[y][x].value = _mine;
        });
    }

    const addNumbersToBoard = () => {
        for (let row = 0; row < _numOfRows; row++){
            for (let column = 0; column < _numOfColumns; column++){
                setSumOfNeighboringMines(column, row);
            }
        }
    }

    const setSumOfNeighboringMines = (column, row) => {
        // If coordinates are mines, they should not change-
        if (_board[row][column].value === _mine){
            return; 
        }

        // Set coordinates of neighbors (for edge cases and normal cases)
        // Refactor to own function?
        let startRow;
        let endRow;
        let startColumn;
        let endColumn;
        
        column === 0 ? startColumn = column : startColumn = column - 1;
        column === _numOfColumns - 1? endColumn = column : endColumn = column + 1;
        row === 0 ? startRow = row : startRow = row - 1;
        row === _numOfRows - 1? endRow = row : endRow = row + 1;

        // Calculate sum of neighboring mines
        let sum = 0;

        for (let i = startRow; i <= endRow; i++ ){
            for (let j = startColumn; j <= endColumn; j++) {
                if (_board[i][j].value === _mine) {
                    sum++; 
                }
            }
        }
        _board[row][column].value = sum;
    }

    // Helper functions
    const arraysIdentical = (array1, array2) => {
        if (array1.length !== array2.length) {
            return false;
        } 

        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }

    const arrayWithArrayIncludesArray = (arrayWithArray, array) => {
        for (let i = 0; i < arrayWithArray.length; i++){
            if (arraysIdentical(arrayWithArray[i], array)) {
                return true;
            }
        }
        return false;
    }

    return { createCompleteBoard, getBoard, showBoard };
})();

Board.createCompleteBoard(9, 9, 10);