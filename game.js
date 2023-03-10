
/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result')

let canvasSize;
let elementsSize;
let timeStart;
let timePlayer;
let timeInterval;

let level = 0;
let lives = 3;

const playerPosition = {
  x: undefined,
  y: undefined
}

const giftPosition = {
  x: undefined,
  y: undefined
}

let enemyPositions = []

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
window.addEventListener('keydown',moveByKeys)
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = (canvasSize / 10) - 2 ;
  startGame()
}

function startGame() {
  enemyPositions = [];
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';
  
  const map = maps[level];
  
  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime,100);
    showRecord();
  }
  
  const mapRows = map.trim().split('\n');
  const mapRowsCols = mapRows.map(row => row.trim().split(''));

  showLives();
  
  game.clearRect(0,0,canvasSize,canvasSize);
  mapRowsCols.forEach((row, rowI) => {
    row.forEach((col,colI) => {
      const emoji = emojis[col];
      const posY = elementsSize * (rowI + 1 )
      const posX = elementsSize * (colI + 1 + 0.3)
      
      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }
      
      game.fillText(emoji, posX, posY, 58)
    });
  });
  
  movePlayer();
} 

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
  
  if (giftCollision) {
    levelWin();
  }
  
  const enemyCollision = enemyPositions.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });

  if (enemyCollision) {
    levelFail();
  }
  
  

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}
/*   for (let x = 1; x <= 10; x++) {
    for (let y = 1; y <= 10; y++) {
      game.fillText(emojis[mapRowsCols[y-1][x-1]], elementsSize * (x + 0.36), elementsSize * (y), 60);
    }
  } */

function moveByKeys(event) {
  switch (event.key) {
    case ('ArrowUp'):
      moveUp();
      break;
    case ('ArrowLeft'):
      moveLeft();
      break;
    case ('ArrowRight'):
      moveRight();
      break;
    case ('ArrowDown'):
      moveDown();
      break;
    default:
      break;
  }
}

function moveUp() {
  if ((playerPosition.y - elementsSize ) < elementsSize) {
    console.log('out')
  } else {
  playerPosition.y -= elementsSize;
  startGame();
  }
}

function moveLeft() {
  if ((playerPosition.x - elementsSize ) < elementsSize) {
    console.log('out')
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}

function moveRight() {
  if ((playerPosition.x + elementsSize ) > canvasSize) {
    console.log('out')
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}

function moveDown() {
  if ((playerPosition.y + elementsSize ) > canvasSize) {
    console.log('out')
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}

function levelWin() {
  console.log('subiste de nivel')
  level++;
  startGame();
}

function gameWin() {
  console.log('fin')
  clearInterval(timeInterval);
  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime > playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = 'superaste'
  } else {
      pResult.innerHTML = 'no superaste'
    }
  } else {
    localStorage.setItem('record_time', playerTime)
    pResult.innerHTML = 'primera vez, supera tu tiempo'
  }
 
}

function levelFail() {
  lives--;
  
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function showLives() {
  const heartsArray =  Array(lives).fill(emojis['HEART'])
  spanLives.innerHTML = '';
  heartsArray.forEach(heart => spanLives.append(heart));
  
}

function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

