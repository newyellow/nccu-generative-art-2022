
let overlayData = [];
let hueShiftData = [];
let patterns = [];
let masks = [];

function preload() {
  for (let i = 0; i < 10; i++)
    patterns[i] = loadImage(`patterns/patterns-${i}.jpg`);

  for (let i = 0; i < 10; i++)
    masks[i] = loadImage(`masks/mask-${i}.jpg`);
}

async function setup() {
  createCanvas(1024, 1024);
  background(200);
  colorMode(HSB);

  for (let i = 0; i < 1024 * 1024; i++) {
    overlayData[i] = 0;
    hueShiftData[i] = 0;
  }

  // show masks one by one
  for (let i = 0; i < 10; i++) {

    background(0);
    image(masks[i], 0, 0);

    await sleep(100);

    readAndAddPixelData(i);

    await sleep(100);
  }

  // debugShowPixelData();
  showPatternsCrossOver();
}

function draw() {

}

function readAndAddPixelData(shapeIndex) {

  let adderA = random(-10000, -9000);
  let adderB = random(1000, 10000);
  let adderC = random(1000000, 2000000);

  for (let x = 0; x < 1024; x++) {
    for (let y = 0; y < 1024; y++) {
      let index = x * 1024 + y;

      let c = get(x, y);
      if (c[0] > 200) {
        overlayData[index] += adderA;
      }
      else if (c[0] > 100) {
        overlayData[index] += adderB;
      }
      else {
        overlayData[index] += adderC;
      }
    }
  }
}

function debugShowPixelData() {
  background(0);
  colorMode(RGB);
  for (let x = 0; x < 1024; x++) {
    for (let y = 0; y < 1024; y++) {
      let index = x * 1024 + y;

      randomSeed(overlayData[index]);
      let r = random(0, 255);
      let g = random(0, 255);
      let b = random(0, 255);

      stroke(r, g, b);
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

      randomSeed(overlayData[index]);

      let imgIndex = int(random(0, 10));
      let c = patterns[imgIndex].get(x, y);

      let hsb = RGBToHSB(c[0], c[1], c[2]);

      let _hue = (hsb[0] + random(0, 360)) % 360;
      let _sat = (hsb[1] + random(0, 30));
      let _bri = (hsb[2] + random(0, 30));

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
