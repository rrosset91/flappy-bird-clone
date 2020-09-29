console.log("Flappy Bird - Roger Rosset. Feito com o Guia de Dev Soutinho");
let frames = 0;
var points = 0;
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
function spawnBird() {
  const bird = {
    name: "bird",
    spriteX: 0,
    spriteY: 0,
    width: 34,
    height: 24,
    canvasX: 10,
    canvasY: 150,
    jumpSize: 4.6,
    bottom: 0,
    upper: 0,
    jump() {
      bird.speed = -bird.jumpSize;
    },
    gravity: 0.25,
    speed: 0,
    update() {
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
  return bird;
}

//Floor
const floor = {
  name: "floor",
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
    if (hasFloorCollision()) {
      HIT_SOUND.play();
      changeScreen(screens.HOME);
      return;
    }
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

function spawnPipes() {
  const pipes = {
    name: "pipes",
    width: 52,
    height: 400,
    spaceBetween: 70,
    floorPipe: {
      spriteX: 0,
      spriteY: 169,
    },
    skyPipe: {
      spriteX: 52,
      spriteY: 169,
    },
    draw() {
      pipes.pairs.forEach(function (pair) {
        const yRandom = pair.y;
        const skyPipeX = pair.x;
        const skyPipeY = yRandom;
        const spaceBetween = 90;

        //Sky pipe
        context.drawImage(
          sprites,
          pipes.skyPipe.spriteX,
          pipes.skyPipe.spriteY,
          pipes.width,
          pipes.height,
          skyPipeX,
          skyPipeY,
          pipes.width,
          pipes.height
        );
        //Floor pipe
        const floorPipeX = pair.x;
        const floorPipeY = pipes.height + spaceBetween + yRandom;
        pipes.skyPipeCollisionY = pipes.height + skyPipeY;
        pipes.floorPipeCollisionY = floorPipeY;
        context.drawImage(
          sprites,
          pipes.floorPipe.spriteX,
          pipes.floorPipe.spriteY,
          pipes.width,
          pipes.height,
          floorPipeX,
          floorPipeY,
          pipes.width,
          pipes.height
        );
      });
    },
    pairs: [],
    hasPipeCollision(pair) {
      const birdHead = globals.bird.canvasY;
      const birdFoot = birdHead + globals.bird.height;
      const birdBack = globals.bird.canvasX;
      const birdFace = birdBack + globals.bird.width;
      const floorPipeCollisionY =
        globals.pipes.height + globals.pipes.spaceBetween + pair.y;
      const skyPipeCollisionY =
        floorPipeCollisionY - globals.pipes.spaceBetween;
      if (
        (birdHead <= skyPipeCollisionY || birdFoot >= floorPipeCollisionY) &&
        birdFace == pair.x
      ) {
        return true;
      } else {
        if (birdBack > pair.x + pipes.width) {
          points++;
          console.log("Pontuação", points);
        }
        return false;
      }
    },
    update() {
      let speed = 200;
      const spawnPipes = frames % speed === 0;
      if (spawnPipes) {
        pipes.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }
      pipes.pairs.forEach(function (pair) {
        pair.x -= 1;
        if (pair.x + pipes.width <= 0) {
          pipes.pairs.shift();
        }
        if (pipes.hasPipeCollision(pair)) {
          HIT_SOUND.play();
          changeScreen(screens.HOME);
          return;
        }
      });
    },
  };
  return pipes;
}

//Start Screen
const startScreen = {
  spriteX: 134,
  spriteY: 0,
  width: 174,
  height: 152,
  canvasX: canvas.width / 2 - 87,
  canvasY: 50,

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
const globals = {};
function changeScreen(newScreen) {
  activeScreen = newScreen;
  if (activeScreen.start) {
    activeScreen.start();
  }
}
const screens = {};

screens.HOME = {
  start() {
    globals.bird = spawnBird();
    globals.pipes = spawnPipes();
  },
  draw() {
    background.draw();
    floor.draw();
    globals.bird.draw();
    startScreen.draw();
  },
  click() {
    changeScreen(screens.GAME);
  },
  update() {
    floor.update();
  },
};

screens.GAME = {
  draw() {
    background.draw();
    globals.pipes.draw();
    globals.bird.draw();
    floor.draw();
  },
  update() {
    floor.update();
    globals.bird.update();
    globals.pipes.update();
  },
  click() {
    JUMP_SOUND.play();
    globals.bird.jump();
  },
};

function showResults() {
  let points = globals.points;
  alert(`Você Marcou ${points} pontos`);
}
function hasFloorCollision() {
  const bird = globals.bird;
  const birdBottom = bird.canvasY + bird.height;
  const floorY = floor.canvasY;
  if (birdBottom >= floorY) {
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
changeScreen(screens.HOME);
gameLoop();
