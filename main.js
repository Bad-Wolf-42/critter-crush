const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = canvas.width;

let critterArray = [];
let speciesArray = ['red', 'blue', 'green', 'purple', 'orange'];
const critterWidth = canvas.width / 10;
const arrayWidthHeight = canvas.width / critterWidth;
const maxCritters = arrayWidthHeight * arrayWidthHeight;

class Critter {
  constructor(x, y, type, index) {
    this.width = critterWidth;
    this.height = critterWidth;
    this.x = x * this.width;
    this.y = y * this.height;
    this.initialY = 0 - this.y;
    this.vy = 4;
    this.falling = true;
    this.type = type;
    this.index = index;
    this.selected = false;
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

function markSelectedCritter(event) {
  let currentYPos = event.clientY - ((window.innerHeight - canvas.height) / 2);
  let currentXPos = event.clientX - ((window.innerWidth - canvas.width) / 2);
  let calcYPos = Math.floor(currentYPos / critterWidth);
  let calcXPos = Math.floor(currentXPos / critterWidth);
  let currentIndex = (calcYPos * arrayWidthHeight) + calcXPos;
  critterArray[currentIndex].selected = (critterArray[currentIndex].selected) ? false : true;
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
}

canvas.addEventListener('click', function(e) {
  markSelectedCritter(e);
});

init();
