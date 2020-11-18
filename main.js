const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = canvas.width;

let critterArray = [];
let speciesArray = ['red', 'blue', 'green', 'purple', 'orange', 'deeppink'];
const critterWidth = canvas.width / 10;
const arrayWidthHeight = canvas.width / critterWidth;
const maxCritters = arrayWidthHeight * arrayWidthHeight;

let previousIndex = 0;
let currentIndex;
let timer;

class Critter {
  constructor(x, y, type, index) {
    this.width = critterWidth;
    this.height = critterWidth;
    this.x = x * this.width;
    this.y = y * this.height;
    this.initialY = 0 - this.y;
    this.vy = 8;
    this.falling = true;
    this.type = type;
    this.index = index;
    this.selected = false;
    this.markedForDeath = false;
    //frameX and frameY
  }
  draw() {
      ctx.fillStyle = this.type;
      ctx.fillRect(this.x, this.initialY, this.width, this.height);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 4;
      if (this.selected) ctx.strokeRect(this.x + 2, this.initialY + 2, this.width - 4, this.height - 4);
  }

  update() {
    if (this.falling) {
      this.initialY += this.vy;
    }
    if (this.initialY >= this.y) {
      this.falling = false;
      this.initialY = this.y;
    }
  }
}

function dropMatches() {
  for (i = critterArray.length - 1; i >= 0; i--) {
    if (critterArray[i].type === 'transparent') {
      if (critterArray[i - arrayWidthHeight]) {
        critterArray[i].type = critterArray[i - arrayWidthHeight].type;
        critterArray[i - arrayWidthHeight].type = 'transparent';
        critterArray[i].initialY = critterArray[i - arrayWidthHeight].y;
        critterArray[i].falling = true;
      } else {
        let typeSelector = Math.floor(Math.random() * speciesArray.length);
        critterArray[i].type = speciesArray[typeSelector];
        critterArray[i].initialY = 0 - arrayWidthHeight;
        critterArray[i].falling = true;
      }
    }
  }
}

function eliminateMatches() {
  for (i = 0; i < critterArray.length; i++) {
    if (critterArray[i].markedForDeath) {
      critterArray[i].type = 'transparent';
      critterArray[i].markedForDeath = false;
    }
  }
    dropMatches()
}

//Make sure it doesn't wrap when matching
function checkForMatches() {
  for (i = 0; i < critterArray.length; i++) {
    if (critterArray[i + 2]) {
      if (critterArray[i].type === critterArray[i + 1].type && critterArray[i].type === critterArray[i + 2].type) {
        if (i % arrayWidthHeight !== arrayWidthHeight - 1 && i % arrayWidthHeight !== arrayWidthHeight - 2) {
          critterArray[i].markedForDeath = true;
          critterArray[i + 1].markedForDeath = true;
          critterArray[i + 2].markedForDeath = true;
        }
      }
    }
    if (critterArray[i + (arrayWidthHeight * 2)]) {
      if (critterArray[i].type === critterArray[i + arrayWidthHeight].type && critterArray[i].type === critterArray[i + (arrayWidthHeight * 2)].type) {
        critterArray[i].markedForDeath = true;
        critterArray[i + arrayWidthHeight].markedForDeath = true;
        critterArray[i + (arrayWidthHeight * 2)].markedForDeath = true;
      }
    }
  }
  eliminateMatches();
}

function moveSelectedCritters() {
  let secondSpecies = critterArray[currentIndex].type;
  let firstSpecies = critterArray[previousIndex].type;
  critterArray[currentIndex].type = firstSpecies;
  critterArray[previousIndex].type = secondSpecies;
}

function markSelectedCritter(event) {
  let currentYPos = event.clientY - ((window.innerHeight - canvas.height) / 2);
  let currentXPos = event.clientX - ((window.innerWidth - canvas.width) / 2);
  let calcYPos = Math.floor(currentYPos / critterWidth);
  let calcXPos = Math.floor(currentXPos / critterWidth);
  currentIndex = (calcYPos * arrayWidthHeight) + calcXPos;

  critterArray[currentIndex].selected = (critterArray[currentIndex].selected) ? false : true;
  if (
    (previousIndex === currentIndex - 1 && previousIndex % arrayWidthHeight !== arrayWidthHeight - 1) ||
    (previousIndex === currentIndex + 1 && previousIndex % arrayWidthHeight !== 0) ||
    (previousIndex === currentIndex - arrayWidthHeight) ||
    (previousIndex === currentIndex + arrayWidthHeight)
  ) {
    if (critterArray[currentIndex].selected === true && critterArray[previousIndex].selected === true) {
      critterArray[previousIndex].selected = false;
      critterArray[currentIndex].selected = false;
      moveSelectedCritters();
      previousIndex = 0;
      return;
    }
  }
    if (previousIndex !== currentIndex) critterArray[previousIndex].selected = false;
    previousIndex = currentIndex;
}

function generateCritters() {
  for (y = 0; y < arrayWidthHeight; y++) {
    for (x = 0; x < arrayWidthHeight; x++) {
      let xPosition = x;
      let yPosition = y;
      let index = y * arrayWidthHeight + x;
      let typeSelector = Math.floor(Math.random() * speciesArray.length);
      let type = speciesArray[typeSelector];
      critterArray.push(new Critter(xPosition, yPosition, type, index));
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (i = 0; i < critterArray.length; i++) {
    critterArray[i].update();
    critterArray[i].draw();
  }
  requestAnimationFrame(animate);
}

function init() {
  generateCritters();
  animate();
  setTimeout(() => {
    timer = setInterval(checkForMatches, 200);
  }, 3000);
}

canvas.addEventListener('click', function(e) {
  markSelectedCritter(e);
});

init();
