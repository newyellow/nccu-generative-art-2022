
let mountainNoise;
let strokeNoise;
let strokeRotNoise;
let fogNoise;
let dotFogNoise;

let baseHue = 0.0;
let mountainColor;
let mountainStrokeColor;


async function setup() {
  // createCanvas(800, 1200);
  createCanvas(windowWidth, windowHeight);
  background(100);

  // mountainNoise = new NYNoise(0.01, 0.008);
  mountainNoise = new NYNoise(0.003, 0.006);

  strokeNoise = new NYNoise(0.03, 0.03);
  fogNoise = new NYNoise(0.006, 0.006);
  dotFogNoise = new NYNoise(0.6, 0.002);
  strokeRotNoise = new NYNoise(0.1, 0.1);

  colorMode(HSB);
  baseHue = random(0, 360);

  mountainColor = color('white');
  mountainStrokeColor = color('black');

  await drawOnce();
}

async function drawOnce() {

  let drawFogDistance = int(10);
  let nowHue = 100;
  let nowSat = random(10, 60);
  let nowBri = random(10, 60);

  let drawY = 0.0;
  let mountainHeight = 800;
  let fogHeight = random(200, 400);

  for (let i = 0; drawY < windowHeight + 200; i++) {
    nowHue = baseHue + mountainNoise.get(i * 10, 0) * 120;

    if (nowHue < 0)
      nowHue += 360;
    if (nowHue > 360)
      nowHue -= 360;

    nowBri = mountainNoise.get(i * 10, 0) * 30 + 10;

    mountainColor = color(nowHue, nowSat, nowBri, 1);
    mountainStrokeColor = color(0, 0, 0, 1);

    drawY = -60 + i * 4;
    DrawMountainLineStrokes(drawY, mountainHeight, random(10, 30));

    if (i % drawFogDistance == 0) {

      // DrawFog(0, height, 3000, 30);
      DrawFogDots(400 + i * 4, fogHeight, fogHeight, 30);
      await sleep(50);
      DrawFogDots(400 + i * 4, 50, 50, 30);
    }

    await sleep(50);
  }

  // stroke(255);

  // DrawMountainLineStrokes(400, 300);
  // DrawMountainLineStrokes(440, 300);
  // DrawMountainLineStrokes(480, 300);

  // stroke(240, 255, 240, 100);

  // DrawMountainLineStrokes(700, 300);
  // DrawMountainLineStrokes(740, 300);
  // DrawMountainLineStrokes(760, 300);

  // stroke(250, 240, 250, 100);
}

function DrawMountainLine(_drawY, _drawHeight) {

  for (let x = 0; x < width; x++) {
    let posX = x;
    let posY = _drawY + mountainNoise.get(x, _drawY) * _drawHeight;
    let brushWidth = strokeNoise.get(x, _drawY) * 6;

    // fill back
    stroke(mountainColor);
    line(posX, posY, posX, height);

    strokeWeight(brushWidth);
    stroke(mountainStrokeColor);
    point(posX, posY);
  }
}

function DrawMountainLineStrokes(_drawY, _drawHeight, _offsetX) {

  strokeCap(SQUARE);
  for (let x = -1 * _offsetX; x < width + _offsetX; x++) {
    let posX = x;
    let posY = _drawY + mountainNoise.get(x, _drawY) * _drawHeight;
    let brushWidth = 2;
    let brushHeight = strokeNoise.get(x, _drawY) * 20 + 6;
    let strokeRot = -30 + strokeRotNoise.get(posX, posY) * 60;

    // fill back
    stroke(mountainColor);
    line(posX, posY, posX, height);

    if (int(posX) % 4 == 0) {
      push();

      translate(posX, posY);
      rotate(radians(strokeRot));

      strokeWeight(brushWidth);
      stroke(mountainStrokeColor);
      line(0.0, -0.5 * brushHeight, 0.0, 0.5 * brushHeight);
      pop();
    }
  }
}

function DrawMountainConnectLine(_fromY, _fromHeight, _toY, _toHeight, _xDiff) {
  let startX = -1 * abs(_xDiff);
  let totalWidth = width + abs(_xDiff);

  for (let i = startX; i < totalWidth; i += 6) {
    let fromX = i;
    let fromY = _fromY + mountainNoise.get(fromX, _fromY) * _fromHeight;

    let toX = i + _xDiff;
    let toY = _toY + mountainNoise.get(toX, _toY) * _toHeight;

    strokeWeight(1);
    stroke(30);

    for (let p = 0; p < 300; p++) {
      let t = p / 300;
      let animatedT = easeInCirc(t);

      let x = lerp(fromX, toX, animatedT);
      let y = lerp(fromY, toY, t);

      point(x, y);
    }
  }
}


function DrawFogDots(_baseY, _drawHeight, _noiseRange, _dotCount) {

  let dotWidth = 1;
  let dotCountPerLine = _dotCount;

  for (let x = 0; x < width; x += dotWidth) {

    let fogLineHeight = _drawHeight + dotFogNoise.get(x, _baseY) * _noiseRange;
    for (let i = 0; i < dotCountPerLine; i++) {

      let drawX = x;
      let drawT = sqrt(random());
      let drawY = lerp(_baseY - fogLineHeight, _baseY, drawT);

      // dot version
      // stroke(255, 100);
      // strokeWeight(dotWidth);
      // point(drawX, drawY);

      // noise stroke version
      let rotation = -45 + fogNoise.get(drawX, drawY) * 90;
      // rotation = 0;
      push();

      stroke(0, 0, 100, 0.1);
      strokeWeight(dotWidth);

      translate(drawX, drawY);
      rotate(radians(rotation));

      let strokeLength = 12;
      blendMode(ADD);
      line(0, -0.5 * strokeLength, 0, 0.5 * strokeLength);

      pop();

    }
  }

}

function DrawFog(_fromY, _toY, _fogLines, _fogLength) {
  for (let i = 0; i < _fogLines; i++) {
    push();

    let x = random(0, width);
    let y = random(_fromY, _toY);
    let rotation = fogNoise.get(x, y) * 360;

    strokeWeight(1);
    translate(x, y);
    rotate(radians(rotation));
    line(0.0, -0.5 * _fogLength, 0.0, 0.5 * _fogLength);

    pop();
  }
}

function draw() {

}

function inverseLerp(_from, _to, _value) {
  let diff = _to - _from;
  let valueDiff = _to - _value;

  return valueDiff / diff;
}


class NYNoise {
  constructor(_scaleX, _scaleY) {
    this.noiseX = random(-10000, 10000);
    this.noiseY = random(-10000, 10000);

    this.scaleX = _scaleX;
    this.scaleY = _scaleY;
  }

  get(_x, _y) {
    return noise(this.noiseX + this.scaleX * _x, this.noiseY + this.scaleY * _y);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x) {
  return x * x * x;
}

function easeInSine(x) {
  return 1 - Math.cos((x * Math.PI) / 2);
}

function easeInCirc(x) {
  return 1 - Math.sqrt(1 - Math.pow(x, 2));
}