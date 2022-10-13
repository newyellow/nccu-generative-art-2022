// feature values
let isDarkPaper = false;

let preFrameShapeCount = 30;
let postFrameShapeCount = 30;

let rotationStyle = 0;
let rotationAddValue = 0;

let baseHue = 0.0;
let randomHueRange = 0.0;
let specialColorAddValue = 60;
let isMonoColor = false;

let shapeType = 0;
let SETTING_NO_TEXTURE = false;
// feature values

let minRecursiveLength = 20;


let bgNoiseX = 0.0;
let bgNoiseY = 0.0;
let bgNoiseScale = 0.0;

let scale = 1.0;
let scaler = 1.0;
let deviceScale = 1.0;
let baseLongSide = 2000;

let _draw;
let drawWidth;
let drawHeight;

// for finish
let isDrawFinished = false;

async function setup() {
  SetupFeatures();

  scale = scaler * deviceScale;
  baseLongSide = 2000 * scale;

  drawWidth = baseLongSide * 0.618;
  drawHeight = baseLongSide;

  let canvasHeight = windowHeight;
  let canvasWidth = canvasHeight * 0.618;

  if (canvasWidth > windowWidth) {
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / 0.618;
  }

  minRecursiveLength = 10 * scale;
  console.log(`scale ${scale}`);

  _draw = createGraphics(drawWidth, drawHeight);

  createCanvas(canvasWidth, canvasHeight);
  console.log(`image size: ${drawWidth} x ${drawHeight}`);

  if (isDarkPaper)
    _draw.background(30);
  else
    _draw.background(235);

  _draw.smooth();

  // setting up values
  baseHue = fxRandomRange(0, 360);
  randomHueRange = 30;
  console.log(`baseHue: ${baseHue}  hueRange: ${randomHueRange}`);

  let rotationAddRandom = fxRandomRange();
  if (rotationAddRandom < 0.2)
    rotationAddValue = 0;
  else if (rotationAddRandom < 0.6)
    rotationAddValue = -30.0;
  else
    rotationAddValue = 30.0;
  console.log(`rotation add value: ${rotationAddValue}`);

  bgNoiseX = fxRandomRange(-1000.0, 1000.0);
  bgNoiseY = fxRandomRange(-1000.0, 1000.0);
  bgNoiseScale = fxRandomRange(0.001, 0.002);

  baseHue = fxRandomRange(0, 360);

  const randomDrawMethods = [];

  if (shapeType == 0) {
    randomDrawMethods.push(randomRect);
  }
  else if (shapeType == 1) {
    randomDrawMethods.push(randomCircle);
    randomDrawMethods.push(randomThinArc);
  }
  else if (shapeType == 2) {

    randomDrawMethods.push(randomTriangles);
  }
  else if (shapeType == 3) {

    randomDrawMethods.push(randomThickArc);
  }
  else if (shapeType == 4) {

    randomDrawMethods.push(randomThickArc);
    randomDrawMethods.push(randomRect);
    randomDrawMethods.push(randomCircle);
    randomDrawMethods.push(randomThinArc);
    randomDrawMethods.push(randomTriangles);
  }

  // random shapes
  for (let i = 0; i < preFrameShapeCount; i++) {
    let methodIndex = floor(fxRandomRange(0, randomDrawMethods.length));
    randomDrawMethods[methodIndex]();

    await sleep(10);
  }

  // frame
  if (isDarkPaper)
    drawFrame(0, 30 * scale, 20);
  else
    drawFrame(0, 30 * scale, 245);

  // random shapes
  for (let i = 0; i < postFrameShapeCount; i++) {
    let methodIndex = floor(fxRandomRange(0, randomDrawMethods.length));
    randomDrawMethods[methodIndex]();

    await sleep(10);
  }

  if (!SETTING_NO_TEXTURE)
    await NYPaperTexture();

  isDrawFinished = true;
  console.log("Draw Finished!");

  if(isFxpreview)
  {
    fxpreview();
  }
}

