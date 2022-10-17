
let baseHue = 0;

async function setup() {
  createCanvas(800, 1200);
  background(30);


  let mountainCount = floor(random(3, 20));
  let mountainHeight = height / mountainCount;

  baseHue = random(0, 360);
  for (let i = -2; i < mountainCount; i++) {
    drawMountain(i * mountainHeight, mountainHeight * 0.8);
    await sleep(10);
  }

}

function drawMountain(_y, _height) {
  let noiseY = random(-1000, 1000);
  let noiseScale = random(0.003, 0.012);

  let fromHue = baseHue + random(-30, 30);
  if (fromHue < 0)
    fromHue += 360;
  else if (fromHue > 360)
    fromHue -= 360;

  let toHue = baseHue + random(-30, 30);
  if (toHue < 0)
    toHue += 360;
  else if (toHue > 360)
    toHue -= 360;

  colorMode(HSB);
  let fromColor = color(fromHue, random(30, 80), random(60, 100));
  let toColor = color(toHue, random(30, 80), random(60, 100));

  for (let x = 0; x < width; x++) {
    let x1 = x;
    let y1 = _y + noise(x * noiseScale, noiseY) * _height;

    let x2 = x1;
    let y2 = y1 + _height;

    strokeWeight(2);

    if (x % 4 == 0)
      gradientLine(x1, y1, x2, y2, fromColor, toColor);

    noFill();
    strokeWeight(4);
    stroke('white');
    point(x1, y1);
  }
}

function gradientLine(_x1, _y1, _x2, _y2, fromColor, toColor) {
  let points = dist(_x1, _y1, _x2, _y2);

  for (let i = 0; i < points; i++) {
    let ratio = i / points;
    let _color = lerpColor(fromColor, toColor, ratio);

    stroke(_color);
    let drawX = lerp(_x1, _x2, ratio);
    let drawY = lerp(_y1, _y2, ratio);

    if (random() > ratio)
      point(drawX, drawY);
  }
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}