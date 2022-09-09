
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
  createCanvas(2000, 2000);
  background(0);

  // setup lines color
  baseHue = random(0, 360);
  baseSat = random(30, 70);
  hueRandomness = random(10, 60);
  baseLightness = random(30, 80);

  // setup paper color
  isDarkPaper = random(0.0, 1.0) > 0.7;
  paperHue = random(0, 360);
  paperTextureRandomness = random(6, 20);

  colorMode(HSB);

  if (isDarkPaper)
    paperLightness = 20;
  else
    paperLightness = 90;


  paperColor = color(paperHue, 3, paperLightness);
  background(paperColor);
  // generateTexture();

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

      NYRect(posX, posY, blockWidth, blockHeight);
    }
  }
}

function NYRect(drawX, drawY, drawWidth, drawHeight) {
  let minLength = 30;
  let splitChance = 0.8;

  if(drawWidth < minLength || drawHeight < minLength)
    splitChance = -1.0;

  if (random(0.0, 1.0) <= splitChance) // split
  {
    let horizontal = random(0.0, 1.0) > 0.5;
    let ratio = random(0.1, 0.9);

    if (horizontal) {
      NYRect(drawX, drawY, drawWidth * ratio, drawHeight);
      NYRect(drawX + drawWidth * ratio, drawY, drawWidth * (1.0 - ratio), drawHeight);
    }
    else {
      NYRect(drawX, drawY, drawWidth, drawHeight * ratio);
      NYRect(drawX, drawY + drawHeight * ratio, drawWidth, drawHeight * (1.0 - ratio));
    }
  }
  else {

    blendMode(BLEND);
    colorMode(HSB);
    let currentHue = baseHue + random(-hueRandomness, hueRandomness);
    if (currentHue > 360) currentHue -= 360;
    let _color = color(currentHue, baseSat, baseLightness);
    _color.setAlpha(0.8);

    if (random(0.0, 1.0) < 0.1)
      _color = color('white');

    let linesCount = random(3, 30);
    let isHorizontal = random(0.0, 1.0) > 0.5;
    let lineSpace = 0.0;

    if (isHorizontal) {
      lineSpace = drawWidth / linesCount;

      for (let x = 0; x < linesCount; x++) {
        let posX = drawX + lineSpace * x;

        noStroke();
        fill(_color);
        NYLine(posX, drawY, posX, drawY + drawHeight);
      }
    }
    else {
      lineSpace = drawHeight / linesCount;
      for (let y = 0; y < linesCount; y++) {
        let posY = drawY + lineSpace * y;

        noStroke();
        fill(_color);
        NYLine(drawX, posY, drawX + drawWidth, posY);
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

function draw() {

}
