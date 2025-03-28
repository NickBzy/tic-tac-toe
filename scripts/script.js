console.log("Hello World!");

document.addEventListener("DOMContentLoaded", function () {
    const gamePage = document.querySelector(".game-page");

    gamePage.classList.forEach(cls => {
        if (cls !== "game-page") {
            gamePage.classList.remove(cls);
        }
    });
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
    //gameboard array

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

    return {
        init : returnToMenu
    };
    //createBoard
    //render
    //resetBoard
    //HighlightWinningCombination
    //UpdateCell
})();

const Game = (function () {
    //startGame
    //CheckWinner
    //isBoardFull
    //togglePlayer
    //gameOver
    //restartGame
})();

const Player = (function () {
    //makeMove
    //getPlayerSymbol
})();

const Computer = (function () {
    //makeMover
    //getComputerSymbol
    //
})();


Menu.init();
GameBoard.init();