function drawFrame(_padding, _width, _colorGrayValue) {
  // drawFrame
  let padding = _padding;
  let xFrameWidth = _width;
  let yFrameWidth = _width;

  _draw.colorMode(RGB);
  _draw.fill(_colorGrayValue);
  _draw.noStroke();
  _draw.rectMode(CORNER);

  // up
  _draw.rect(padding, padding, drawWidth - padding * 2, yFrameWidth);

  // bottom
  _draw.rect(padding, drawHeight - padding - yFrameWidth, drawWidth - padding * 2, yFrameWidth);

  // left
  _draw.rect(padding, padding, xFrameWidth, drawHeight - padding * 2);

  // right
  _draw.rect(drawWidth - padding - xFrameWidth, padding, xFrameWidth, drawHeight - padding * 2);
}

function randomThickArc() {
  let posX = fxRandomRange(-0.15, 1) * drawWidth;
  let posY = fxRandomRange(-0.15, 1.15) * drawHeight;

  let arcSize = fxRandomRange(0.01, 1.1) * drawWidth;
  let arcColorThickness = fxRandomRange(0.02, 0.4) * arcSize;

  let angleRange = fxRandomRange(30, 60);
  let rotateAngle = 0.0;

  if (rotationStyle == 0)
    rotateAngle = fxRandomRange(0, 360);
  else if (rotationStyle == 1)
    rotateAngle = floor(fxRandomRange(0, 4)) * 90 + rotationAddValue;
  else {
    rotateAngle = rotationAddValue;
  }

  NYArc(posX, posY, angleRange, rotateAngle, arcSize, arcColorThickness);
}

function randomThinArc() {
  let posX = fxRandomRange() * drawWidth;
  let posY = fxRandomRange() * drawHeight;

  let arcSize = fxRandomRange(0.01, 0.6) * drawWidth;
  let arcColorThickness = fxRandomRange(0.02, 0.2) * arcSize;

  let angleRange = fxRandomRange(60, 180);
  let rotateAngle = 0.0;

  if (rotationStyle == 0)
    rotateAngle = fxRandomRange(0, 360);
  else if (rotationStyle == 1)
    rotateAngle = floor(fxRandomRange(0, 6)) * 90 + rotationAddValue;
  else {
    rotateAngle = rotationAddValue;
  }

  NYArc(posX, posY, angleRange, rotateAngle, arcSize, arcColorThickness);
}

