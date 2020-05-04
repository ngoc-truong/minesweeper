// Fields factoryfunction
const Field = (x, y, value) => {
    let revealed = false;

    const reveal = () => {
        revealed = true;
    }

    const fieldRevealed = () => {
        return revealed;
    }

    const getCoordinates = () => {
        return `(${x}, ${y})`;
    }

    return {x, y, value, reveal, fieldRevealed, getCoordinates};
}

// Board factoryfunction: Everything related to creating the game board
const Board = (columns, rows, mines) => {
    let board = [];
    let numOfColumns = columns;
    let numOfRows = rows;
    let numOfMines = mines;
    let mineSymbol = "🐒";

    // Getter and setter methods
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

    const getMineSymbol = () => {
        return mineSymbol; 
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

        // Calculate sum of neighboring mines
        let sum = 0;
        let neighbors = getNeighborCoordinates(column, row);

        neighbors.forEach( (neighbor) => {
            let x = neighbor[0];
            let y = neighbor[1];
            if (board[y][x].value === mineSymbol) {
                sum++
            }
        })
        
        board[row][column].value = sum;
    }

    const getNeighborCoordinates = (column, row) => {
        // Convert to number
        column = Number(column);
        row = Number(row);

        let startRow;
        let endRow;
        let startColumn;
        let endColumn;
        let neighbors = [];

        // Set start and end values for for-loop, depending on coordinates
        column === 0 ? startColumn = column : startColumn = column - 1;
        column === numOfColumns - 1? endColumn = column : endColumn = column + 1;
        row === 0 ? startRow = row : startRow = row - 1;
        row === numOfRows - 1? endRow = row : endRow = row + 1;

        for (let i = startRow; i <= endRow; i++ ){
            for (let j = startColumn; j <= endColumn; j++) {
                if ( !(i === row && j === column) ) { // Do not add original field into neighbors
                    neighbors.push([j, i]);
                }
            }
        }
        
        return neighbors; 
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

    return { createCompleteBoard, showBoard, getBoard, getNumOfColumns, getNumOfRows, getNumOfMines, getNeighborCoordinates, getMineSymbol };
};


// Game module (including everything related to the DOM)
const Game = ( () => {
    let board; 
    let fields;
    const display       = document.querySelector("#display");
    const gameContainer = document.querySelector("#game-container");
    const container     = document.querySelector("#container");    
    const beginner      = document.querySelector("#beginner");
    const intermediate  = document.querySelector("#intermediate");
    const expert        = document.querySelector("#expert");

    // Getter and setter methods

    const getBoardObject = () => {
        return board;
    };
    
    const getAllNumbers = () => {
        let numbers = [];

        board.getBoard().forEach( (row) => {
            row.forEach( (field) => {
                if (field.value !== board.getMineSymbol()){
                    numbers.push(field);
                }
            });
        });
        return numbers;
    }

    // Works with numbers and "X" or board.getMineSymbol()
    const getAllOf = (symbol) => {
        let elements = [];

        board.getBoard().forEach( (row) => {
            row.forEach( (field) => {
                if (field.value === symbol){
                    elements.push(field);
                }
            });
        });
        return elements; 
    }

    // Game logic methods
    const start = () => {
        startCanvas();

        beginner.addEventListener("click", (e) => {
            startCanvas();
        });

        intermediate.addEventListener("click", (e) => {
            board = Board(16, 16, 40);
            board.createCompleteBoard();
            createDom("intermediate");
            gameContainer.setAttribute("style", `grid-template-columns: repeat(${columns}, 1fr); width: 590px !important`);
            container.setAttribute("style", "height: 724px; width: 622px");
            display.setAttribute("style","width: 590px");
            revealFieldAfterClick();
        });

        expert.addEventListener("click", (e) => {
            board = Board(30, 16, 99);
            board.createCompleteBoard();
            createDom("expert");
            gameContainer.setAttribute("style", `grid-template-columns: repeat(${columns}, 1fr); width: 1111px !important`);
            container.setAttribute("style", "height: 724px; width: 1141px");
            display.setAttribute("style","width: 1111px");
            revealFieldAfterClick();
        });
    };

    const startCanvas = () => {
        board = Board(9, 9, 10);
        board.createCompleteBoard();
        createDom("beginner");
        gameContainer.setAttribute("style", `grid-template-columns: repeat(${columns}, 1fr); width: 332px !important`);
        container.setAttribute("style","height: 465px; width: 360px");
        display.setAttribute("style","width: 332px");
        revealFieldAfterClick();
    }

    const won = () => {
        let numbers = getAllNumbers();

        // Is every number revealed?
        let alreadyWon = numbers.every( (number) => number.fieldRevealed());
        return alreadyWon;
    }

    const lost = (clickedField) =>  {
        // Change color of target click 
        clickedField.classList.add("lost");

        // Reveal all bombs
        let bombs = getAllOf(board.getMineSymbol());
        revealAll(bombs);
        disableFields();

        // TODO: Change smiley icon to restart
    };

    const disableFields = () => {
        fields.forEach ( (field) => {
            field.disabled = true;
        })
    }

    // DOM methods
    const createDom = (difficulty) => {
        clearDom();

        columns = board.getNumOfColumns();
        for (let row = 0; row < board.getNumOfRows(); row++){
            for (let col = 0; col < board.getNumOfColumns(); col++){

                let field = document.createElement("button");
                field.classList.add("field");
                field.dataset.col = col;
                field.dataset.row = row;                
                field.id = `coordinates-${col}-${row}`;
                field.dataset.revealed = board.getBoard()[row][col].fieldRevealed();
                field.textContent = "";

                gameContainer.appendChild(field);
            }
        }
    };

    const clearDom = () => {
        while(gameContainer.firstChild) {
            gameContainer.removeChild(gameContainer.lastChild);
        }
    }

    const revealAll = (array) => {
        array.forEach ( (field) => {
            board.getBoard()[field.y][field.x].reveal();
            let target = document.querySelector(`#coordinates-${field.x}-${field.y}`);
            target.textContent = field.value;
        })
    };

    const revealFieldAfterClick = () => {
        fields = document.querySelectorAll(".field");
        let toBeRevealed = []

        fields.forEach( (field) => {
            field.addEventListener("click", (e) => {
                let col = field.dataset.col;
                let row = field.dataset.row;

                revealNeighborsIfZero(col, row, toBeRevealed);

                if (board.getBoard()[row][col].fieldRevealed() === false) {
                    
                    field.classList.add(`symbol-${board.getBoard()[row][col].value}`)
                    field.textContent = board.getBoard()[row][col].value;   
                    board.getBoard()[row][col].reveal();

                    // Lost?
                    if(field.textContent === board.getMineSymbol()){
                        lost(field);
                    }

                    // Win? 
                    if(won()) {
                        alert("You won!");
                        disableFields();
                    }
                }
            });
        });
    }

    const revealNeighborsIfZero = (col, row, toBeRevealed) => {
        if (board.getBoard()[row][col].value === 0) {
            toBeRevealed.push(board.getBoard()[row][col]);
            let neighbors = board.getNeighborCoordinates(col, row);
            
            neighbors.forEach( (neighbor) => {
                let x = Number(neighbor[0]);
                let y = Number(neighbor[1]);
                let neighborDom = document.querySelector(`#coordinates-${x}-${y}`);
                neighborDom.classList.add(`symbol-${board.getBoard()[y][x].value}`)

                // Only reveal neighbors which are currently unrevealed
                if (board.getBoard()[y][x].fieldRevealed() === false){
                    board.getBoard()[y][x].reveal();
                    if (Number(board.getBoard()[y][x].value) !== 0){
                        neighborDom.textContent = board.getBoard()[y][x].value;
                    }
                }
                
                // If neighbor is 0
                if (board.getBoard()[y][x].value === 0) {
                    
                    // If neighbor is in the toBeRevealed-Array, do nothing (or else infinite recursion)
                    if (toBeRevealed.some(field => field.x === Number(x) && field.y === Number(y))){
                        return;
                    } else {
                        revealNeighborsIfZero(x, y, toBeRevealed);
                    }
                    neighborDom.textContent = "";
                } 
            });
        }
        return;
    }

    return { start, getBoardObject, getAllNumbers, getAllOf, revealAll  };
})();

Game.start();


/* ToDo
    - Styling: Numbers, fields, buttons (retro style like the windows version?)
    - Important styling: Show all 0 (or at least in a different co: https://stackoverflow.com/questions/4235426/how-can-i-capture-the-right-click-event-in-javascript
    - Little bug: If 0 is at the corner and there is no adjacent 0, then the number will be showed

    Nice to have
    - Timer to measure time
    - Save time in localstorage
    - User can enter own number of rows, columns, mines
*/
