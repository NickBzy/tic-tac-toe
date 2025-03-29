console.log("Hello World!");

document.addEventListener("DOMContentLoaded", function () {
    const gamePage = document.querySelector(".game-page");

    gamePage.classList.forEach(cls => {
        if (cls !== "game-page") {
            gamePage.classList.remove(cls);
        }
    });

    Menu.init();
    GameBoard.returnToMenu();
    Game.startGame();
});

const Menu = (function () {
    const buttons = document.querySelector(".menu");
    const gamePage = document.querySelector(".game-page");

    function chooseSeasons() {
        buttons.addEventListener("click", (event)=>{
            if (event.target.tagName === "BUTTON"){
                const season = event.target.classList[0];

                buttons.style.display = "None";

                gamePage.style.display = "flex";

                gamePage.classList.add(season);
            }
        });
    }

    return {
        init: chooseSeasons
    };
})();

const GameBoard = (function () {
    let board = ["", "", "",
                 "", "", "",
                 "", "", ""]
    
    const gameBoard = document.querySelector(".game-grid");

    const gamePage = document.querySelector(".game-page")
    const menu = document.querySelector(".menu");
    const menuButton = document.querySelector(".return button");

    function returnToMenu() {
        menuButton.addEventListener("click", function() {
            gamePage.style.display = "None";
            gamePage.classList.forEach(cls => {
                if (cls !== "game-page") {
                    gamePage.classList.remove(cls);
                }
            });
            menu.style.display = "flex";
        });
    }

    function render() {
        const cells = document.querySelectorAll(".game-cell");
        cells.forEach((cell, index)=>{
            cell.innerText = board[index];
        })
    }

    function updateCell(index, player) {
        if (board[index] === "") {
            board[index] = player;
            render();
        }
    }

    function resetBoard() {
        board = ["", "", "",
                "", "", "",
                "", "", ""]
        render();
    }

    function isBoardFull() {
        for (let i=0; i<board.length; i++){
            if (board[i] === "") return false;
        }
        return true;
    }

    function checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]

        for (let combo of winningCombos){
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]){
                return combo;
            }
        }
        return null;
    }

    function highlightBoard() {
        const cells = document.querySelectorAll(".game-cell");
        cells.forEach(cell => {
            cell.classList.add("winning");
        });
        setTimeout(() =>{
            cells.forEach(cell => {
                cell.classList.remove("winning");
            });
        }, 700);
    }

    function highlightWinningCombination() {
        const winningCombo = checkWinner();
        if (winningCombo) {
            winningCombo.forEach(index => {
                document.querySelectorAll(".game-cell")[index].classList.add("winning");
                setTimeout(() =>{
                    document.querySelectorAll(".game-cell")[index].classList.remove("winning");
                }, 700);
            })
        }
    }

    return {
        render, updateCell, resetBoard, returnToMenu, isBoardFull, checkWinner, highlightWinningCombination, highlightBoard
    };

    
})();

const Computer = (function () {
    const symbol = 'O'
    
    function makeMove() {
        const gameCells = document.querySelectorAll(".game-cell");
        const availableCells = [];

        gameCells.forEach((cell, index) => {
            if (cell.innerText === "") {
                availableCells.push(index);
            }
        });

        if (availableCells.length > 0) {
            const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
            GameBoard.updateCell(randomIndex, getComputerSymbol());
        }
    }

    const getComputerSymbol = () => symbol;

    return {
        getComputerSymbol, makeMove
    }
    
})();

const Player = (function () {
    const symbol = 'X';
    const gameCell = document.querySelectorAll(".game-cell");
    
    function makeMove(){
        gameCell.forEach((cell, index) => {
            cell.addEventListener("click", function() {
                if (this.innerText === ""){
                    GameBoard.updateCell(index, getPlayerSymbol());
                }
            });
        });
    }

    const getPlayerSymbol = () => symbol;

    return {
        getPlayerSymbol, makeMove
    };
})();

const Game = (function () {
    let currentTurn = 'player';
    let playerScore = 0
    let computerScore = 0;
    let round = 1;

    function updateScore(winner) {
        if (winner === 'player') {
            playerScore += 1;
            round += 1;
        } else if (winner === 'computer') {
            computerScore += 1;
            round += 1;
            currentTurn = "player"
        } else {
        }
        GameBoard.resetBoard();
        document.querySelector("#player-score").innerText = playerScore;
        document.querySelector("#computer-score").innerText = computerScore;
        document.querySelector("#round").innerText = round;

        if (playerScore === 3) {
            alert("Player wins the game!");
            resetGame();  // Reset the game for a new round
        } else if (computerScore === 3) {
            alert("Computer wins the game!");
            resetGame();  // Reset the game for a new round
        }
    }

    function resetGame() {
        GameBoard.resetBoard();  // Reset the game board
        playerScore = 0;  // Reset player score
        computerScore = 0;  // Reset computer score
        round = 1;

        // Reset the score display
        document.querySelector("#player-score").innerText = playerScore;
        document.querySelector("#computer-score").innerText = computerScore;
        document.querySelector("#round").innerText = round;

        currentTurn = 'player';  // Start with player for new round
    }

    function addEventListeners() {
        const gameGrid = document.querySelector(".game-grid");

        gameGrid.addEventListener("click", function(event) {
            const cell = event.target;

            if (cell.classList.contains("game-cell") && cell.innerText === "") {
                if (currentTurn === 'player') {
                    GameBoard.updateCell(Array.from(cell.parentElement.children).indexOf(cell), Player.getPlayerSymbol());
                    if (GameBoard.checkWinner()) {
                        GameBoard.highlightWinningCombination();
                        setTimeout(() => {
                            updateScore('player');
                        }, 700);
                        return;
                    } else if (GameBoard.isBoardFull()) {
                        GameBoard.highlightBoard();
                        setTimeout(() => {
                            updateScore(null);
                        });
                        return;
                    }

                    currentTurn = 'computer';
                    setTimeout(() => {
                        Computer.makeMove();
                        checkComputerMove();
                    }, 700)
                    
                }
            }
        });
    }

    function checkComputerMove() {
        if (GameBoard.checkWinner()) {
            GameBoard.highlightWinningCombination();
            setTimeout(() => {
                updateScore('computer');
            }, 700);
            return;
        } else if (GameBoard.isBoardFull()) {
            setTimeout(() =>{
                updateScore(null);
            });
            return;
        }

        currentTurn = 'player';
    }

    function startGame() {
        addEventListeners();
    }

    return {
        startGame,
    };
})();







