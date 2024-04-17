const canvas = document.querySelector("#game");
const up = document.querySelector("#up");
const down = document.querySelector("#down");
const left = document.querySelector("#left");
const right = document.querySelector("#right");
const userLives = document.querySelector("#lives");
const userTime = document.querySelector("#time");
const bestTime = document.querySelector("#record");

const game = canvas.getContext("2d");
let level = 0;
let lives = 3;
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
let bombs = [];
let collisions = [];
let totalBombs = undefined;
let timeStart = undefined;
let timeInterval;

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

window.addEventListener("keyup", (event) => move(event.code));

up?.addEventListener("click", () => move("ArrowUp"));
left?.addEventListener("click", () => move("ArrowLeft"));
right?.addEventListener("click", () => move("ArrowRight"));
down?.addEventListener("click", () => move("ArrowDown"));

function onWin() {
  if (
    playerPosition.x === exitPosition.x &&
    playerPosition.y === exitPosition.y
  ) {
    lives = 3;
    bombs = [];
    collisions = [];
    totalBombs = undefined;
    exitPosition.x = undefined;
    exitPosition.y = undefined;
    if (level < maps.length - 1) {
      level++;
    } else if (level === maps.length - 1) {
      clearInterval(timeInterval);

      if (localStorage.getItem("record")) {
        let best = parseInt(localStorage.getItem("record").split(":").join(""));
        let actual = parseInt(userTime.innerHTML.split(":").join(""));
        if (actual < best) {
          localStorage.setItem("record", userTime.innerHTML);
        }
      } else {
        localStorage.setItem("record", userTime.innerHTML);
      }
    }
  }
}

function onCollision() {
  bombs.forEach((bomb) => {
    if (playerPosition.x === bomb.x && playerPosition.y === bomb.y) {
      collisions.push(bomb);
      playerPosition.x = undefined;
      playerPosition.y = undefined;

      if (lives > 0) {
        lives--;
      } else {
        level = 0;
        lives = 3;
        bombs = [];
        totalBombs = undefined;
        collisions = [];
        timeStart = undefined;
      }
    }
  });
}

function printTime() {
  let msec = parseInt(
    ((Date.now() - timeStart) / 1000).toString().split(".")[1]
  );
  let sec = parseInt(
    ((Date.now() - timeStart) / 1000).toString().split(".")[0]
  );

  userTime.innerHTML = `${sec}:${msec}`;
}

function move(direction) {
  if (direction === "ArrowUp") moveUp();
  else if (direction === "ArrowDown") moveDown();
  else if (direction === "ArrowLeft") moveLeft();
  else if (direction === "ArrowRight") moveRight();
  onWin();
  onCollision();
  resizeCanvas();
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

function displayLives() {
  const hearts = Array(lives).fill("💟");
  userLives.innerHTML = "";
  hearts.forEach((heart) => {
    userLives.append(heart);
  });
}

function paintCanvas() {
  const map = maps[level]
    .trim()
    .split("\n")
    .map((row) => row.trim().split(""));

  game.font = elementSize + "px Verdana";

  displayLives();
  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(printTime, 100);
  }

  bestTime.innerHTML = localStorage.getItem("record") ?? "--:---";

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
        collisions.forEach((collision) => {
          game.fillText(
            emojis["BOMB_COLLISION"],
            elementSize * collision.x,
            elementSize * collision.y
          );
        });
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
