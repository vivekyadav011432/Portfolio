const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const scoreDisplay = document.getElementById("score");

let x, y, dx, dy;
let paddleX, rightPressed, leftPressed;
let score, ballRadius;
let paddleWidth, paddleHeight;
let gameStarted = false;
let animationId;
let currentSpeed = 'normal';

const brickRowCount = 12;
const brickColumnCount = 10;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 5;
const brickOffsetTop = 20;
const brickOffsetLeft = 25;

let bricks = [];

function setSpeed(speed) {
  currentSpeed = speed;
  switch (speed) {
    case 'slow': dx = dx > 0 ? 1.5 : -1.5; dy = dy > 0 ? 1.5 : -1.5; break;
    case 'normal': dx = dx > 0 ? 2.5 : -2.5; dy = dy > 0 ? 2.5 : -2.5; break;
    case 'fast': dx = dx > 0 ? 4 : -4; dy = dy > 0 ? 4 : -4; break;
  }
}

function initGame() {
  x = canvas.width / 2;
  y = canvas.height - 40;
  dx = 2.5;
  dy = -2.5;
  ballRadius = 8;

  paddleWidth = 100;
  paddleHeight = 12;
  paddleX = (canvas.width - paddleWidth) / 2;
  rightPressed = false;
  leftPressed = false;

  score = 0;
  scoreDisplay.textContent = score;

  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  gameStarted = false;
  cancelAnimationFrame(animationId);
  draw();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        b.x = brickX;
        b.y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ff6666";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00ffff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#00ff00";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          scoreDisplay.textContent = score;
          if (score === brickRowCount * brickColumnCount) {
            alert("🎉 YOU WIN!");
            gameStarted = false;
            cancelAnimationFrame(animationId);
          }
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      alert("💥 GAME OVER!");
      gameStarted = false;
      cancelAnimationFrame(animationId);
      return;
    }
  }

  x += dx;
  y += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 6;
  else if (leftPressed && paddleX > 0) paddleX -= 6;

  animationId = requestAnimationFrame(draw);
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

startBtn.onclick = () => {
  if (!gameStarted) {
    gameStarted = true;
    animationId = requestAnimationFrame(draw);
  }
};

resetBtn.onclick = () => {
  initGame();
};

initGame();
