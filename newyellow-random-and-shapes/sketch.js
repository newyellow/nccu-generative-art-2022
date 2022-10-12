// feature values
let preFrameShapeCount = 30;
let postFrameShapeCount = 30;

let baseHue = 0.0;
let randomHueRange = 0.0;
let specialColorAddValue = 60;
// feature values



let bgNoiseX = 0.0;
let bgNoiseY = 0.0;
let bgNoiseScale = 0.0;

let scale = 1.0;
let baseLongSide = 2000;

let _draw;
let drawWidth;
let drawHeight;

async function setup() {
  SetupFeatures();

  scale = 1;
  baseLongSide *= scale;

  drawWidth = baseLongSide * 0.618;
  drawHeight = baseLongSide;

  let canvasHeight = windowHeight;
  let canvasWidth = canvasHeight * 0.618;

  if (canvasWidth > windowWidth) {
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / 0.618;
  }

  _draw = createGraphics(drawWidth, drawHeight);

  createCanvas(canvasWidth, canvasHeight);
  _draw.background(30);
  _draw.smooth();

  // setting up values
  baseHue = fxRandomRange(0, 360);
  randomHueRange = 30;
  console.log(`baseHue: ${baseHue}  hueRange: ${randomHueRange}`);

  bgNoiseX = fxRandomRange(-1000.0, 1000.0);
  bgNoiseY = fxRandomRange(-1000.0, 1000.0);
  bgNoiseScale = fxRandomRange(0.001, 0.002);

  baseHue = fxRandomRange(0, 360);

  const randomDrawMethods = [];
  // randomDrawMethods.push(randomArc);
  // randomDrawMethods.push(randomRect);
  randomDrawMethods.push(randomCircle);
  randomDrawMethods.push(randomThinArc);
  // randomDrawMethods.push(randomTriangles);




  // let hue1 = 0;
  // let hue2 = 340;

  // colorMode(HSB);
  // let color1 = color(hue1, 80, 80);
  // let color2 = color(hue2, 80, 80);
  // _draw.colorMode(HSB);

  // for (let i = 0; i < drawWidth; i++) {

  //   let ratio = float(i) / drawWidth;
  //   let _color = NYLerpColor(color1, color2, ratio);

  //   _draw.colorMode(HSB);
  //   _draw.noStroke();
  //   _draw.fill(_color);
  //   _draw.rect(i, 0, 1, 20);

  // }


  // random arc
  for (let i = 0; i < preFrameShapeCount; i++) {
    let methodIndex = floor(fxRandomRange(0, randomDrawMethods.length));
    randomDrawMethods[methodIndex]();

    await sleep(10);
  }

  // frame
  drawFrame(0, 30 * scale, 20);

  // random arcs
  for (let i = 0; i < postFrameShapeCount; i++) {
    let methodIndex = floor(fxRandomRange(0, randomDrawMethods.length));
    randomDrawMethods[methodIndex]();

    await sleep(10);
  }

  //await noiseBackground();
  await NYPaperTexture();
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

function randomArc() {
  let posX = fxRandomRange(0.1, 0.9) * drawWidth;
  let posY = fxRandomRange(0.1, 0.9) * drawHeight;

  let arcSize = fxRandomRange(0.01, 1.2) * drawWidth;
  let arcColorThickness = fxRandomRange(0.02, 0.4) * arcSize;

  let angleRange = 30;
  let rotateAngle = -45;

  NYArc(posX, posY, angleRange, rotateAngle, arcSize, arcColorThickness);
  NYArc(posX, posY, angleRange, rotateAngle + 180, arcSize, arcColorThickness);
}

function randomThinArc() {
  let posX = fxRandomRange() * drawWidth;
  let posY = fxRandomRange() * drawHeight;

  let arcSize = fxRandomRange(0.01, 0.6) * drawWidth;
  let arcColorThickness = fxRandomRange(0.02, 0.4) * arcSize;

  let angleRange = fxRandomRange(60, 200);
  let rotateAngle = fxRandomRange(0, 360);

  NYArc(posX, posY, angleRange, rotateAngle, arcSize, arcColorThickness);
  NYArc(posX, posY, angleRange, rotateAngle + 180, arcSize, arcColorThickness);
}

function NYArc(x, y, angleRange, rotateAngle, drawWidth, thickness) {

  let isSplit = fxRandomRange() < 0.7;
  if (isSplit && drawWidth > 10) {
    let padding = fxRandomRange(0.05, 0.4) * drawWidth;
    let newDrawWidth = drawWidth - thickness - padding;
    let newThickness = fxRandomRange(0.1, 0.8) * newDrawWidth;

    NYArc(x, y, angleRange, rotateAngle, newDrawWidth, newThickness);
  }
  let fromAngle = - 0.5 * angleRange;
  let toAngle = 0.5 * angleRange;

  let arcFrom = radians(fromAngle);
  let arcTo = radians(toAngle);

  colorMode(HSB);
  let inverted = fxRandomRange() < 0.2;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  let randomAddAmount = int(fxRandomRange(4, 12));
  let colorIndexAddAmount = 1;

  if (fxRandomRange() < 0.7)
    colorIndexAddAmount = randomAddAmount;

  _draw.push();

  _draw.translate(x, y);
  _draw.rotate(radians(rotateAngle));

  // draw stroke
  // stroke(0);
  // strokeWeight(1);
  // noFill();
  // let strokeDrawWidth = drawWidth;
  // for (let i = 0; i < strokeThickness; i += strokeIndexAddAmount) {
  //   arc(0, 0, strokeDrawWidth - i, strokeDrawWidth - i, arcFrom, arcTo, OPEN);
  // }

  // random black white
  let colorRandomValue = fxRandomRange();
  if (colorRandomValue < 0.1) {
    fromColor = color(0, 0, fxRandomRange(0, 30));
    toColor = color(0, 0, fxRandomRange(0, 30));
  }
  else if (colorRandomValue < 0.25) {
    fromColor = color(0, 0, fxRandomRange(0, 30));
    toColor = color(0, 0, fxRandomRange(0, 30));
  }

  // color thickness
  _draw.noFill();
  _draw.strokeWeight(1);
  for (let i = 0; i < thickness; i += colorIndexAddAmount) {

    let ratio = float(i) / thickness;
    let nowColor = NYLerpColor(fromColor, toColor, ratio);

    _draw.stroke(nowColor);
    _draw.arc(0, 0, drawWidth - i, drawWidth - i, arcFrom, arcTo, OPEN);
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

  let thickness = fxRandomRange(1, size * 0.4);
  let rotateAngle = 45;

  NYRect(posX, posY, size * ratioX, size * ratioY, thickness, rotateAngle);
}

function NYRect(x, y, rectWidth, rectHeight, thickness, rotation) {

  let isSplit = fxRandomRange() < 0.7;

  if (isSplit && min(rectWidth, rectHeight) > 10) {
    let newSize = fxRandomRange(0.4, 0.9) * rectWidth;
    let newThickness = fxRandomRange(0.8, 1.2) * thickness;

    NYRect(x, y, newSize, newSize, newThickness, rotation);
  }

  let inverted = fxRandomRange() < 0.1;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  // random black white
  if (fxRandomRange(0.0, 1.0) > 0.9) {
    fromColor = color(0, 0, fxRandomRange(0, 30));
    toColor = color(0, 0, fxRandomRange(0, 30));
  }
  else if (fxRandomRange(0.0, 1.0) > 0.75) {
    fromColor = color(0, 0, fxRandomRange(90, 100));
    toColor = color(0, 0, fxRandomRange(90, 100));
  }

  let spaceAdder = 1;

  if (fxRandomRange(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  _draw.strokeWeight(2);
  _draw.noFill();

  _draw.rectMode(CENTER);
  for (let i = 0; i < thickness; i += spaceAdder) {
    _draw.push();

    _draw.translate(x, y);
    _draw.rotate(rotation);
    let ratio = float(i) / thickness;
    _draw.stroke(NYLerpColor(fromColor, toColor, ratio));
    _draw.rect(0, 0, rectWidth - i, rectHeight - i);

    _draw.pop();
  }

}

function randomTriangles() {
  let isUp = fxRandomRange() >= 0.5;

  let posX = fxRandomRange(0.1, 0.9) * drawWidth;
  let posY = fxRandomRange(0.1, 0.9) * drawHeight;

  let size = fxRandomRange(0.4, 0.6) * drawWidth;
  let upRatio = 1;

  let sizeChance = fxRandomRange(0.0, 1.0);

  if (sizeChance > 0.9)
    size = fxRandomRange(0.4, 0.6) * drawWidth;
  else if (sizeChance > 0.5)
    size = fxRandomRange(0.12, 0.24) * drawWidth;
  else
    size = fxRandomRange(0.01, 0.1) * drawWidth;

  let thickness = fxRandomRange(1, size * 0.4);
  let rotateAngle = -20 + int(fxRandomRange(0, 3)) * 180;

  if (isUp) {
    posY = fxRandomRange(0.1, 0.6) * drawHeight;
    rotateAngle = 0;
  }
  else {
    posY = fxRandomRange(0.6, 0.9) * drawHeight;
    rotateAngle = 180;
  }

  NYTriangle(posX, posY, size, upRatio, thickness, rotateAngle);
}

function NYTriangle(x, y, edgeLength, upRatio, thickness, rotateAngle) {
  let split = fxRandomRange(0.0, 1.0) < 0.7;

  if (split && edgeLength > 10) {
    let padding = fxRandomRange(0.0, 0.1) * edgeLength;
    let innerTriangleEdgeLength = edgeLength - padding - thickness;

    let newThickness = fxRandomRange(0.2, 1.0) * innerTriangleEdgeLength;
    let newRotation = rotateAngle;

    NYTriangle(x, y, innerTriangleEdgeLength, upRatio, newThickness, newRotation);
  }

  let inverted = fxRandomRange() < 0.2;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  if (fxRandomRange(0.0, 1.0) > 0.9) {
    fromColor = color(0, 0, fxRandomRange(0, 30));
    toColor = color(0, 0, fxRandomRange(0, 30));
  }
  else if (fxRandomRange(0.0, 1.0) > 0.75) {
    fromColor = color(0, 0, fxRandomRange(90, 100));
    toColor = color(0, 0, fxRandomRange(90, 100));
  }

  let spaceAdder = 1;

  if (fxRandomRange(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  _draw.strokeWeight(2);
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

  let thickness = fxRandomRange(1, size * 0.7);

  NYCircle(posX, posY, size, thickness);
}

function NYCircle(x, y, drawWidth, thickness) {

  let split = fxRandomRange(0.0, 1.0) > 0.3;

  if (split && drawWidth > 10) {
    let padding = fxRandomRange(0.0, 0.1) * drawWidth;
    let innerCircleWidth = drawWidth - padding - thickness;

    NYCircle(x, y, innerCircleWidth, fxRandomRange(1, min(100, innerCircleWidth)));
  }

  let inverted = fxRandomRange() < 0.2;
  let fromColor = NYRandomColor(inverted);
  let toColor = NYRandomColor(inverted);

  if (fxRandomRange(0.0, 1.0) > 0.9) {
    fromColor = color(0, 0, fxRandomRange(0, 30));
    toColor = color(0, 0, fxRandomRange(0, 30));
  }
  else if (fxRandomRange(0.0, 1.0) > 0.75) {
    fromColor = color(0, 0, fxRandomRange(90, 100));
    toColor = color(0, 0, fxRandomRange(90, 100));
  }

  let spaceAdder = 1;

  if (fxRandomRange(0.0, 1.0) < 0.6)
    spaceAdder = 12;

  _draw.strokeWeight(2);
  _draw.noFill();

  for (let i = 0; i < thickness; i += spaceAdder) {
    let ratio = float(i) / thickness;
    _draw.stroke(NYLerpColor(fromColor, toColor, ratio));
    _draw.circle(x, y, drawWidth - i);
  }
}

function randomLines(pointNum) {
  let startPointX = fxRandomRange(drawWidth * 0.1, drawWidth * 0.9);
  let startPointY = fxRandomRange(drawHeight * 0.1, drawHeight * 0.9);

  let points = [];
  points[0] = new NYPoint(startPointX, startPointY);

  // push point data
  for (let i = 0; i < pointNum; i++) {
    let newPoint = new NYPoint();
    newPoint.randomFromPoint(points[i], drawWidth * fxRandomRange(0.1, 0.6));
    points.push(newPoint);
  }

  stroke(0);
  // strokeWeight(random(1, 0));
  strokeWeight(10);
  strokeCap(SQUARE);
  noFill();

  let spaceAdder = 1;
  if (fxRandomRange(0.0, 1.0) > 0.5)
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
    this.x = point.x + fxRandomRange(-0.5 * range, 0.5 * range);
    this.y = point.y + fxRandomRange(-0.5 * range, 0.5 * range);
  }
}

async function noiseBackground() {
  colorMode(HSB);

  let bgHue = baseHue + fxRandomRange(-randomHueRange, randomHueRange);

  let fromColor = color(10, 60, 90);
  bgHue += fxRandomRange(20, 40);

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
  for (let x = 0; x < drawWidth; x++) {
    for (let y = 0; y < drawHeight; y++) {
      let nx = bgNoiseX + bgNoiseScale * x;
      let ny = bgNoiseY + bgNoiseScale * y;

      let noiseValue = noise(nx, ny);
      let newColor = NYLerpColor(fromColor, toColor, noiseValue);

      _draw.stroke(newColor);
      point(x, y);
    }
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

  let newColor = color(newHue, fxRandomRange(40, 80), fxRandomRange(60, 90));

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

  if(newHue > 360)
    newHue -= 360;
  else if(newHue < 0)
    newHue += 360;

  return color(newHue, newSat, newBright);

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