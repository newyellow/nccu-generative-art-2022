

let eyes = [];
let bodies = [];
let faces = [];
let hairs = [];
let mouths = [];

function preload() {

  for (let i = 0; i < 4; i++)
    bodies[i] = loadImage('images/body-' + i + '.png');

  for (let i = 0; i < 4; i++)
    eyes[i] = loadImage('images/eye-' + i + '.png');

  for (let i = 0; i < 3; i++)
    faces[i] = loadImage('images/face-' + i + '.png');

  for (let i = 0; i < 4; i++)
    hairs[i] = loadImage('images/hair-' + i + '.png');

  for (let i = 0; i < 4; i++)
    mouths[i] = loadImage('images/mouth-' + i + '.png');
}

function setup() {
  let canvasWidth = windowWidth;
  if (windowHeight < windowWidth)
    canvasWidth = windowHeight;

  createCanvas(canvasWidth, canvasWidth);
  background(0);

  background(random(120, 200), random(120, 200), random(120, 200));

  let bodyIndex = int(random(0, 4));
  let eyeIndex = int(random(0, 4));
  let faceIndex = int(random(0, 3));
  let hairIndex = int(random(0, 4));
  let mouthIndex = int(random(0, 4));

  image(faces[faceIndex], 0, 0);
  image(bodies[bodyIndex], 0, 0);
  image(eyes[eyeIndex], 0, 0);
  image(mouths[mouthIndex], 0, 0);
  image(hairs[hairIndex], 0, 0);

}

function draw() {
}
