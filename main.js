/* Factoryfunction for fields */
// value could be a number, nothing, or a mine
const Field = (x, y, value) => {
    let revealed = false;

    const reveal = () => {
        revealed = true;
    }

    const fieldRevealed = () => {
        return revealed;
    }

    return {x, y, value, reveal, fieldRevealed};
}

// Board module: Everything related to creating the game board
const Board = (columns, rows, mines) => {
    let board = [];
    let numOfColumns = columns;
    let numOfRows = rows;
    let numOfMines = mines;
    let mineSymbol = "X";

    const getBoard = () => {
        return board;
    }

    const getNumOfColumns = () => {
        return numOfColumns;
    }

    const getNumOfRows = () => {
        return numOfRows;
    }

    const getNumOfMines = () => {
        return numOfMines;
    }

    const showBoard = () => {
        if (board.length !== 0) {
            for (let i = 0; i < numOfRows; i++) {
                let row = "";
                for (j = 0; j < numOfColumns; j++){
                    row += board[i][j].value;
                }
                console.log(row);
            }
        } else {
            console.log("Nothing in here, buddy!");
        }
    }

    const createCompleteBoard = () => {
        board = [];
        createEmptyBoard();

        // Add mines
        let mines = createMines();
        addMinesToBoard(mines);

        // Add numbers
        addNumbersToBoard();
    };

    const createEmptyBoard = () => {
        for (let row = 0; row < numOfRows; row++){

            let completeRow = []
            for (let col = 0; col < numOfColumns; col++){
                let field = Field(col, row, "o");
                completeRow.push(field);
            }
            board.push(completeRow);
        }
        return board;
    };

    const createMines = () => {
        let mines = [];

        while (mines.length < numOfMines) {
            let randomX = Math.floor(Math.random() * numOfColumns);
            let randomY = Math.floor(Math.random() * numOfRows);

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
            board[y][x].value = mineSymbol;
        });
    }

    const addNumbersToBoard = () => {
        for (let row = 0; row < numOfRows; row++){
            for (let column = 0; column < numOfColumns; column++){
                setSumOfNeighboringMines(column, row);
            }
        }
    }

    // Here column = x, row = y => coordinates! (not number of columns/rows)
    const setSumOfNeighboringMines = (column, row) => {
        // If coordinates are mines, they should not change-
        if (board[row][column].value === mineSymbol){
            return; 
        }

        // Set coordinates of neighbors (for edge cases and normal cases)
        // Refactor to own function?
        let startRow;
        let endRow;
        let startColumn;
        let endColumn;
        
        column === 0 ? startColumn = column : startColumn = column - 1;
        column === numOfColumns - 1? endColumn = column : endColumn = column + 1;
        row === 0 ? startRow = row : startRow = row - 1;
        row === numOfRows - 1? endRow = row : endRow = row + 1;

        // Calculate sum of neighboring mines
        let sum = 0;

        for (let i = startRow; i <= endRow; i++ ){
            for (let j = startColumn; j <= endColumn; j++) {
                if (board[i][j].value === mineSymbol) {
                    sum++; 
                }
            }
        }
        board[row][column].value = sum;
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

    return { createCompleteBoard, showBoard, getBoard, getNumOfColumns, getNumOfRows, getNumOfMines };
};


// DOM module: Everything related to creating and updating the DOM
const DOM = ( () => {
    let board; 
    let fields;
    const container     = document.querySelector("#game-container");
    const beginner      = document.querySelector("#beginner");
    const intermediate  = document.querySelector("#intermediate");
    const expert        = document.querySelector("#expert");

    const getBoard = () => {
        return board;
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
        fields = document.querySelectorAll(".field");

        fields.forEach( (field) => {
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
    - Make Board a class/factory (because I want to use all the board methods somewhere else. Not possible in a module)


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