function NYArc(x, y, angleRange, rotateAngle, arcWidth, thickness) {

  let isSplit = fxRandomRange() < 0.7;
  if (isSplit && arcWidth > minRecursiveLength) {
    let padding = fxRandomRange(0.05, 0.4) * arcWidth;
    let newArcWidth = arcWidth - thickness - padding;
    let newThickness = fxRandomRange(0.1, 0.8) * newArcWidth;

    NYArc(x, y, angleRange, rotateAngle, newArcWidth, newThickness);
  }
  let fromAngle = - 0.5 * angleRange;
  let toAngle = 0.5 * angleRange;

  let arcFrom = radians(fromAngle);
  let arcTo = radians(toAngle);

  colorMode(HSB);
  let inverted = fxRandomRange() < 0.2;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  let spaceAdder = 1;

  if (fxRandomRange(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  spaceAdder *= scale;

  _draw.push();

  _draw.translate(x, y);
  _draw.rotate(radians(rotateAngle));

  // random black white
  let colorRandomValue = fxRandomRange();
  if (colorRandomValue < 0.08) {
    fromColor = color(0, 0, fxRandomRange(0, 30));
    toColor = color(0, 0, fxRandomRange(0, 30));
  }
  else if (colorRandomValue < 0.16) {
    fromColor = color(0, 0, fxRandomRange(80, 100));
    toColor = color(0, 0, fxRandomRange(80, 100));
  }

  // color thickness
  _draw.noFill();
  _draw.strokeWeight(2 * scale);
  for (let i = 0; i < thickness; i += spaceAdder) {

    let ratio = float(i) / thickness;
    let nowColor = NYLerpColor(fromColor, toColor, ratio);

    _draw.stroke(nowColor);
    _draw.arc(0, 0, arcWidth - i, arcWidth - i, arcFrom, arcTo, OPEN);
  }

  _draw.pop();
}

function randomRect() {
  let posX = fxRandomRange() * drawWidth;
  let posY = fxRandomRange() * drawHeight;

  let ratioX = fxRandomRange(0.2, 1.0);
  let ratioY = fxRandomRange(0.2, 1.0);

  let size = fxRandomRange(0.6, 0.8) * drawWidth;
  let sizeChance = fxRandomRange(0.0, 1.0);

  if (sizeChance > 0.9)
    size = fxRandomRange(0.6, 0.8) * drawWidth;
  else if (sizeChance > 0.5)
    size = fxRandomRange(0.2, 0.3) * drawWidth;
  else
    size = fxRandomRange(0.01, 0.06) * drawWidth;

  let thickness = fxRandomRange(1 * scale, size * 0.4);
  let rotateAngle = 0;

  if (rotationStyle == 0)
    rotateAngle = fxRandomRange(0, 360);
  else if (rotationStyle == 1)
    rotateAngle = floor(fxRandomRange(0, 8)) * 45 + rotationAddValue;
  else
    rotateAngle = rotationAddValue;

  NYRect(posX, posY, size * ratioX, size * ratioY, thickness, rotateAngle);
}

function NYRect(x, y, rectWidth, rectHeight, thickness, rotation) {

  let isSplit = fxRandomRange() < 0.7;

  if (isSplit && min(rectWidth, rectHeight) > minRecursiveLength) {
    let newSize = fxRandomRange(0.4, 0.9) * rectWidth;
    let newThickness = fxRandomRange(0.8, 1.2) * thickness;

    NYRect(x, y, newSize, newSize, newThickness, rotation);
  }

  let inverted = fxRandomRange() < 0.1;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  // random black white
  if (fxRandomRange(0.0, 1.0) > 0.92) {
    fromColor = color(0, 0, fxRandomRange(0, 30));
    toColor = color(0, 0, fxRandomRange(0, 30));
  }
  else if (fxRandomRange(0.0, 1.0) > 0.84) {
    fromColor = color(0, 0, fxRandomRange(80, 100));
    toColor = color(0, 0, fxRandomRange(80, 100));
  }

  let spaceAdder = 1;

  if (fxRandomRange(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  spaceAdder *= scale;
  _draw.strokeWeight(2 * scale);
  _draw.noFill();

  _draw.rectMode(CENTER);
  for (let i = 0; i < thickness; i += spaceAdder) {
    _draw.push();

    _draw.translate(x, y);
    _draw.rotate(radians(rotation));
    let ratio = float(i) / thickness;
    _draw.stroke(NYLerpColor(fromColor, toColor, ratio));
    _draw.rect(0, 0, rectWidth - i, rectHeight - i);

    _draw.pop();
  }

}

function randomTriangles() {

  let posX = fxRandomRange() * drawWidth;
  let posY = fxRandomRange() * drawHeight;

  let size = fxRandomRange(0.4, 0.6) * drawWidth;
  let upRatio = 1;

  let sizeChance = fxRandomRange(0.0, 1.0);

  if (sizeChance > 0.9)
    size = fxRandomRange(0.4, 0.6) * drawWidth;
  else if (sizeChance > 0.5)
    size = fxRandomRange(0.12, 0.24) * drawWidth;
  else
    size = fxRandomRange(0.01, 0.1) * drawWidth;

  let thickness = fxRandomRange(1 * scale, size * 0.4);

  let rotateAngle = 0;
  if (rotationStyle == 0)
    rotateAngle = fxRandomRange(0, 360);
  else if (rotationStyle == 1)
    rotateAngle = floor(fxRandomRange(0, 8)) * 90 + rotationAddValue;
  else
    rotateAngle = rotationAddValue;

  if (fxRandomRange() > 0.5)
    rotateAngle += 180.0;

  NYTriangle(posX, posY, size, upRatio, thickness, rotateAngle);
}

function NYTriangle(x, y, edgeLength, upRatio, thickness, rotateAngle) {
  let split = fxRandomRange(0.0, 1.0) < 0.7;

  if (split && edgeLength > minRecursiveLength) {
    let padding = fxRandomRange(0.0, 0.1) * edgeLength;
    let innerTriangleEdgeLength = edgeLength - padding - thickness;

    let newThickness = fxRandomRange(0.2, 1.0) * innerTriangleEdgeLength;
    let newRotation = rotateAngle;

    NYTriangle(x, y, innerTriangleEdgeLength, upRatio, newThickness, newRotation);
  }

  let inverted = fxRandomRange() < 0.2;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  if (fxRandomRange(0.0, 1.0) > 0.92) {
    fromColor = color(0, 0, fxRandomRange(0, 30));
    toColor = color(0, 0, fxRandomRange(0, 30));
  }
  else if (fxRandomRange(0.0, 1.0) > 0.84) {
    fromColor = color(0, 0, fxRandomRange(80, 100));
    toColor = color(0, 0, fxRandomRange(80, 100));
  }

  let spaceAdder = 1;

  if (fxRandomRange(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  spaceAdder *= scale;
  _draw.strokeWeight(2 * scale);
  _draw.noFill();

  for (let i = 0; i < thickness; i += spaceAdder) {
    _draw.push();

    let ratio = float(i) / thickness;
    let yLength = edgeLength * upRatio;
    _draw.stroke(NYLerpColor(fromColor, toColor, ratio));

    let topPoint = { x: 0.0, y: -yLength + i };
    let leftPoint = { x: sin(radians(240)) * (edgeLength - i), y: -cos(radians(240)) * (edgeLength - i) };
    let rightPoint = { x: sin(radians(120)) * (edgeLength - i), y: -cos(radians(120)) * (edgeLength - i) };

    _draw.translate(x, y);
    _draw.rotate(radians(rotateAngle));

    _draw.triangle(topPoint.x, topPoint.y, rightPoint.x, rightPoint.y, leftPoint.x, leftPoint.y);

    _draw.pop();
  }
}

function randomCircle() {
  let posX = fxRandomRange() * drawWidth;
  let posY = fxRandomRange() * drawHeight;

  let size = fxRandomRange(0.6, 0.8) * drawWidth;
  let sizeChance = fxRandomRange(0.0, 1.0);

  if (sizeChance > 0.9)
    size = fxRandomRange(0.6, 0.8) * drawWidth;
  else if (sizeChance > 0.4)
    size = fxRandomRange(0.2, 0.3) * drawWidth;
  else
    size = fxRandomRange(0.01, 0.06) * drawWidth;

  let thickness = fxRandomRange(1 * scale, size * 0.7);

  NYCircle(posX, posY, size, thickness);
}

function NYCircle(x, y, circleWidth, thickness) {

  let split = fxRandomRange() > 0.3;

  if (split && circleWidth > minRecursiveLength) {
    let padding = fxRandomRange(0.0, 0.2) * circleWidth;
    let innerCircleWidth = circleWidth - padding - thickness;
    let innerThickness = innerCircleWidth * fxRandomRange(0.05, 0.3);

    NYCircle(x, y, innerCircleWidth, innerThickness);
  }

  let inverted = fxRandomRange() < 0.2;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  if (fxRandomRange(0.0, 1.0) > 0.92) {
    fromColor = color(0, 0, fxRandomRange(0, 30));
    toColor = color(0, 0, fxRandomRange(0, 30));
  }
  else if (fxRandomRange(0.0, 1.0) > 0.84) {
    fromColor = color(0, 0, fxRandomRange(80, 100));
    toColor = color(0, 0, fxRandomRange(80, 100));
  }

  let spaceAdder = 1;

  if (fxRandomRange(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  spaceAdder *= scale;
  _draw.strokeWeight(2 * scale);
  _draw.noFill();

  for (let i = 0; i < thickness; i += spaceAdder) {
    let ratio = float(i) / thickness;
    _draw.stroke(NYLerpColor(fromColor, toColor, ratio));
    _draw.circle(x, y, circleWidth - i);
  }
}

async function NYPaperTexture() {
  let paperNoiseX = fxRandomRange(-1000.0, 1000.0);
  let paperNoiseY = fxRandomRange(-1000.0, 1000.0);
  let paperXScale = 0.012;
  let paperYScale = 1.23;

  let counter = 100;

  for (let x = 0; x < drawWidth; x++) {
    for (let y = 0; y < drawHeight; y++) {
      let nx = paperNoiseX + paperXScale * x;
      let ny = paperNoiseY + paperYScale * y;

      let noiseValue = noise(nx, ny);
      let colorValue = noiseValue * 255;

      _draw.blendMode(ADD);

      _draw.colorMode(RGB);
      _draw.fill(colorValue, 10);
      _draw.noStroke();

      _draw.rect(x, y, 1, 1);

      if ((counter++ % 10000) == 0) {
        await sleep(100);
      }
    }
  }
}

function draw() {
  image(_draw, 0, 0, width, height);

  if (isDrawFinished)
    noLoop();
}


function NYRandomColor(isSpecial) {
  colorMode(HSB);

  let newHue = baseHue + fxRandomRange(-randomHueRange, randomHueRange);

  if (isSpecial) {
    newHue += specialColorAddValue;
  }

  if (newHue > 360.0)
    newHue -= 360.0;
  else if (newHue < 0.0)
    newHue += 360.0;

  let newSat = fxRandomRange(40, 80);
  let newBright = fxRandomRange(60, 90);

  // // light color
  if (isDarkPaper == false) {
    newSat = fxRandomRange(20, 60);
    newBright = fxRandomRange(60, 100);
  }

  if (isMonoColor) {
    newSat = 0;
    newBright = fxRandomRange(10, 90);
  }

  let newColor = color(newHue, newSat, newBright);

  return newColor;
}

function NYLerpColor(fromColor, toColor, t) {

  colorMode(HSB);

  let fromHue = hue(fromColor);
  let toHue = hue(toColor);

  let newSat = lerp(saturation(fromColor), saturation(toColor), t);
  let newBright = lerp(brightness(fromColor), brightness(toColor), t);

  if (fromHue < toHue) {

    if (abs(fromHue - toHue) > abs(fromHue - (toHue - 360)))
      toHue = toHue - 360;
  }
  else if (fromHue > toHue) {
    if (abs(fromHue - toHue) > abs(fromHue - (toHue + 360)))
      toHue = toHue + 360;
  }

  let newHue = lerp(fromHue, toHue, t);

  if (newHue > 360)
    newHue -= 360;
  else if (newHue < 0)
    newHue += 360;

  return color(newHue, newSat, newBright);

}


function keyPressed(e) {
  let key = e.key;

  if (key == 's' || key == 'S') {
    let fileName = 'random and shapes-' + fxhash + '.png';
    save(_draw, fileName);
  }
  else {
    if (isDrawFinished) {
      if (key == '1') {
        doRedraw(1);
      }
      else if (key == '2') {
        doRedraw(2);
      }
      else if (key == '3') {
        doRedraw(3);
      }
      else if (key == '4') {
        doRedraw(4);
      }
      else if (key == '5') {
        doRedraw(5);
      }
      else if (key == '6') {
        doRedraw(6);
      }
      else if(key == 't' || key == 'T')
      {
        SETTING_NO_TEXTURE = !SETTING_NO_TEXTURE;
        doRedraw(scale*2);
      }
    }
    else {
      console.log("Please wait till draw finish to re-draw");
    }
  }
}

function doRedraw(redrawScale) {
  fxrand = sfc32(...hashes);

  scaler = redrawScale * 0.5;
  isDrawFinished = false;
  loop();

  setup();
  draw();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}