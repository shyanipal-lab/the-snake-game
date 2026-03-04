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

// Initialize game
function init() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  lives = 3;

  updateScore();
  updateLives();

  clearInterval(gameInterval);
  gameInterval = setInterval(draw, 140);
}

// Generate food position
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

// Main game loop
function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#00ff99" : "#00cc77";
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  // Draw food
  ctx.fillStyle = "#ff3b3b";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Collision detection
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvasSize ||
    headY >= canvasSize ||
    snake.some(segment => segment.x === headX && segment.y === headY)
  ) {
    loseLife();
    return;
  }

  const newHead = { x: headX, y: headY };

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    updateScore();
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

// Lose life logic
function loseLife() {
  lives--;
  updateLives();

  if (lives <= 0) {
    clearInterval(gameInterval);
    alert("Game Over 🐍 Final Score: " + score);
    return;
  }

  // Reset snake position but keep score
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
}

// Update UI
function updateScore() {
  document.getElementById("score").innerText = score;
}

function updateLives() {
  document.getElementById("lifeCount").innerText = lives;
}

// Keyboard controls
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// On-screen controls
function move(dir) {
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
}

function restartGame() {
  init();
}

// Start game
init();
