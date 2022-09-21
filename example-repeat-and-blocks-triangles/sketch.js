
let rectSplitChance = 0.9;
let triangleSplitChance = 0.9;
let splitMinWidth = 30;
let triangleChance = 0.1;


let baseHue = 0.0;
let hueRandomness = 0.0;
let baseSat = 0.0;
let baseLightness = 0.0;

let isDarkPaper = false;
let paperHue = 0.0;
let paperColor;
let paperTextureRandomness = 0.0;
let paperLightness = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // setup lines color
  baseHue = random(0, 360);
  baseSat = random(30, 100);
  hueRandomness = random(20, 60);
  baseLightness = random(30, 80);
  console.log(`hue:${baseHue}`);
  console.log(`sat:${baseSat} bright:${baseLightness}`);

  // setup paper color
  isDarkPaper = random(0.0, 1.0) > 0.7;
  paperHue = int(baseHue + 60) % 360;
  paperTextureRandomness = random(6, 20);

  colorMode(HSB);

  if (isDarkPaper)
    paperLightness = 20;
  else
    paperLightness = 90;


  paperColor = color(paperHue, 12, paperLightness);
  background(paperColor);


  splitChance = 0.3;
  startDraw();

  NYPaperTexture();
  filter(DILATE);
}

function startDraw() {
  let blockWCount = int(random(1, 4));
  let blockHCount = int(random(1, 4));

  console.log("amount: " + blockWCount + "," + blockHCount);

  let padding = 100;

  let blockWidth = (width - padding * 2) / blockWCount
  let blockHeight = (height - padding * 2) / blockHCount;

  for (let x = 0; x < blockWCount; x++) {
    for (let y = 0; y < blockHCount; y++) {
      let posX = blockWidth * x + padding;
      let posY = blockHeight * y + padding;

      NYRect(posX, posY, blockWidth, blockHeight, true); // force first level go split
    }
  }
}

function NYRect(drawX, drawY, drawWidth, drawHeight, forceSplit = false) {
  let minLength = splitMinWidth;
  let isSplit = random() <= rectSplitChance;

  if (forceSplit)
    isSplit = true;

  if (drawWidth < minLength || drawHeight < minLength)
    isSplit = false;

  if (isSplit) // split
  {
    let isTriangle = random() < triangleChance;
    let horizontal = random() < 0.5;
    let ratio = random(0.1, 0.9);

    if (isTriangle) {
      let leftUpRightBotSlice = random() < 1.0;

      if (leftUpRightBotSlice) {
        NYTriangle(drawX, drawY, drawWidth, drawHeight, 0);
        NYTriangle(drawX, drawY, drawWidth, drawHeight, 2);
      }
      else {
        NYTriangle(drawX, drawY, drawWidth, drawHeight, 1);
        NYTriangle(drawX, drawY, drawWidth, drawHeight, 3);
      }
    }
    else {
      if (horizontal) {
        NYRect(drawX, drawY, drawWidth * ratio, drawHeight);
        NYRect(drawX + drawWidth * ratio, drawY, drawWidth * (1.0 - ratio), drawHeight);
      }
      else {
        NYRect(drawX, drawY, drawWidth, drawHeight * ratio);
        NYRect(drawX, drawY + drawHeight * ratio, drawWidth, drawHeight * (1.0 - ratio));
      }
    }
  }
  else {

    blendMode(BLEND);
    colorMode(HSB);

    let linesCount = int(random(2, 30));
    let isHorizontal = random(0.0, 1.0) > 0.5;
    let lineSpace = 0.0;

    let _color = NYRandomColor();

    if (isHorizontal) {
      lineSpace = drawWidth / linesCount;

      for (let x = 0; x <= linesCount; x++) {
        let posX = drawX + lineSpace * x;

        noStroke();
        fill(_color);
        NYLine(posX, drawY, posX, drawY + drawHeight);
      }
    }
    else {
      lineSpace = drawHeight / linesCount;
      for (let y = 0; y <= linesCount; y++) {
        let posY = drawY + lineSpace * y;

        noStroke();
        fill(_color);
        NYLine(drawX, posY, drawX + drawWidth, posY);
      }
    }
  }
}

