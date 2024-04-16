const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
let canvasSize;
let elementSize;
const playerPosition = {
  x: undefined,
  y: undefined,
};

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

window.addEventListener("keyup", (event) => move(event.code));

up?.addEventListener("click", () => move("ArrowUp"));
left?.addEventListener("click", () => move("ArrowLeft"));
right?.addEventListener("click", () => move("ArrowRight"));
down?.addEventListener("click", () => move("ArrowDown"));

function move(direction) {
  if (direction === "ArrowUp") moveUp();
  else if (direction === "ArrowDown") moveDown();
  else if (direction === "ArrowLeft") moveLeft();
  else if (direction === "ArrowRight") moveRight();
}

function moveUp() {
  if (playerPosition.y > 1) {
    playerPosition.y--;
  }
  resizeCanvas();
  paintPlayer();
}

function moveDown() {
  if (playerPosition.y <= 9) {
    playerPosition.y++;
  }
  resizeCanvas();
  paintPlayer();
}

function moveLeft() {
  if (playerPosition.x > 0) {
    playerPosition.x--;
  }
  resizeCanvas();
  paintPlayer();
}

function moveRight() {
  if (playerPosition.x < 9) {
    playerPosition.x++;
  }
  resizeCanvas();
  paintPlayer();
}

function paintCanvas() {
  const map = maps[0]
    .trim()
    .split("\n")
    .map((row) => row.trim().split(""));

  game.font = elementSize + "px Verdana";

  for (let row = 1; row <= 10; row++) {
    for (let col = 0; col < 10; col++) {
      game.fillText(
        emojis[map[row - 1][col]],
        elementSize * col,
        elementSize * row
      );

      if (map[row - 1][col] === "O") {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = col;
          playerPosition.y = row;
          paintPlayer();
        }
      }
    }
  }
}

function paintPlayer() {
  game.fillText(
    emojis["PLAYER"],
    elementSize * playerPosition.x,
    elementSize * playerPosition.y
  );
}

function resizeCanvas() {
  let width = window.innerWidth;
  let height = window.innerHeight;

  if (width > height) {
    if (width > 800) {
      canvasSize = height * 0.8;
    } else {
      canvasSize = width * 0.6;
    }
  } else {
    canvasSize = width * 0.8;
  }

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  elementSize = canvasSize / 10 - 1;

  paintCanvas();
}
