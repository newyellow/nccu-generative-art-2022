
// setting stuff
let MAX_WALK_RANGE = 0.0;

// setting stuff


let padding = 40;

let worms = [];

let rotateMap;
let scaleMap;
let curveMap;
let lengthMap;
let walkSpeedMap;
let walkRangeMap;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200);

  MAX_WALK_RANGE = random(0.05, 0.3) * width;

  rotateMap = new NYNoiseMap(0.001, 0.001);
  scaleMap = new NYNoiseMap(0.001, 0.002);
  curveMap = new NYNoiseMap(0.001, 0.001);
  lengthMap = new NYNoiseMap(0.005, 0.002);
  walkSpeedMap = new NYNoiseMap(0.1, 0.1);
  walkRangeMap = new NYNoiseMap(0.3, 0.6);

  let isMoveTogether = random() > 0.5;
  let togetherAngle = random(0, 360);

  let maxThickness = random(3, 24);

  let xCount = int(random(1, 36));
  let yCount = int(random(1, 36));

  // console.log(`${xCount} ${yCount}`);

  let xSpace = float(width - padding * 2) / xCount;
  let ySpace = float(height - padding * 2) / yCount;

  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      let posX = padding + (x + 0.5) * xSpace;
      let posY = padding + (y + 0.5) * ySpace;

      let rotationValue = rotateMap.getNoise(posX, posY) * 360.0;
      if(isMoveTogether) rotationValue = togetherAngle;

      let thickness = scaleMap.getNoise(posX, posY) * maxThickness;
      let length = 0.6 + (lengthMap.getNoise(posX, posY) * 1.6) * ySpace;

      let newWorm = new Worm(posX, posY, length, thickness, rotationValue);
      newWorm.curveScale = scaleMap.getNoise(posX, posY) * 30 + 1;
      newWorm.walkSpeed = scaleMap.getNoise(posX, posY) * 30 + 1;
      newWorm.walkRange = walkRangeMap.getNoise(posX, posY) * MAX_WALK_RANGE + 6;
      worms.push(newWorm);
    }
  }
}

function draw() {

  background(200);
  // noStroke();
  // rect(padding -10, padding-10, width - padding * 2 + 20, height - padding * 2 + 20);

  for (let i = 0; i < worms.length; i++) {
    worms[i].draw();
    worms[i].walkPos += worms[i].walkSpeed;
  }

}


class Worm {
  constructor(posX, posY, length, thickness, rotation = 0.0) {
    this.x = posX;
    this.y = posY;

    this.walkPos = random(0, 360);
    this.curveScale = random(60, 360);
    this.walkSpeed = random(1, 20);
    this.walkRange = random(10, 20);
    this.edges = 20;

    this.length = length;
    this.thickness = thickness;
    this.rotation = rotation;
  }


  draw() {
    push();

    translate(this.x, this.y);
    rotate(radians(this.rotation));

    stroke(30);
    // noStroke();
    // fill(0);
    strokeWeight(this.thickness);

    strokeCap(SQUARE);
    this.wormLine();

    pop();
  }

  wormLine() {
    let stepLength = float(this.length) / float(this.edges);

    let lastX = sin(radians(this.walkPos + this.curveScale * -1)) * this.walkRange;
    let lastY = -0.5 * this.length;

    for (let i = 0; i < this.edges; i++) {
      let x = sin(radians(this.walkPos + this.curveScale * i)) * this.walkRange;
      let y = lastY + stepLength;

      // point(x, y);
      // circle(x, y, this.thickness);
      line(lastX, lastY, x, y);

      lastX = x;
      lastY = y;
    }
  }


}

class NYNoiseMap {
  constructor(scaleX, scaleY) {
    this.mapX = random(-10000.0, 10000.0);
    this.mapY = random(-10000.0, 10000.0);
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }

  setMap(x, y) {
    this.mapX = x;
    this.mapY = y;
  }

  getNoise(x, y) {
    return noise(this.mapX + x * this.scaleX, this.mapY + y * this.scaleY);
  }

  move(x, y) {
    this.mapX += x * this.scaleX;
    this.mapY += y * this.scaleY;

    return noise(this.mapX, this.mapY);
  }
}