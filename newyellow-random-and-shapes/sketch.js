let baseHue = 0.0;
let randomHueRange = 0.0;

let bgNoiseX = 0.0;
let bgNoiseY = 0.0;
let bgNoiseScale = 0.0;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  background(30);
  smooth();

  // setting up values
  baseHue = random(0, 360);
  randomHueRange = 30;
  console.log(`baseHue: ${baseHue}  hueRange: ${randomHueRange}`);

  bgNoiseX = random(-1000.0, 1000.0);
  bgNoiseY = random(-1000.0, 1000.0);
  bgNoiseScale = random(0.001, 0.002);

  baseHue = random(0, 360);

  const randomDrawMethods = [];
  randomDrawMethods.push(randomArc);
  // randomDrawMethods[1] = () => { randomLines(random(1, 4)) };
  // randomDrawMethods.push(randomRect);
  // randomDrawMethods.push(randomCircle);
  // randomDrawMethods.push(randomTriangles);

  // random arc
  for (let i = 0; i < 100; i++) {

    random(randomDrawMethods)();
    // filter(BLUR, 1);
    await sleep(10);
  }

  // frame
  drawFrame();


  // random arcs
  for (let i = 0; i < 20; i++) {
    random(randomDrawMethods)();
    await sleep(10);
  }

  //await noiseBackground();
  await NYPaperTexture();

  filter(DILATE);
}

function drawFrame() {
  // drawFrame
  let padding = 0;
  let xFrameWidth = 60;
  let yFrameWidth = 20;

  let xSlices = 200;
  let ySlices = 300;

  let xThickness = (width - padding * 2) / (xSlices * 2);
  let yThickness = (height - padding * 2) / (ySlices * 2);

  colorMode(RGB);
  fill(15);
  noStroke();
  rectMode(CORNER);


  // up
  // for(let i=0; i< xSlices; i++)
  // {
  //   rect(padding + i * xThickness * 2, padding, xThickness, xFrameWidth);
  // }
  rect(padding, padding, width - padding * 2, yFrameWidth);

  // bottom
  // for(let i=0; i< xSlices; i++)
  // {
  //   rect(padding + i * xThickness * 2, height - padding - xFrameWidth, xThickness, xFrameWidth);
  // }
  rect(padding, height - padding - yFrameWidth, width - padding * 2, yFrameWidth);

  // left
  // for(let i=0; i< ySlices; i++)
  // {
  //   rect(padding, padding + i * yThickness * 2, yFrameWidth, yThickness);
  // }
  rect(padding, padding, xFrameWidth, height - padding * 2);

  // right
  // for(let i=0; i< ySlices; i++)
  // {
  //   rect(width - padding - yFrameWidth, padding + i * yThickness * 2, yFrameWidth, yThickness);
  // }
  rect(width - padding - xFrameWidth, padding, xFrameWidth, height - padding * 2);
}

function randomArc() {
  let posX = random(0.1, 0.9) * width;
  let posY = random(0.1, 0.9) * height;

  let arcSize = random(0.01, 1.2) * width;
  let arcColorThickness = random(0.02, 0.4) * arcSize;

  let angleRange = 30;
  let rotateAngle = -45;

  NYArc(posX, posY, angleRange, rotateAngle, arcSize, arcColorThickness);
  NYArc(posX, posY, angleRange, rotateAngle + 180, arcSize, arcColorThickness);
}

