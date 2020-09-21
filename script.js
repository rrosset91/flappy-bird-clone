console.log('Flappy Bird - Roger Rosset. Feito com o Guia de Dev Soutinho');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function gameLoop(){
    context.drawImage(
        sprites,
        0, 0,
        34, 24,
        10, 50,
        34, 24,
    );
    requestAnimationFrame(gameLoop);
}
gameLoop();