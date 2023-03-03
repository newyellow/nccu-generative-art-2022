

let eyeIndex;
let eyeImage;

let bodyIndex;
let bodyImage;

let faceIndex;
let faceImage;

let hairIndex;
let hairImage;

let mouthIndex;
let mouthImage;

function preload() {
  bodyIndex = int(random(0, 4));
  eyeIndex = int(random(0, 4));
  hairIndex = int(random(0, 4));
  mouthIndex = int(random(0, 4));
  faceIndex = int(random(0, 3));

  bodyImage = loadImage('images/body-' + bodyIndex + '.png');
  eyeImage = loadImage('images/eye-' + eyeIndex + '.png');
  hairImage = loadImage('images/hair-' + hairIndex + '.png');
  mouthImage = loadImage('images/mouth-' + mouthIndex + '.png');
  faceImage = loadImage('images/face-' + faceIndex + '.png');
}

function setup() {
  let canvasWidth = windowWidth;
  if (windowHeight < windowWidth)
    canvasWidth = windowHeight;

  createCanvas(canvasWidth, canvasWidth);
  background(0);

  background(random(120, 200), random(120, 200), random(120, 200));

  image(faceImage, 0, 0);
  image(bodyImage, 0, 0);
  image(eyeImage, 0, 0);
  image(mouthImage, 0, 0);
  image(hairImage, 0, 0);
}

function draw() {
}