function NYArc(x, y, angleRange, rotateAngle, drawWidth, thickness) {

  let isSplit = random() < 0.7;
  if (isSplit && drawWidth > 10) {
    let padding = random(0.05, 0.4) * drawWidth;
    let newDrawWidth = drawWidth - thickness - padding;
    let newThickness = random(0.1, 0.8) * newDrawWidth;

    NYArc(x, y, angleRange, rotateAngle, newDrawWidth, newThickness);
  }
  let fromAngle = - 0.5 * angleRange;
  let toAngle = 0.5 * angleRange;

  let arcFrom = radians(fromAngle);
  let arcTo = radians(toAngle);

  colorMode(HSB);
  let inverted = random() < 0.2;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  let randomAddAmount = int(random(4, 12));
  let colorIndexAddAmount = 1;

  if (random() < 0.7)
    colorIndexAddAmount = randomAddAmount;

  push();

  translate(x, y);
  rotate(radians(rotateAngle));

  // draw stroke
  // stroke(0);
  // strokeWeight(1);
  // noFill();
  // let strokeDrawWidth = drawWidth;
  // for (let i = 0; i < strokeThickness; i += strokeIndexAddAmount) {
  //   arc(0, 0, strokeDrawWidth - i, strokeDrawWidth - i, arcFrom, arcTo, OPEN);
  // }

  // random black white
  let colorRandomValue = random();
  if (colorRandomValue < 0.1) {
    fromColor = color(0, 0, random(0, 30));
    toColor = color(0, 0, random(0, 30));
  }
  else if (colorRandomValue < 0.25) {
    fromColor = color(0, 0, random(0, 30));
    toColor = color(0, 0, random(0, 30));
  }

  // color thickness
  noFill();
  strokeWeight(1);
  for (let i = 0; i < thickness; i += colorIndexAddAmount) {

    let ratio = float(i) / thickness;
    let nowColor = NYLerpColor(fromColor, toColor, ratio);

    stroke(nowColor);
    arc(0, 0, drawWidth - i, drawWidth - i, arcFrom, arcTo, OPEN);
  }

  pop();
}

function randomRect() {
  let posX = random(0.1, 0.9) * width;
  let posY = random(0.1, 0.9) * height;

  let ratioX = random(0.2, 1.0);
  let ratioY = random(0.2, 1.0);

  let size = random(0.6, 0.8) * width;
  let sizeChance = random(0.0, 1.0);

  if (sizeChance > 0.9)
    size = random(0.6, 0.8) * width;
  else if (sizeChance > 0.5)
    size = random(0.2, 0.3) * width;
  else
    size = random(0.01, 0.06) * width;

  let thickness = random(1, size * 0.4);
  let rotateAngle = 45;

  NYRect(posX, posY, size * ratioX, size * ratioY, thickness, rotateAngle);
}