function NYTriangle(drawX, drawY, drawWidth, drawHeight, triangleType) {
  let minLength = splitMinWidth;
  let isSplit = random(0.0, 1.0) <= triangleSplitChance;

  // if(forceSplit)
  //   isSplit = true;

  if (drawWidth < minLength || drawHeight < minLength)
    isSplit = false;

  if (isSplit) // split
  {
    let ratio = random(0.1, 0.9);
    let newX = drawX;
    let newY = drawY;
    let newWidth = 10;
    let newHeight = 10;

    if (triangleType == 0) {
      newX = drawX + drawWidth * ratio;
      newY = drawY + drawHeight * ratio;
      newWidth = (1.0 - ratio) * drawWidth;
      newHeight = ratio * drawHeight;

      NYRect(newX, drawY, newWidth, newHeight);
      NYTriangle(drawX, drawY, drawWidth * ratio, drawHeight * ratio, 0);
      NYTriangle(newX, newY, drawWidth * (1.0 - ratio), drawHeight * (1.0 - ratio), 0);
    }
    else if (triangleType == 1) {
      newX = drawX + drawWidth * ratio;
      newY = drawY + drawHeight * (1.0 - ratio);
      newWidth = drawWidth * (1.0 - ratio);
      newHeight = drawHeight * ratio;


      NYTriangle(newX, drawY, newWidth, drawHeight - newHeight, 1);
      NYTriangle(drawX, newY, drawWidth - newWidth, newHeight, 1);
      NYRect(newX, newY, newWidth, newHeight);
    }
    else if (triangleType == 2) {
      newX = drawX + drawWidth * ratio;
      newY = drawY + drawHeight * ratio;
      newWidth = drawWidth * ratio;
      newHeight = drawHeight * (1.0 - ratio);

      NYTriangle(drawX, drawY, newWidth, drawHeight * ratio, 2);
      NYTriangle(newX, newY, drawWidth - newWidth, newHeight, 2);
      NYRect(drawX, newY, newWidth, newHeight);
    }
    else if (triangleType == 3) {
      newX = drawX + drawWidth * ratio;
      newY = drawY + drawHeight * (1.0 - ratio);
      newWidth = drawWidth * ratio;
      newHeight = drawHeight * (1.0 - ratio);

      NYTriangle(newX, drawY, drawWidth - newWidth, newHeight, 3);
      NYTriangle(drawX, newY, newWidth, drawHeight - newHeight, 3);
      NYRect(drawX, drawY, newWidth, newHeight);
    }


    // if (horizontal) {
    //   NYRect(drawX, drawY, drawWidth * ratio, drawHeight);
    //   NYRect(drawX + drawWidth * ratio, drawY, drawWidth * (1.0 - ratio), drawHeight);
    // }
    // else {
    //   NYRect(drawX, drawY, drawWidth, drawHeight * ratio);
    //   NYRect(drawX, drawY + drawHeight * ratio, drawWidth, drawHeight * (1.0 - ratio));
    // }
  }
  else {

    blendMode(BLEND);
    colorMode(HSB);

    let linesCount = int(random(2, 30));
    let isHorizontal = random(0.0, 1.0) > 0.5;
    let lineSpace = 0.0;

    let _color = NYRandomColor();

    if (isHorizontal) {
      lineSpace = drawWidth / linesCount;

      for (let x = 0; x <= linesCount; x++) {
        let ratio = float(x) / linesCount;
        let startY = drawY;
        let endY = drawY;

        let posX = drawX + lineSpace * x;

        fill(_color);
        if (triangleType == 0) {
          startY = drawY;
          endY = drawY + max(ratio * drawHeight, 10);
        }
        else if (triangleType == 1) {
          endY = drawY + drawHeight;
          startY = endY - max(ratio * drawHeight, 10);
        }
        else if (triangleType == 2) {
          startY = drawY + ratio * drawHeight;
          endY = drawY + drawHeight;

          if ((endY - startY) < 10)
            startY = endY - 10;
        }
        else if (triangleType == 3) {
          startY = drawY;
          endY = drawY + max((1.0 - ratio) * drawHeight, 10);
        }

        noStroke();
        fill(_color);
        NYLine(posX, startY, posX, endY);
      }
    }
    else {
      lineSpace = drawHeight / linesCount;
      for (let y = 0; y <= linesCount; y++) {
        let posY = drawY + lineSpace * y;

        let ratio = float(y) / linesCount;
        let startX = drawX;
        let endX = drawX;

        fill(_color);
        if (triangleType == 0) {
          startX = drawX + ratio * drawWidth;
          endX = drawX + drawWidth;

          if (endX - startX < 10)
            startX = endX - 10;
        }
        else if (triangleType == 1) {
          endX = drawX + drawWidth;
          startX = endX - max((ratio * drawWidth), 10);
        }
        else if (triangleType == 2) {
          startX = drawX;
          endX = drawX + max((ratio * drawWidth), 10);
        }
        else if (triangleType == 3) {
          startX = drawX;
          endX = drawX + max((1.0 - ratio) * drawWidth, 10);
        }

        noStroke();
        fill(_color);
        NYLine(startX, posY, endX, posY);
      }
    }
  }
}

