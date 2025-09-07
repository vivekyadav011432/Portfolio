const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const boardSize = 20;
const startBtn = document.getElementById('startBtn');

let snake = [{ x: 10, y: 10 }];
let food = randomFood();
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;
let gameInterval;

// build board
for (let i = 0; i < boardSize * boardSize; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  board.appendChild(cell);
}

function getIndex(x, y) {
  return y * boardSize + x;
}

function draw() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.className = 'cell';
  });

  const foodIndex = getIndex(food.x, food.y);
  board.children[foodIndex]?.classList.add('food');

  snake.forEach((segment, index) => {
    const cell = board.children[getIndex(segment.x, segment.y)];
    if (cell) {
      cell.classList.add(index === 0 ? 'snake-head' : 'snake-body');
    }
  });
}

function gameLoop() {
  if (!gameRunning) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.x >= boardSize ||
    head.y < 0 || head.y >= boardSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert("💀 Game Over! Your score: " + score);
    gameRunning = false;
    startBtn.style.display = "inline-block"; // Show start again after game over
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  draw();
}

function randomFood() {
  let f;
  do {
    f = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

function changeDirection(key) {
  if (!gameRunning) return;

  switch (key) {
    case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
    case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
    case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
    case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
  }
}

function startGame() {
  if (!gameRunning) {
    dx = 1; dy = 0; // Start moving to the right by default
    gameRunning = true;
    startBtn.style.display = "none";
    gameInterval = setInterval(gameLoop, 120);
  }
}

function restartGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreDisplay.textContent = score;
  food = randomFood();
  gameRunning = false;
  clearInterval(gameInterval);
  draw();
  startBtn.style.display = "inline-block"; // Show start again
}

document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    changeDirection(e.key);
  }
});

draw(); // Initial draw only
