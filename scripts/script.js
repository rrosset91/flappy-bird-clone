console.log("Flappy Bird - Roger Rosset. Feito com o Guia de Dev Soutinho");
let frames = 0;
const sprites = new Image();
sprites.src = "./img/sprites.png";
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//Definition of the game's objects
//Sounds
const HIT_SOUND = new Audio();
HIT_SOUND.src = "./effects/hit.wav";
const JUMP_SOUND = new Audio();
JUMP_SOUND.src = "./effects/jump.wav";
const POINT_SOND = new Audio();
POINT_SOND.src = "./effects/point.wav";
//Flappybird
const bird = {
  spriteX: 0,
  spriteY: 0,
  width: 34,
  height: 24,
  canvasX: 10,
  canvasY: 50,
  jumpSize: 4.6,
  bottom: 0,
  upper: 0,
  jump() {
    console.log("pular");
    console.log("velocidade anterior", bird.speed);
    bird.speed = -bird.jumpSize;
    console.log("velocidade atual", bird.speed);
  },
  gravity: 0.25,
  speed: 0,
  update() {
    if (makeCollision(bird, floor)) {
      HIT_SOUND.play();
      showResults();
      resetGame();
      changeScreen(screens.START);
      return;
    }
    bird.speed = bird.speed + bird.gravity;
    bird.canvasY = bird.canvasY + bird.speed;
  },
  movementAnimation: [
    { spriteX: 0, spriteY: 0 },
    { spriteX: 0, spriteY: 26 },
    { spriteX: 0, spriteY: 52 },
  ],
  actualFrame: 0,
  updateActualFrame() {
    //ENTENDER MELHOR
    const framesInterval = 10;
    const intervalGone = frames % framesInterval === 0;

    if (intervalGone) {
      const incrementBase = 1;
      const increment = incrementBase + bird.actualFrame;
      const baseRepetition = bird.movementAnimation.length;
      bird.actualFrame = increment % baseRepetition;
    }
  },
  draw() {
    bird.updateActualFrame();
    const { spriteX, spriteY } = bird.movementAnimation[bird.actualFrame];
    context.drawImage(
      sprites,
      spriteX,
      spriteY,
      bird.width,
      bird.height,
      bird.canvasX,
      bird.canvasY,
      bird.width,
      bird.height
    );
  },
};

//Floor
const floor = {
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  canvasX: 0,
  canvasY: canvas.height - 112,
  update() {
    //ENTENDER MELHOR
    const repeatOn = floor.width / 2;
    const movement = floor.canvasX - 1;
    floor.canvasX = movement % repeatOn;
  },
  draw() {
    context.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY,
      floor.width,
      floor.height,
      floor.canvasX,
      floor.canvasY,
      floor.width,
      floor.height
    );
    context.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY,
      floor.width,
      floor.height,
      floor.canvasX + floor.width,
      floor.canvasY,
      floor.width,
      floor.height
    );
  },
};

//Background
const background = {
  spriteX: 390,
  spriteY: 0,
  width: 276,
  height: 204,
  canvasX: 0,
  canvasY: floor.canvasY - 204,
  draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.canvasX,
      background.canvasY,
      background.width,
      background.height
    );
    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.canvasX + background.width,
      background.canvasY,
      background.width,
      background.height
    );
  },
};

//Start Screen
const startScreen = {
  spriteX: 134,
  spriteY: 0,
  width: 174,
  height: 152,
  canvasX: canvas.width / 2 - 87,
  canvasY: 50,
  gravity: 0.2,
  speed: 0,

  draw() {
    context.drawImage(
      sprites,
      startScreen.spriteX,
      startScreen.spriteY,
      startScreen.width,
      startScreen.height,
      startScreen.canvasX,
      startScreen.canvasY,
      startScreen.width,
      startScreen.height
    );
  },
};
//Screens
let activeScreen = {};

function changeScreen(newScreen) {
  activeScreen = newScreen;
}
const screens = {};

screens.START = {
  draw() {
    background.draw();
    floor.update();
    floor.draw();
    bird.draw();
    startScreen.draw();
  },
  click() {
    changeScreen(screens.GAME);
  },
  update() {},
};

screens.GAME = {
  draw() {
    startScreen.draw();
  },
  update() {
    bird.update();
    background.draw();
    floor.draw();
    floor.update();
    bird.draw();
  },
  click() {
    JUMP_SOUND.play();
    bird.jump();
  },
};

//Games functions
const globals = {
  points: 0,
};

function resetGame() {
  bird.canvasY = 50;
  bird.speed = 0;
  globals.points = 0;
}

function showResults() {
  let points = globals.points;
  alert(`Você Marcou ${points} pontos`);
}
function makeCollision(birdY, floorY) {
  birdY = bird.canvasY + bird.height;
  floorY = floor.canvasY;

  if (birdY >= floorY) {
    return true;
  } else {
    return false;
  }
}
function gameLoop() {
  activeScreen.draw();
  activeScreen.update();
  frames++;
  requestAnimationFrame(gameLoop);
}
window.addEventListener("click", function () {
  if (activeScreen.click) {
    activeScreen.click();
  }
});
window.addEventListener("keypress", (event) => {
  const keyName = event.key;
  if (activeScreen.click && keyName == " ") {
    activeScreen.click();
  }
});
changeScreen(screens.START);
gameLoop();
