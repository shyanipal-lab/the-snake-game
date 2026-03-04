const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

let snake;
let direction;
let food;
let score;
let lives;
let gameInterval;

const funnyLines = [
  "Snake needed therapy.",
  "That wall came out of nowhere.",
  "You blinked, didn’t you?",
  "Snake forgot how to turn.",
  "Classic Nokia disappointment.",
  "Even 1997 kids did better."
];

// INIT GAME
function init() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  lives = 3;

  updateScore();
  updateLives();

  document.getElementById("gameOverOverlay").classList.add("hidden");

  clearInterval(gameInterval);
  gameInterval = setInterval(draw, 140);
}

// FOOD
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// DRAW LOOP
function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#00ff99" : "#00cc77";
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  ctx.fillStyle = "#ff3b3b";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvasSize ||
    headY >= canvasSize ||
    snake.some(s => s.x === headX && s.y === headY)
  ) {
    loseLife();
    return;
  }

  const newHead = { x: headX, y: headY };

  if (headX === food.x && headY === food.y) {
    score++;
    updateScore();
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

// LIFE LOGIC
function loseLife() {
  lives--;
  updateLives();

  if (lives <= 0) {
    clearInterval(gameInterval);
    showGameOver();
    return;
  }

  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
}

// GAME OVER
function showGameOver() {
  const overlay = document.getElementById("gameOverOverlay");
  const text = document.getElementById("gameOverText");

  const randomLine = funnyLines[Math.floor(Math.random() * funnyLines.length)];
  text.innerText = randomLine;

  overlay.classList.remove("hidden");
}

// UI UPDATES
function updateScore() {
  document.getElementById("score").innerText = score;
}

function updateLives() {
  document.getElementById("lifeCount").innerText = lives;
}

// KEYBOARD CONTROLS
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// BUTTON CONTROLS
function move(dir) {
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
}

function restartGame() {
  init();
}

// START
init();
