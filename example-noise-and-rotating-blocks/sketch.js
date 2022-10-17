
let noiseStartX = Math.random() * 2000.0 - 1000.0;
let noiseStartY = Math.random() * 2000.0 - 1000.0;
let noiseStartZ = Math.random() * 2000.0 - 1000.0;
let noiseScale = 0.012;

let rotateNoiseX = Math.random() * 2000.0 - 1000.0;
let rotateNoiseY = Math.random() * 2000.0 - 1000.0;
let rotateNoiseScale = 0.006;

let xCount = 30;
let yCount = 60;

function setup() {
  createCanvas(600, 800);
  background(200);
}

function draw() {

  background(200);


  let padding = 20;
  let rotSpeed = 1.0;

  noiseStartZ += 0.01;
  // rotateNoiseX += 0.01;


  let blockWidth = (width - 2 * padding) / xCount;
  let blockHeight = (height - 2 * padding) / yCount;

  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      let xPos = padding + x * blockWidth;
      let yPos = padding + y * blockHeight;

      let sizeRatio = noise(noiseStartX + xPos * noiseScale, noiseStartY + yPos * noiseScale, noiseStartZ) * 1.5;
      xPos += ((1.0 - sizeRatio) * blockWidth) / 2;
      yPos += ((1.0 - sizeRatio) * blockHeight) / 2;

      let newWidth = blockWidth * sizeRatio;
      let newHeight = blockHeight * sizeRatio;

      let rotateAngle = noise(rotateNoiseX + xPos * rotateNoiseScale, rotateNoiseY + yPos * rotateNoiseScale) * 360 - frameCount * rotSpeed;
      push();

      translate(xPos, yPos);
      rotate(radians(rotateAngle));

      noFill();
      rect(0, 0, newWidth, newHeight);

      pop();
    }
  }

}
