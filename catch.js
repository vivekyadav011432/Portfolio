const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const missedEl = document.getElementById("missed");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const resetBtn = document.getElementById("resetBtn");

const appleCountRange = document.getElementById("appleCountRange");
const appleCountDisplay = document.getElementById("appleCountDisplay");

let basket = { x: 170, y: 560, width: 60, height: 20 };
let fruits = [];
let score = 0;
let missed = 0;
let animationId = null;
let isPlaying = false;
let isPaused = false;
let fruitTimer = 0;
let lastPaddleX = basket.x;
let sensitivity = 1;
let maxApplesOnScreen = parseInt(appleCountRange.value);

appleCountRange.oninput = function () {
  appleCountDisplay.textContent = this.value;
  maxApplesOnScreen = parseInt(this.value);
};

function drawBasket() {
  ctx.fillStyle = "#00ff99";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawFruits() {
  ctx.fillStyle = "#ff4d4d";
  fruits.forEach(fruit => {
    ctx.beginPath();
    ctx.arc(fruit.x, fruit.y, fruit.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function moveFruits() {
  for (let i = fruits.length - 1; i >= 0; i--) {
    fruits[i].y += fruits[i].speed * sensitivity;

    if (
      fruits[i].y + fruits[i].size > basket.y &&
      fruits[i].x > basket.x &&
      fruits[i].x < basket.x + basket.width
    ) {
      score++;
      scoreEl.textContent = score;
      fruits.splice(i, 1);
    } else if (fruits[i].y > canvas.height) {
      missed++;
      missedEl.textContent = missed;
      fruits.splice(i, 1);
      if (missed >= 5) endGame();
    }
  }
}

function createFruit() {
  if (fruits.length < maxApplesOnScreen) {
    const x = Math.random() * (canvas.width - 20);
    fruits.push({ x, y: 0, size: 20, speed: 2 + Math.random() * 1 });
  }
}

function animate() {
  if (!isPlaying || isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawFruits();
  moveFruits();

  const delta = Math.abs(basket.x - lastPaddleX);
  sensitivity = Math.min(1 + delta / 10, 3);
  lastPaddleX = basket.x;

  fruitTimer++;
  if (fruitTimer > 50) {
    createFruit();
    fruitTimer = 0;
  }

  animationId = requestAnimationFrame(animate);
}

function resetGame() {
  isPlaying = false;
  isPaused = false;
  cancelAnimationFrame(animationId);
  fruits = [];
  score = 0;
  missed = 0;
  fruitTimer = 0;
  sensitivity = 1;
  basket.x = 170;
  scoreEl.textContent = score;
  missedEl.textContent = missed;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
}

function startGame() {
  resetGame();
  isPlaying = true;
  isPaused = false;
  animate();
}

function pauseGame() {
  isPaused = true;
}

function resumeGame() {
  if (isPlaying && isPaused) {
    isPaused = false;
    animate();
  }
}

function endGame() {
  isPlaying = false;
  cancelAnimationFrame(animationId);
  alert("💥 Game Over! Final Score: " + score);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && basket.x > 0) basket.x -= 20;
  else if (e.key === "ArrowRight" && basket.x < canvas.width - basket.width) basket.x += 20;
});

startBtn.onclick = startGame;
resetBtn.onclick = resetGame;
pauseBtn.onclick = pauseGame;
resumeBtn.onclick = resumeGame;

drawBasket();
