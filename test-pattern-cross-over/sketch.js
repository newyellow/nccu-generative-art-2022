
let overlayData = [];
let hueShiftData = [];
let patterns = [];

function preload() {
  for (let i = 0; i < 10; i++)
    patterns[i] = loadImage(`patterns/patterns-${i}.jpg`);
}

async function setup() {
  createCanvas(1024, 1024);
  background(200);
  colorMode(HSB);

  for (let i = 0; i < 1024 * 1024; i++) {
    overlayData[i] = 0;
    hueShiftData[i] = 0;
  }

  // random shapes
  for (let i = 0; i < 20; i++) {
    let xPos = random(0.3, 0.7) * width;
    let yPos = random(0.3, 0.7) * height;

    let rectW = random(300, 800);
    let rectH = random(300, 800);

    let rotation = int(random(0, 8)) * 45;

    push();

    translate(xPos, yPos);
    rotate(radians(rotation));

    background(0);
    if (random() < 0.2) {
      noFill();
      stroke(255);
      strokeWeight(100);
    }
    else {
      fill(255);
      noStroke();
    }
    rect(0, 0, rectW, rectH);

    await sleep(100);

    readAndAddPixelData(i);

    pop();

    await sleep(1000);
  }
  showPatternsCrossOver();
  // debugShowShapeData();
}

function draw() {

}

function readAndAddPixelData(shapeIndex) {
  for (let x = 0; x < 1024; x++) {
    for (let y = 0; y < 1024; y++) {
      let index = x * 1024 + y;

      let c = get(x, y);
      if (c[0] > 100) {
        overlayData[index] += 1;
        hueShiftData[index] = shapeIndex;
      }
    }
  }
}

function debugShowPixelData() {
  background(0);
  colorMode(HSB);
  for (let x = 0; x < 1024; x++) {
    for (let y = 0; y < 1024; y++) {
      let index = x * 1024 + y;

      let hue = overlayData[index] * 36;
      let sat = 80;
      let bright = 90;

      stroke(hue, sat, bright);
      point(x, y);
    }
  }
}

function debugShowShapeData() {
  background(0);
  colorMode(HSB);
  for (let x = 0; x < 1024; x++) {
    for (let y = 0; y < 1024; y++) {
      let index = x * 1024 + y;

      let hue = hueShiftData[index] * 10;
      let sat = 80;
      let bright = 90;

      stroke(hue, sat, bright);
      point(x, y);
    }
  }
}

function showPatternsCrossOver() {
  background(0);
  colorMode(HSB);

  for (let x = 0; x < 1024; x++) {
    for (let y = 0; y < 1024; y++) {
      let index = x * 1024 + y;

      let imgIndex = overlayData[index] % 10;
      let c = patterns[imgIndex].get(x, y);

      let hsb = RGBToHSB(c[0], c[1], c[2]);

      let _hue = hsb[0];
      let _sat = hsb[1];
      let _bri = hsb[2];


      _hue = (_hue + hueShiftData[index] * 30) % 360;

      stroke(_hue, _sat, _bri);
      point(x, y);
    }
  }
}

function RGBToHSB(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
