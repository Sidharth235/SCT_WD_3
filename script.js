const board = document.getElementById('board');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const modeToggle = document.getElementById('mode');

let cells = [];
let boardState = Array(9).fill(null);
let currentPlayer = 'X';
let vsComputer = false;
let gameOver = false;

// Winning combinations
const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], 
  [0, 3, 6],
  [1, 4, 7], 
  [2, 5, 8],
  [0, 4, 8], 
  [2, 4, 6]
];

// Setup board
function init() {
  board.innerHTML = '';
  boardState.fill(null);
  gameOver = false;
  currentPlayer = 'X';
  updateStatus();
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
    cells[i] = cell;
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (boardState[index] || gameOver) return;

  makeMove(index, currentPlayer);

  const winner = checkWinner();
  if (winner || boardState.every(cell => cell)) {
    gameOver = true;
    statusDiv.textContent = winner ? `Player ${winner} wins!` : "It's a draw!";
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();

  if (vsComputer && currentPlayer === 'O' && !gameOver) {
    setTimeout(() => {
      computerMove();
    }, 300);
  }
}

function makeMove(index, player) {
  boardState[index] = player;
  cells[index].textContent = player;
}

function checkWinner() {
  for (const combo of wins) {
    const [a, b, c] = combo;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return boardState[a];
    }
  }
  return null;
}

function computerMove() {
  let available = boardState.map((v, i) => v === null ? i : null).filter(v => v !== null);
  if (available.length === 0) return;

  // Basic AI: random move
  const randomIndex = available[Math.floor(Math.random() * available.length)];
  makeMove(randomIndex, 'O');

  const winner = checkWinner();
  if (winner || boardState.every(cell => cell)) {
    gameOver = true;
    statusDiv.textContent = winner ? `Player ${winner} wins!` : "It's a draw!";
    return;
  }

  currentPlayer = 'X';
  updateStatus();
}

function updateStatus() {
  statusDiv.textContent = `Player ${currentPlayer}'s turn`;
}

resetBtn.addEventListener('click', init);
modeToggle.addEventListener('change', () => {
  vsComputer = modeToggle.checked;
  init();
});

init(); // start game
