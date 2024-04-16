const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
let level = 0;
let canvasSize;
let elementSize;
const playerPosition = {
  x: undefined,
  y: undefined,
};
const exitPosition = {
  x: undefined,
  y: undefined,
};
const bombs = [];
let totalBombs = undefined;

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

window.addEventListener("keyup", (event) => move(event.code));

up?.addEventListener("click", () => move("ArrowUp"));
left?.addEventListener("click", () => move("ArrowLeft"));
right?.addEventListener("click", () => move("ArrowRight"));
down?.addEventListener("click", () => move("ArrowDown"));

function onExit() {
  if (
    playerPosition.x === exitPosition.x &&
    playerPosition.y === exitPosition.y
  ) {
    console.info("Next level!!!");
  }
}

function onCollition() {
  bombs.forEach((bomb) => {
    if (playerPosition.x === bomb.x && playerPosition.y === bomb.y) {
      console.error("🔥");
    }
  });
}

function move(direction) {
  if (direction === "ArrowUp") moveUp();
  else if (direction === "ArrowDown") moveDown();
  else if (direction === "ArrowLeft") moveLeft();
  else if (direction === "ArrowRight") moveRight();
  resizeCanvas();
  onExit();
  onCollition();
}

function moveUp() {
  if (playerPosition.y > 1) {
    playerPosition.y--;
  }
}

function moveDown() {
  if (playerPosition.y <= 9) {
    playerPosition.y++;
  }
}

function moveLeft() {
  if (playerPosition.x > 0) {
    playerPosition.x--;
  }
}

function moveRight() {
  if (playerPosition.x < 9) {
    playerPosition.x++;
  }
}

function paintCanvas() {
  const map = maps[level]
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
      if (map[row - 1][col] === "I") {
        if (!exitPosition.x && !exitPosition.y) {
          exitPosition.x = col;
          exitPosition.y = row;
        }
      }
      if (map[row - 1][col] === "X") {
        if (!totalBombs) {
          bombs.push({ x: col, y: row });
        }
      }
    }
  }
  if (!totalBombs) {
    totalBombs = bombs.length;
  }
  paintPlayer();
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
