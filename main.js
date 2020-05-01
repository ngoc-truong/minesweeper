/* 
    Minesweeper 

    Beginner: 9 height, 9 width, 10 mines
    Intermediate: 16 height, 16 width, 40 mines
    Expert: 16 height, 30 width, 99 mines
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

// Game module (because only need one game)
const Game = ( () => {
    let _board = [];

    const createCompleteBoard = (width, height, numOfMines) => {
        createEmptyBoard(width, height);
        let mines = createMines(numOfMines);
        addMinesToBoard(mines);
    }

    const createEmptyBoard = (width, height) => {
        for (let row = 0; row < height; row++){

            let completeRow = []
            for (let col = 0; col < width; col++){
                let field = Field(col, row, "o");
                completeRow.push(field);
            }
            _board.push(completeRow);
        }
        return _board;
    };

    // Does not work correctly, some empty rows don't show up
    const showBoard = () => {
        for (let i = 0; i < _board.length; i++) {
            let row = "";
            for (j = 0; j < _board[i].length; j++){
                row += _board[i][j].value;
            }
            console.log(row);
        }
    }

    const createMines = (numOfMines) => {
        let mines = [];

        while (mines.length < numOfMines) {
            let boardWidth  = _board[0].length;
            let boardHeight = _board.length;
            let randomX = Math.floor(Math.random() * boardWidth);
            let randomY = Math.floor(Math.random() * boardHeight);

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

            _board[y][x].value = "X";
        });
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

    return { _board, createCompleteBoard, showBoard };
})();

Game.createCompleteBoard(9, 9, 10);