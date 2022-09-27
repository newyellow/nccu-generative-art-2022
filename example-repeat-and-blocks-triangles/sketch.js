
// traits
let isLandscape = false;
let isDarkPaper = false;
let scaler = 0.5;
let longSide = 4000;
let isPaperLandscape = false;
let colorType = 0;
let friendlyColorDirection = 1;
let gridW = 0;
let gridH = 0;
// traits

let mainCanvas;
let canvasWidth = 0;
let canvasHeight = 0;

// paper setting
let SETTING_NO_TEXTURE = false;

let drawFinished = false;

let rectSplitChance = 0.85;
let triangleSplitChance = 0.9;
let splitMinWidth = 30;
let minDrawLength = 10;
let triangleChance = 0.0;


let baseHue = 0.0;
let hueRandomness = 30.0;
let baseSat = 30.0;
let baseLightness = 0.0;

let paperHue = 0.0;
let paperColor;
let paperTextureRandomness = 0.0;
let paperLightness = 0;

let lineColorNoiseMap;

async function setup() {
  SetupFeatures();

  console.log("P5 SETUP!!");

  noiseSeed(int(fxrand() * 10000));
  drawFinished = false;
  splitMinWidth = 40 * scaler;
  minDrawLength = 3 * scaler;

  // setup canvas
  createCanvas(windowWidth, windowHeight);

  longSide = 4000 * scaler;

  if (isLandscape) {
    canvasWidth = longSide;
    canvasHeight = longSide * 0.75;
  }
  else {
    canvasWidth = longSide * 0.75;
    canvasHeight = longSide;
  }

  console.log(`rendering: ${canvasWidth} x ${canvasHeight}`);
  mainCanvas = createGraphics(canvasWidth, canvasHeight);


  // setup lines color
  baseSat = fxRandom(40, 80);

  if (isDarkPaper)
    baseLightness = fxRandom(50, 90);
  else
    baseLightness = fxRandom(20, 60)

  console.log(`hue:${baseHue}`);
  console.log(`sat:${baseSat} bright:${baseLightness}`);

  lineColorNoiseMap = new NYNoiseMap(0.02, 0.02);

  colorMode(HSB);

  if (isDarkPaper)
    paperLightness = 20;
  else
    paperLightness = 90;


  paperColor = color(paperHue, 0, paperLightness);
  mainCanvas.background(paperColor);



  splitChance = 0.3;
  await NYRandomTextureLines();
  await startDraw();


  drawFinished = true;
  console.log('drawFinished!');
  if (isFxpreview) {
    fxpreview();
  }
  noLoop();
}

async function startDraw() {
  let blockWCount = gridW;
  let blockHCount = gridH;

  console.log("amount: " + blockWCount + "," + blockHCount);

  let padding = 100 * scaler;

  let blockWidth = (canvasWidth - padding * 2) / blockWCount
  let blockHeight = (canvasHeight - padding * 2) / blockHCount;

  for (let x = 0; x < blockWCount; x++) {
    for (let y = 0; y < blockHCount; y++) {
      let posX = blockWidth * x + padding;
      let posY = blockHeight * y + padding;

      await NYRect(posX, posY, blockWidth, blockHeight, true); // force first level go split
    }
  }
}