function NYRect(x, y, rectWidth, rectHeight, thickness, rotation) {

  let isSplit = random() < 0.7;

  if (isSplit && min(rectWidth, rectHeight) > 10) {
    let newSize = random(0.4, 0.9) * rectWidth;
    let newThickness = random(0.8, 1.2) * thickness;

    NYRect(x, y, newSize, newSize, newThickness, rotation);
  }

  let inverted = random() < 0.1;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  // random black white
  if (random(0.0, 1.0) > 0.9) {
    fromColor = color(0, 0, random(0, 30));
    toColor = color(0, 0, random(0, 30));
  }
  else if (random(0.0, 1.0) > 0.75) {
    fromColor = color(0, 0, random(90, 100));
    toColor = color(0, 0, random(90, 100));
  }

  let spaceAdder = 1;

  if (random(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  strokeWeight(2);
  noFill();

  rectMode(CENTER);
  for (let i = 0; i < thickness; i += spaceAdder) {
    push();

    translate(x, y);
    rotate(rotation);
    let ratio = float(i) / thickness;
    stroke(NYLerpColor(fromColor, toColor, ratio));
    rect(0, 0, rectWidth - i, rectHeight - i);

    pop();
  }

}

function randomTriangles() {
  let isUp = random() >= 0.5;

  let posX = random(0.1, 0.9) * width;
  let posY = random(0.1, 0.9) * height;

  let size = random(0.4, 0.6) * width;
  let upRatio = 1;

  let sizeChance = random(0.0, 1.0);

  if (sizeChance > 0.9)
    size = random(0.4, 0.6) * width;
  else if (sizeChance > 0.5)
    size = random(0.12, 0.24) * width;
  else
    size = random(0.01, 0.1) * width;

  let thickness = random(1, size * 0.4);
  let rotateAngle = -20 + int(random(0, 3)) * 180;

  if (isUp) {
    posY = random(0.1, 0.6) * height;
    rotateAngle = 0;
  }
  else {
    posY = random(0.6, 0.9) * height;
    rotateAngle = 180;
  }

  NYTriangle(posX, posY, size, upRatio, thickness, rotateAngle);
}

function NYTriangle(x, y, edgeLength, upRatio, thickness, rotateAngle) {
  let split = random(0.0, 1.0) < 0.7;

  if (split && edgeLength > 10) {
    let padding = random(0.0, 0.1) * edgeLength;
    let innerTriangleEdgeLength = edgeLength - padding - thickness;

    let newThickness = random(0.2, 1.0) * innerTriangleEdgeLength;
    let newRotation = rotateAngle;

    NYTriangle(x, y, innerTriangleEdgeLength, upRatio, newThickness, newRotation);
  }

  let inverted = random() < 0.2;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  if (random(0.0, 1.0) > 0.9) {
    fromColor = color(0, 0, random(0, 30));
    toColor = color(0, 0, random(0, 30));
  }
  else if (random(0.0, 1.0) > 0.75) {
    fromColor = color(0, 0, random(90, 100));
    toColor = color(0, 0, random(90, 100));
  }

  let spaceAdder = 1;

  if (random(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  strokeWeight(2);
  noFill();

  for (let i = 0; i < thickness; i += spaceAdder) {
    push();

    let ratio = float(i) / thickness;
    let yLength = edgeLength * upRatio;
    stroke(NYLerpColor(fromColor, toColor, ratio));

    let topPoint = { x: 0.0, y: -yLength + i };
    let leftPoint = { x: sin(radians(240)) * (edgeLength - i), y: -cos(radians(240)) * (edgeLength - i) };
    let rightPoint = { x: sin(radians(120)) * (edgeLength - i), y: -cos(radians(120)) * (edgeLength - i) };

    translate(x, y);
    rotate(radians(rotateAngle));

    triangle(topPoint.x, topPoint.y, rightPoint.x, rightPoint.y, leftPoint.x, leftPoint.y);

    pop();
  }
}

function randomCircle() {
  let posX = random(0.1, 0.9) * width;
  let posY = random(0.1, 0.9) * height;

  let size = random(0.6, 0.8) * width;
  let sizeChance = random(0.0, 1.0);

  if (sizeChance > 0.9)
    size = random(0.6, 0.8) * width;
  else if (sizeChance > 0.4)
    size = random(0.2, 0.3) * width;
  else
    size = random(0.01, 0.06) * width;

  let thickness = random(1, size * 0.7);

  NYCircle(posX, posY, size, thickness);
}

function NYCircle(x, y, drawWidth, thickness) {

  let split = random(0.0, 1.0) > 0.3;

  if (split && drawWidth > 10) {
    let padding = random(0.0, 0.1) * drawWidth;
    let innerCircleWidth = drawWidth - padding - thickness;

    NYCircle(x, y, innerCircleWidth, random(1, min(100, innerCircleWidth)));
  }

  let inverted = random() < 0.2;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  if (random(0.0, 1.0) > 0.9) {
    fromColor = color(0, 0, random(0, 30));
    toColor = color(0, 0, random(0, 30));
  }
  else if (random(0.0, 1.0) > 0.75) {
    fromColor = color(0, 0, random(90, 100));
    toColor = color(0, 0, random(90, 100));
  }

  let spaceAdder = 1;

  if (random(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  strokeWeight(2);
  noFill();

  for (let i = 0; i < thickness; i += spaceAdder) {
    let ratio = float(i) / thickness;
    stroke(NYLerpColor(fromColor, toColor, ratio));
    circle(x, y, drawWidth - i);
  }
}

function randomLines(pointNum) {
  let startPointX = random(width * 0.1, width * 0.9);
  let startPointY = random(height * 0.1, height * 0.9);

  let points = [];
  points[0] = new NYPoint(startPointX, startPointY);

  // push point data
  for (let i = 0; i < pointNum; i++) {
    let newPoint = new NYPoint();
    newPoint.randomFromPoint(points[i], width * random(0.1, 0.6));
    points.push(newPoint);
  }

  stroke(0);
  // strokeWeight(random(1, 0));
  strokeWeight(10);
  strokeCap(SQUARE);
  noFill();

  let spaceAdder = 1;
  if (random(0.0, 1.0) > 0.5)
    spaceAdder = 6;

  // random draw line
  vertex(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += spaceAdder) {
    let fromPoint = points[0];
    let toPoint = points[i];

    line(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y);
  }

}

class NYPoint {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  randomFromPoint(point, range) {
    this.x = point.x + random(-0.5 * range, 0.5 * range);
    this.y = point.y + random(-0.5 * range, 0.5 * range);
  }
}

function NYRandomColor(inverted) {
  colorMode(HSB);
  let newHue = baseHue + random(-randomHueRange, randomHueRange);

  if (inverted) {
    newHue -= 60.0;
  }

  if (newHue > 360.0)
    newHue -= 360.0;
  else if (newHue < 0.0)
    newHue += 360.0;

  let newColor = color(newHue, random(40, 80), random(60, 90));

  return newColor;
}

async function noiseBackground() {
  colorMode(HSB);

  let bgHue = baseHue + random(-randomHueRange, randomHueRange);

  let fromColor = color(10, 60, 90);
  bgHue += random(20, 40);

  if (bgHue < 0)
    bgHue += 360.0;
  else if (bgHue > 360.0)
    bgHue -= 360.0;

  let toColor = color(120, 60, 90);

  strokeWeight(1);

  // NYNoiseBGLines(fromColor, toColor);
  // await sleep(50);

}

function NYNoiseBGLines(fromColor, toColor) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let nx = bgNoiseX + bgNoiseScale * x;
      let ny = bgNoiseY + bgNoiseScale * y;

      let noiseValue = noise(nx, ny);
      let newColor = NYLerpColor(fromColor, toColor, noiseValue);

      stroke(newColor);
      point(x, y);
    }
  }
}

async function NYPaperTexture() {
  let paperNoiseX = random(-1000.0, 1000.0);
  let paperNoiseY = random(-1000.0, 1000.0);
  let paperXScale = 0.012;
  let paperYScale = 1.23;

  let counter = 100;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let nx = paperNoiseX + paperXScale * x;
      let ny = paperNoiseY + paperYScale * y;

      let noiseValue = noise(nx, ny);
      let colorValue = noiseValue * 255;

      blendMode(ADD);

      colorMode(RGB);
      fill(colorValue, 10);
      noStroke();

      rect(x, y, 1, 1);

      if ((counter++ % 10000) == 0) {
        await sleep(100);
        console.log('wait?');
      }
    }
  }
}

function draw() {

}

function NYLerpColor(fromColor, toColor, t) {

  colorMode(HSB);

  let fromHue = hue(fromColor);
  let toHue = hue(toColor);
  let rotatedHue = toHue + 360.0;

  let newSat = lerp(saturation(fromColor), saturation(toColor), t);
  let newBright = lerp(brightness(fromColor), brightness(toColor), t);

  if (abs(fromHue - toHue) > abs(fromHue - rotatedHue)) {
    let newHue = lerp(fromHue, rotatedHue, t);

    if (newHue > 360.0)
      newHue -= 360.0;

    return color(newHue, newSat, newBright);
  }
  else {
    let newHue = lerp(fromHue, toHue, t);

    return color(newHue, newSat, newBright);
  }
}


function keyPressed(e) {
  let key = e.key;

  if (key == 's' || key == 'S') {
    let fileName = 'random and shapes-' + fxhash + '.png';
    save(fileName);
  }
  // else {
  //   if (drawFinished) {
  //     if (key == '1') {
  //       doRedraw(1);
  //     }
  //     else if (key == '2') {
  //       doRedraw(2);
  //     }
  //     else if (key == '3') {
  //       doRedraw(3);
  //     }
  //     else if (key == '4') {
  //       doRedraw(4);
  //     }
  //     else if (key == '5') {
  //       doRedraw(5);
  //     }
  //     else if (key == '6') {
  //       doRedraw(6);
  //     }
  //     else if (key == 't' || key == 'T') {
  //       SETTING_NO_TEXTURE = !SETTING_NO_TEXTURE;
  //       doRedraw(scaler * 2);
  //     }
  //   }
  //   else {
  //     console.log("Please wait till draw finish to re-draw");
  //   }
  // }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}