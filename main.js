/* Factoryfunction for fields */
// value could be a number, nothing, or a mine
const Field = (x, y, value) => {
    let revealed = false;

    const reveal = () => {
        revealed = true;
    }

    const getReveal = () => {
        return revealed;
    }

    return {x, y, value, getReveal};
}

// Board module: Everything related to creating the game board
const Board = ( () => {
    let _board = [];
    let _numOfColumns = 0; 
    let _numOfRows = 0; 
    let _mine = "X";

    const createCompleteBoard = (columns, rows, numOfMines) => {
        _board = [];
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

// DOM module: Everything related to creating and updating the DOM
const DOM = ( () => {
    let _fields;
    const container     = document.querySelector("#game-container");
    const beginner      = document.querySelector("#beginner");
    const intermediate  = document.querySelector("#intermediate");
    const expert        = document.querySelector("#expert");

    const getBoard = () => {
        return this._board;
    }

    const createDom = (difficulty) => {
        clearDom();
        columns = this._board[0].length;

       
        if (difficulty === "beginner"){
            container.setAttribute("style", "width: 24% !important");
        } else if (difficulty === "intermediate") {
            container.setAttribute("style", "width: 42% !important");
        } else {
            container.setAttribute("style", "width: 79% !important");
        }

        container.setAttribute("style", `grid-template-columns: repeat(${columns}, 1fr)`)


        for (let row = 0; row < this._board.length; row++){
            for (let col = 0; col < this._board[0].length; col++){
                let fieldContainer = document.createElement("div");
                fieldContainer.classList.add("field-container");

                let field = document.createElement("button");
                field.classList.add("field");
                field.value = this._board[row][col].value;                   // Delete this (because user can cheat);
                field.dataset.row = row;
                field.dataset.col = col;
                field.dataset.revealed = this._board[row][col].getReveal();
                field.textContent = "";

                fieldContainer.appendChild(field);
                container.appendChild(fieldContainer);
            }
        }
    };

    const clearDom = () => {
        while(container.firstChild) {
            container.removeChild(container.lastChild);
        }
    }

    const createBoard = () => {
        beginner.addEventListener("click", (e) => {
            Board.createCompleteBoard(9, 9, 10);
            this._board = Board.getBoard(); 
            createDom("beginner");
            revealFieldAfterClick();
        });

        intermediate.addEventListener("click", (e) => {
            Board.createCompleteBoard(16, 16, 40);
            this._board = Board.getBoard();
            createDom("intermediate");
            revealFieldAfterClick();
        });

        expert.addEventListener("click", (e) => {
            Board.createCompleteBoard(30, 16, 99);
            this._board = Board.getBoard();
            console.log(typeof (this._board));
            createDom("expert");
            revealFieldAfterClick();
        });
    };

    const revealFieldAfterClick = () => {
        _fields = document.querySelectorAll(".field");

        _fields.forEach( (field) => {
            field.addEventListener("click", (e) => {
                field.textContent = field.value;            // Look coordinates up in Dom._board (instead of saving value in html);
            });
        });
    }

    return { createBoard, getBoard };
})();

// Game module: Game logic and start

DOM.createBoard();


/* ToDo
    - Better if only coordinates are saved in a field => on click app should look up in database => no cheating possible
    - When clicking on a "0" all neighboring "0"s should open as well => Recursion?
    - When clicking on an "X" end the game
    - When alle fields are revealed, end the game
    - Dynamically change width of container when choosing a level (beginner, ...)
    - Styling: Numbers, fields, buttons (retro style like the windows version?)


    Nice to have
    - Timer to measure time
    - Save times in localstorage

*/

/*
Pseudocode:

function revealNeighborsIfZero(column, row) {
    if (field[row][column] === 0) {
        Loop through the neighbors (row)
            Loop through the neighbors (column)
                Open neighbor if it's not already opened
                revealNeighborsIfZero(column, row);
                // Or here? Open neighbor if it's not already opened
    }
    return;
}

*/