async function NYRect(drawX, drawY, drawWidth, drawHeight, forceSplit = false) {
  let minLength = splitMinWidth;
  let isSplit = fxrand() <= rectSplitChance;

  if (forceSplit)
    isSplit = true;

  if (drawWidth < minLength || drawHeight < minLength) {
    isSplit = false;
  }

  if (isSplit) // split
  {
    let isTriangle = fxrand() < triangleChance;
    let horizontal = fxrand() < 0.5;
    let ratio = fxRandom(0.1, 0.9);

    if (isTriangle) {
      let leftUpRightBotSlice = fxrand() <= 0.5;

      if (leftUpRightBotSlice) {
        await NYTriangle(drawX, drawY, drawWidth, drawHeight, 0);
        await NYTriangle(drawX, drawY, drawWidth, drawHeight, 2);
      }
      else {
        await NYTriangle(drawX, drawY, drawWidth, drawHeight, 1);
        await NYTriangle(drawX, drawY, drawWidth, drawHeight, 3);
      }
    }
    else {
      if (horizontal) {
        await NYRect(drawX, drawY, drawWidth * ratio, drawHeight);
        await NYRect(drawX + drawWidth * ratio, drawY, drawWidth * (1.0 - ratio), drawHeight);
      }
      else {
        await NYRect(drawX, drawY, drawWidth, drawHeight * ratio);
        await NYRect(drawX, drawY + drawHeight * ratio, drawWidth, drawHeight * (1.0 - ratio));
      }
    }
  }
  else {
    blendMode(BLEND);
    colorMode(HSB);

    let linesCount = int(fxRandom(2, 30));

    let isHorizontal = fxrand() > 0.5;
    let lineSpace = 0.0;

    let _color = NYRandomColor();

    if (isHorizontal) {
      lineSpace = drawWidth / linesCount;

      for (let x = 0; x <= linesCount; x++) {
        let posX = drawX + lineSpace * x;

        noStroke();
        NYLine(posX, drawY, posX, drawY + drawHeight, _color);
      }
    }
    else {
      lineSpace = drawHeight / linesCount;
      for (let y = 0; y <= linesCount; y++) {
        let posY = drawY + lineSpace * y;

        noStroke();
        NYLine(drawX, posY, drawX + drawWidth, posY, _color);
      }
    }

    await sleep(1);
  }
}

async function NYTriangle(drawX, drawY, drawWidth, drawHeight, triangleType) {
  let minLength = splitMinWidth;
  let isSplit = fxRandom(0.0, 1.0) <= triangleSplitChance;

  if (drawWidth < minLength || drawHeight < minLength)
    isSplit = false;

  if (isSplit) // split
  {
    let ratio = fxRandom(0.1, 0.9);
    let newX = drawX;
    let newY = drawY;
    let newWidth = 10 * scaler;
    let newHeight = 10 * scaler;

    if (triangleType == 0) {
      newX = drawX + drawWidth * ratio;
      newY = drawY + drawHeight * ratio;
      newWidth = (1.0 - ratio) * drawWidth;
      newHeight = ratio * drawHeight;

      await NYRect(newX, drawY, newWidth, newHeight);
      await NYTriangle(drawX, drawY, drawWidth * ratio, drawHeight * ratio, 0);
      await NYTriangle(newX, newY, drawWidth * (1.0 - ratio), drawHeight * (1.0 - ratio), 0);
    }
    else if (triangleType == 1) {
      newX = drawX + drawWidth * ratio;
      newY = drawY + drawHeight * (1.0 - ratio);
      newWidth = drawWidth * (1.0 - ratio);
      newHeight = drawHeight * ratio;


      await NYTriangle(newX, drawY, newWidth, drawHeight - newHeight, 1);
      await NYTriangle(drawX, newY, drawWidth - newWidth, newHeight, 1);
      await NYRect(newX, newY, newWidth, newHeight);
    }
    else if (triangleType == 2) {
      newX = drawX + drawWidth * ratio;
      newY = drawY + drawHeight * ratio;
      newWidth = drawWidth * ratio;
      newHeight = drawHeight * (1.0 - ratio);

      await NYTriangle(drawX, drawY, newWidth, drawHeight * ratio, 2);
      await NYTriangle(newX, newY, drawWidth - newWidth, newHeight, 2);
      await NYRect(drawX, newY, newWidth, newHeight);
    }
    else if (triangleType == 3) {
      newX = drawX + drawWidth * ratio;
      newY = drawY + drawHeight * (1.0 - ratio);
      newWidth = drawWidth * ratio;
      newHeight = drawHeight * (1.0 - ratio);

      await NYTriangle(newX, drawY, drawWidth - newWidth, newHeight, 3);
      await NYTriangle(drawX, newY, newWidth, drawHeight - newHeight, 3);
      await NYRect(drawX, drawY, newWidth, newHeight);
    }
  }
  else {

    blendMode(BLEND);
    colorMode(HSB);

    let linesCount = int(fxRandom(2, 30));
    let isHorizontal = fxRandom(0.0, 1.0) > 0.5;
    let lineSpace = 0.0;

    let _color = NYRandomColor();

    if (isHorizontal) {
      lineSpace = drawWidth / linesCount;

      for (let x = 0; x <= linesCount; x++) {
        let ratio = float(x) / linesCount;
        let startY = drawY;
        let endY = drawY;

        let posX = drawX + lineSpace * x;

        if (triangleType == 0) {
          startY = drawY;
          endY = drawY + max(ratio * drawHeight, minDrawLength);
        }
        else if (triangleType == 1) {
          endY = drawY + drawHeight;
          startY = endY - max(ratio * drawHeight, minDrawLength);
        }
        else if (triangleType == 2) {
          startY = drawY + ratio * drawHeight;
          endY = drawY + drawHeight;

          if ((endY - startY) < minDrawLength)
            startY = endY - minDrawLength;
        }
        else if (triangleType == 3) {
          startY = drawY;
          endY = drawY + max((1.0 - ratio) * drawHeight, minDrawLength);
        }

        NYLine(posX, startY, posX, endY, _color);
      }
    }
    else {
      lineSpace = drawHeight / linesCount;
      for (let y = 0; y <= linesCount; y++) {
        let posY = drawY + lineSpace * y;

        let ratio = float(y) / linesCount;
        let startX = drawX;
        let endX = drawX;

        if (triangleType == 0) {
          startX = drawX + ratio * drawWidth;
          endX = drawX + drawWidth;

          if (endX - startX < minDrawLength)
            startX = endX - minDrawLength;
        }
        else if (triangleType == 1) {
          endX = drawX + drawWidth;
          startX = endX - max((ratio * drawWidth), minDrawLength);
        }
        else if (triangleType == 2) {
          startX = drawX;
          endX = drawX + max((ratio * drawWidth), minDrawLength);
        }
        else if (triangleType == 3) {
          startX = drawX;
          endX = drawX + max((1.0 - ratio) * drawWidth, minDrawLength);
        }

        NYLine(startX, posY, endX, posY, _color);
      }
    }

    await sleep(1);
  }
}

