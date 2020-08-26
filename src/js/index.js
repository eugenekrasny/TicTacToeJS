
/*
  Store frequently used DOM elements in object
 */
var domElements = {};

function getDomElement(id, selector) {
  var el = domElements[id];
  if (!el) {
    el = document.querySelector(selector);
    domElements[id] = el;
  }
  return el;
}

function getFormElement() {
  return getDomElement('form', '.start-game');
}

function getGameSectionElement() {
  return getDomElement('gameSection', '.game-section');
}

function getGameFieldElement () {
  return getDomElement('gameField', '.game-section__field');
}

function getGameStatusElement() {
  return getDomElement('gameStatus', '.game-section__status');
}

/*
  Game mechanics
 */
var currentPlayer;
var gameFieldArray;

function prepareGameFieldArray(size = 3) {
  gameFieldArray = Array(size);
  for (var i = 0; i < size; i++) {
    gameFieldArray[i] = Array(size).fill('');
  }
}

function createGameButton(row, col) {
  var gameButton = document.createElement('button');
  gameButton.type = 'button';
  gameButton.name = row + '-' + col;
  gameButton.classList.add('game-section__field-button');
  gameButton.innerText = '0';
  gameButton.addEventListener('click', moveDone);
  return gameButton;
}

function renderGameField() {
  gameFieldArray.forEach(function(rowArray, row) {
    var rowElement = document.createElement('div');
    rowElement.classList.add('game-section__field-row');
    rowArray.forEach(function(cell, column) {
      rowElement.appendChild(createGameButton(row, column));
    });
    getGameFieldElement().appendChild(rowElement);
  });
}

function calculateWinner(lastRow, lastColumn) {
  var hasEmptyCells;
  var fieldSize = gameFieldArray[0].length;
  // Check horizontal match
  if (gameFieldArray[lastRow].every(function(cellValue) {
    if (!cellValue) {
      hasEmptyCells = true;
    }
    return cellValue === currentPlayer;
  })) {
    return currentPlayer;
  }

  // Check vertical match
  var verticalMatch = true;
  for (var row = 0; row < fieldSize; row++) {
    var cellValue = gameFieldArray[row][lastColumn];
    if (cellValue !== currentPlayer) {
      hasEmptyCells = !cellValue;
      verticalMatch = false;
      break;
    }
  }
  if (verticalMatch) {
    return currentPlayer;
  }

  // Check left-to-right diagonal match
  if (lastRow === lastColumn) {
    var diagonalMatch = true;
    for (var rowAndCol = 0; rowAndCol < fieldSize; rowAndCol++) {
      var cellValue = gameFieldArray[rowAndCol][rowAndCol];
      if (cellValue !== currentPlayer) {
        hasEmptyCells = !cellValue;
        diagonalMatch = false;
        break;
      }
    }
    if (diagonalMatch) {
      return currentPlayer;
    }
  }

  // Check right-to-left diagonal match
  if (lastRow + lastColumn + 1 === fieldSize) {
    var diagonalMatch = true;
    for (var row = 0; row < fieldSize; row++) {
      var cellValue = gameFieldArray[row][fieldSize - row - 1];
      if (cellValue !== currentPlayer) {
        hasEmptyCells = !cellValue;
        diagonalMatch = false;
        break;
      }
    }
    if (diagonalMatch) {
      return currentPlayer;
    }
  }

  // Check if players can play
  if (!hasEmptyCells) {
    hasEmptyCells = gameFieldArray.some(function(rowArray) {
      return rowArray.some(function(cellValue) {
        return cellValue === '';
      });
    });
    if (!hasEmptyCells) {
      return 'nobody';
    }
  }

  return false;
}

function updateGameStatus(winner) {
  var message;
  if (winner) {
    message = 'Game over, winner is ' + winner;
    getGameFieldElement().classList.add('game-section__field--disabled');
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message = 'Next move is for ' + currentPlayer;
  }
  getGameStatusElement().innerText = message;
}

function moveDone(e) {
  var targetButton = e.target;
  targetButton.innerText = currentPlayer;
  targetButton.disabled = true;
  var position = targetButton.name.split('-');
  var row = parseInt(position[0], 10);
  var column = parseInt(position[1], 10);
  gameFieldArray[row][column] = currentPlayer;
  updateGameStatus(calculateWinner(row, column));
}

/*
  Attach event listeners for start and reset game buttons
 */
window.onload = function() {
  getFormElement().addEventListener("submit", startGame);
  document.querySelector('.game-section__reset').addEventListener('click', resetGame);
}

function startGame(e) {
  e.preventDefault();

  getFormElement().classList.add('start-game--hidden');
  getGameSectionElement().classList.remove('game-section--hidden');

  currentPlayer = null;
  updateGameStatus();

  var fieldSize = parseInt(document.getElementById("fieldSize").value, 10);
  prepareGameFieldArray(fieldSize);
  renderGameField();
}

function resetGame() {
  getFormElement().classList.remove('start-game--hidden');
  getGameSectionElement().classList.add('game-section--hidden');
  getGameFieldElement().classList.remove('game-section__field--disabled');
  getGameFieldElement().innerHTML = '';
}
