
let noiseXScale = 0.0001;
let noiseYScale = 0.0001;
let noiseAngleRange = 720;

let baseHue = 0.0;

async function setup() {
  createCanvas(800, 1200);
  background(30);

  stroke('red');
  // drawArrows(30, 30);

  baseHue = random(0, 360);
  colorMode(HSB);

  // draw small lines
  for (let i = 0; i < 600; i++) {
    let xPos = random(0, width);
    let yPos = random(0, height);
    let drawLength = floor(random(1, 20)) * 10;

    let drawHueA = baseHue + random(-30, 30);
    let drawHueB = baseHue + random(-30, 30);

    if (random() < 0.3)
      drawHueB += 180;

    if (drawHueA > 360)
      drawHueA -= 360;
    else if (drawHueA < 0)
      drawHueA += 360;

    if (drawHueB > 360)
      drawHueB -= 360;
    else if (drawHueB < 0)
      drawHueB += 360;

    let drawSatA = random(30, 80);
    let drawSatB = random(30, 80);

    let drawBriA = random(30, 80);
    let drawBriB = random(30, 80);

    let colorA = color(drawHueA, drawSatA, drawBriA);
    let colorB = color(drawHueB, drawSatB, drawBriB);

    noStroke();

    drawFieldLine(xPos, yPos, drawLength, 3, colorB, colorA, -1);
    drawFieldLine(xPos, yPos, drawLength, 3, colorA, colorB);
    await sleep(1);
  }

  for (let i = 0; i < 200; i++) {

    let xPos = random(0, width);
    let yPos = random(0, height);
    let drawLength = floor(random(1, 6)) * 30;

    let drawHueA = baseHue + random(-30, 30);
    let drawHueB = baseHue + random(-30, 30);

    let thicknessLevel = int(random(0, 3));

    if (random() < 0.3)
      drawHueB += 180;

    if (drawHueA > 360)
      drawHueA -= 360;
    else if (drawHueA < 0)
      drawHueA += 360;

    if (drawHueB > 360)
      drawHueB -= 360;
    else if (drawHueB < 0)
      drawHueB += 360;

    let drawSatA = random(30, 80);
    let drawSatB = random(30, 80);

    let drawBriA = random(60, 100);
    let drawBriB = random(80, 100);

    let colorA = color(drawHueA, drawSatA, drawBriA);
    let colorB = color(drawHueB, drawSatB, drawBriB);

    noStroke();

    // drawFieldLine(xPos, yPos, drawLength, 20, colorB, colorA);
    if (thicknessLevel == 2) {
      drawFieldLineRandomColor(xPos, yPos, drawLength, 60);
      drawFieldLineRandomColor(xPos, yPos, drawLength, 40);
      drawFieldLine(xPos, yPos, drawLength, 20, colorA, colorB);
    } else if (thicknessLevel == 1) {
      drawFieldLineRandomColor(xPos, yPos, drawLength, 30);
      drawFieldLineRandomColor(xPos, yPos, drawLength, 20);
      drawFieldLine(xPos, yPos, drawLength, 10, colorA, colorB);
    } else if (thicknessLevel == 0) {
      drawFieldLineRandomColor(xPos, yPos, drawLength, 12);
      drawFieldLineRandomColor(xPos, yPos, drawLength, 6);
      drawFieldLine(xPos, yPos, drawLength, 3, colorA, colorB);
    }
    await sleep(1);
  }
}

function drawFieldLineRandomColor(_startX, _startY, _length, _thickness) {
  let x = _startX;
  let y = _startY;

  let fillColor = getRandomColor();
  let fillSteps = random(0.05, 0.4) * _length;

  for (let i = 0; i < _length; i++) {
    let t = i / _length;

    fill(fillColor);
    let noiseAngle = noise(x * noiseXScale, y * noiseYScale) * noiseAngleRange;

    circle(x, y, _thickness);

    x += sin(radians(noiseAngle));
    y += cos(radians(noiseAngle));

    fillSteps--;
    if (fillSteps <= 0) {
      fillColor = getRandomColor();
      fillSteps = random(0.05, 0.4) * _length;
    }
  }
}

function drawFieldLine(_startX, _startY, _length, _thickness, _fromColor, _toColor, _dir = 1) {
  let x = _startX;
  let y = _startY;

  for (let i = 0; i < _length; i++) {
    let t = i / _length;

    fill(lerpColor(_fromColor, _toColor, t));
    let noiseAngle = noise(x * noiseXScale, y * noiseYScale) * noiseAngleRange;

    circle(x, y, _thickness);

    x += sin(radians(noiseAngle)) * _dir;
    y += cos(radians(noiseAngle)) * _dir;
  }
}

function getRandomColor() {
  let randomHue = baseHue + random(-30, 30);
  let randomSat = random(30, 80);
  let randomBri = random(30, 100);

  if (randomHue > 360)
    randomHue -= 360;
  else if (randomHue < 0)
    randomHue += 360;

  if (random() < 0.06) {
    randomSat = 0;
    randomBri = 100;
  }

  return color(randomHue, randomSat, randomBri);
}

function drawArrows(_xNum, _yNum) {

  let xSpace = width / _xNum;
  let ySpace = height / _yNum;

  for (let x = 0; x < _xNum; x++) {
    for (let y = 0; y < _yNum; y++) {
      let xPos = (x + 0.5) * xSpace;
      let yPos = (y + 0.5) * ySpace;

      let noiseAngle = noise(xPos * noiseXScale, yPos * noiseYScale) * noiseAngleRange;

      push();
      translate(xPos, yPos);
      rotate(radians(-noiseAngle));
      line(0, -0.4 * ySpace, 0, 0.4 * ySpace);
      line(0, 0.4 * ySpace, 0.3 * xSpace, 0.0);
      line(0, 0.4 * ySpace, -0.3 * xSpace, 0.0);

      pop();
    }
  }
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
