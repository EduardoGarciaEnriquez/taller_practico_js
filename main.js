const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
let canvasSize;
let elementSize;

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

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
    }
  }
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