function NYLine(p1x, p1y, p2x, p2y, targetColor) {
  mainCanvas.colorMode(HSB);
  mainCanvas.blendMode(BLEND);
  mainCanvas.noStroke();
  colorMode(HSB);
  let _hue = hue(targetColor);
  let _sat = saturation(targetColor);
  let _bright = brightness(targetColor);

  let dotWidth = 24 * scaler;

  let noiseXstart = fxRandom(-1000, 1000);
  let noiseYstart = fxRandom(-1000, 1000);
  let noiseScale = 0.05;


  let distance = dist(p1x, p1y, p2x, p2y);
  let dotCount = distance / (dotWidth * 0.3);

  rectMode(CENTER);

  for (let i = 0; i <= dotCount; i++) {
    let t = float(i) / float(dotCount);
    let drawX = lerp(p1x, p2x, t);
    let drawY = lerp(p1y, p2y, t);

    let noiseValue = noise(noiseXstart + drawX * noiseScale, noiseYstart + drawY * noiseScale);
    let drawWidth = dotWidth * (0.1 + noiseValue * 0.5);

    targetColor.setAlpha(0.66);
    mainCanvas.fill(targetColor);
    mainCanvas.circle(drawX, drawY, drawWidth, drawWidth);
  }
}

async function NYRandomTextureLines() {

  let xLines = 200;
  let yLines = 300;

  let noiseScaleX = 0.002;
  let noiseScaleY = 0.011;

  if (isLandscape) {
    xLines = 300;
    yLines = 200;
    noiseScaleX = 0.011;
    noiseScaleY = 0.002;
  }

  let noiseMap = new NYNoiseMap(noiseScaleX, noiseScaleY);
  let colorNoiseMap = new NYNoiseMap(noiseScaleX, noiseScaleY);

  let xSpace = float(canvasWidth) / float(xLines);
  let ySpace = float(canvasHeight) / float(yLines);

  mainCanvas.colorMode(HSB);
  mainCanvas.blendMode(MULTIPLY);
  colorMode(HSB);

  let lineColor = color('white');

  if (isDarkPaper)
    lineColor = color(0, 0, 0);
  else
    lineColor = color(0, 0, 30);

  if (SETTING_NO_TEXTURE)
    return;

  mainCanvas.stroke(lineColor);
  mainCanvas.strokeWeight(6 * scaler);

  let lineAlpha = 0.1;

  if (isDarkPaper)
    lineAlpha = 0.2;

  if (isPaperLandscape == false) {
    for (let x = 0; x < xLines; x++) {
      let lineX = (0.5 + x) * xSpace;

      for (let i = 0; i <= canvasHeight; i++) {
        let pointY = i;
        let pointX = lineX + (noiseMap.getNoise(x / scaler, i / scaler) - 0.5) * xSpace;

        if (random() < 0.4)
          continue;

        lineColor.setAlpha(colorNoiseMap.getNoise(x / scaler, i / scaler) * lineAlpha * random());
        mainCanvas.stroke(lineColor);
        mainCanvas.point(pointX, pointY);
      }

      if (x % 3 == 0)
        await sleep(1);
    }
  }
  else {
    for (let y = 0; y < yLines; y++) {
      let lineY = (0.5 + y) * ySpace;

      for (let i = 0; i <= canvasWidth; i++) {
        let pointX = i;
        let pointY = lineY + (noiseMap.getNoise(i / scaler, y / scaler) - 0.5) * ySpace;

        if (random() < 0.4)
          continue;

        lineColor.setAlpha(colorNoiseMap.getNoise(i / scaler, y / scaler) * 0.1 * random());
        mainCanvas.stroke(lineColor);
        mainCanvas.point(pointX, pointY);
      }

      if (y % 3 == 0)
        await sleep(1);
    }
  }
}

