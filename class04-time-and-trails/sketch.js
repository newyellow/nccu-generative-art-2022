

let objs = [];
let baseHue = 0;

function setup() {
  createCanvas(800, 1200);
  background(30);

  for (let i = 0; i < 40; i++) {
    objs[i] = new NYObject(0, 30 * i);
  }

  baseHue = random(0, 360);
}

function draw() {

  for (let i = 0; i < 40; i++) {
    objs[i].draw();
  }
}

class NYObject {
  constructor(_x, _y) {
    this.xPos = _x;
    this.yPos = _y;

    this.moveSpeed = random(3, 20);

    this.moveAngle = random(0, 360);
    this.angleAdd = random(1, 40);

    this.rectWidth = 100;
    this.rectHeight = 200;

    this.shapeAddX = random(-3, 3);
    this.shapeAddY = random(-3, 3);

    this.hue = baseHue + random(-30, 30);
    if (this.hue > 360)
      this.hue -= 360;
    else if (this.hue < 0)
      this.hue += 360;

    this.sat = random(30, 90);
    this.brightness = random(60, 100);

    this.brushSize = random(1, 10);

    this.life = random(10, 60);
  }

  draw() {
    this.moveAngle += this.angleAdd;
    this.xPos = this.xPos + this.moveSpeed;
    this.yPos += sin(radians(this.moveAngle)) * 5;

    this.rectWidth -= this.shapeAddX;
    this.rectHeight -= this.shapeAddY;

    this.life -= 1;

    this.hue += sin(radians(this.moveAngle)) * 5;

    if (this.life > 0) {
      colorMode(HSB);
      noFill();
      stroke(this.hue, this.sat, this.brightness);
      strokeWeight(this.brushSize);
      rect(this.xPos, this.yPos, this.rectWidth, this.rectHeight);
    }
  }
}