function NYLine(p1x, p1y, p2x, p2y, dotWidth = 20) {

  let noiseXstart = random(-1000, 1000);
  let noiseYstart = random(-1000, 1000);
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
    //circle(drawX, drawY, dotWidth * (0.1 + noiseValue * 0.5));
    circle(drawX, drawY, drawWidth, drawWidth);
  }
}

function generateTexture() {
  if (isDarkPaper)
    blendMode(ADD);
  else
    blendMode(MULTIPLY);

  let dotWidth = random(6, 12);
  for (let x = 0; x < width / 4; x++) {
    for (let y = 0; y < height / 4; y++) {
      noStroke();
      ellipseMode(CENTER);
      fill(paperHue + random(5), 6, paperLightness + noise(x / 100.0, y / 100.0) * paperTextureRandomness, 0.6);
      circle(x * 4, y * 4, dotWidth);
    }
  }
}


async function NYPaperTexture() {
  let paperNoiseX = random(-1000.0, 1000.0);
  let paperNoiseY = random(-1000.0, 1000.0);
  let paperXScale = 0.06;
  let paperYScale = 2;

  let counter = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let nx = paperNoiseX + paperXScale * x;
      let ny = paperNoiseY + paperYScale * y;

      let noiseValue = noise(nx, ny);
      let colorValue = 0.0;
      let alphaValue = 10;

      if (noiseValue > 0.46 && noiseValue < 0.50) {
        colorValue = 0;
        alphaValue = 30;
      }
      else {
        alphaValue = 10;
        if (noiseValue < 0.5)
          colorValue = map(noiseValue, 0.0, 0.5, 120, 30);
        else
          colorValue = map(noiseValue, 0.5, 1.0, 255, 120);
      }
      colorMode(RGB);
      stroke(colorValue, alphaValue);
      point(x, y);

      if ((counter++ % 10000) == 0) {
        await sleep(100);
      }
    }
  }
}

function NYRandomColor() {
  colorMode(HSB);

  let currentHue = baseHue + random(-hueRandomness, hueRandomness);

  let hueDifferenceChance = random();

  if (hueDifferenceChance < 0.2)
    currentHue += 180.0;

  if (currentHue > 360.0)
    currentHue -= 360.0;

  let _color = color(currentHue, baseSat, baseLightness);

  if (random() < 0.1)
    _color = color('white');


  _color.setAlpha(0.8);

  return _color;
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