function NYRandomColor() {
  colorMode(HSB);

  let currentHue = baseHue + fxRandom(-hueRandomness, hueRandomness);
  let currentSat = baseSat + fxRandom(-20, 20);
  let currentBright = baseLightness + fxRandom(-20, 20);

  if (colorType > 0) {
    let hueDifferenceChance = fxrand();

    if (hueDifferenceChance < 0.2) {

      if (colorType == 1)
        currentHue += 60.0 * friendlyColorDirection;
      else if (colorType == 2)
        currentHue += 180.0;
    }
  }

  if (currentHue > 360.0)
    currentHue -= 360.0;

  if (colorType == 3) // mono
  {
    currentSat = 0.0;
    currentBright = fxRandom(0, 100);
  }

  let _color = color(currentHue, currentSat, currentBright);
  let specialColorChance = fxrand();

  if (fxrand() < 0.1)
    _color = color('white');


  _color.setAlpha(0.8);

  return _color;
}

class NYNoiseMap {
  constructor(scaleX, scaleY) {
    this.mapX = fxRandom(-10000.0, 10000.0);
    this.mapY = fxRandom(-10000.0, 10000.0);
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

function draw() {
  if (mainCanvas != null) {

    blendMode(BLEND);

    let drawRatio = width / height;
    let canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = width;
    let drawHeight = height;
    let xPadding = 0;
    let yPadding = 0;

    if (isLandscape) {
      drawWidth = width;
      drawHeight = width * 0.75;

      xPadding = 0;
      yPadding = (height - drawHeight) / 2;

      if (drawHeight > height) {
        drawWidth = height / 0.75;
        drawHeight = height;

        xPadding = (width - drawWidth) / 2;
        yPadding = 0.0;
      }
    }
    else {
      drawWidth = height * 0.75;
      drawHeight = height;

      xPadding = (width - drawWidth) / 2;
      yPadding = 0.0;

      if (drawWidth > width) {
        drawWidth = width;
        drawHeight = width / 0.75;

        xPadding = 0.0;
        yPadding = (height - drawHeight) / 2;
      }
    }

    background(10);
    image(mainCanvas, xPadding, yPadding, drawWidth, drawHeight);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fxRandom(fromValue, toValue) {
  return fromValue + fxrand() * (toValue - fromValue);
}

function keyPressed(e) {
  let key = e.key;

  if (key == 's' || key == 'S') {
    let fileName = 'recursive and blocks-' + fxhash + '.png';
    save(mainCanvas, fileName);
  }
  else {
    if (drawFinished) {
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
      else if (key == 't' || key == 'T') {
        SETTING_NO_TEXTURE = !SETTING_NO_TEXTURE;
        doRedraw(scaler * 2);
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
  drawFinished = false;
  loop();

  setup();
}