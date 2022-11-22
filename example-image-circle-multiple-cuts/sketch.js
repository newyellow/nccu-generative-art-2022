

let patterns = [];
let clothTexture;
let mainCanvas;

function preload() {
  patterns[0] = loadImage('images/patterns-1.jpg');
  patterns[1] = loadImage('images/patterns-2.jpg');
  clothTexture = loadImage('images/cloth-texture.jpg');
}

function setup() {
  createCanvas(2048, 2048);
  mainCanvas = createGraphics(2048, 2048);
  mainCanvas.background(0);
  mainCanvas.image(patterns[0], 0, 0, width, height);

  colorMode(HSB);
  mainCanvas.colorMode(HSB);

  let tintHue = 0;
  for(let i=0; i< 10; i++)
  {
    let padding = 30;
    
    let w = random(0.1, 0.8) * width;
    let h = w;

    let x = random(0.1, 0.9) * (width - w) + padding;
    let y = random(0.1, 0.9) * (height - h) + padding;
    let rotation = random(-10, 10);

    tintHue += 1;

    tint(tintHue, random(0, 60), 80);
    CopyCircleAndRotate(x, y, w, rotation);
  }

  // background(30, 200);

  // blendMode(DODGE);
  // tint(255, 250);
  let tintColor = color(0, 0, 100, 0.8);
  tint(tintColor);
  blendMode(MULTIPLY);
  // image(clothTexture, 0, 0, width, height);

  image(mainCanvas, 0, 0, width, height);
}

function CopyCircleAndRotate(_x, _y, _radius, _rotation)
{
  let targetX = _x;
  let targetY = _y;
  let targetW = _radius;
  let targetH = _radius;
  let rotation = _rotation;

  let maskImg = createGraphics(_radius, _radius);
  maskImg.noStroke();
  maskImg.fill('white');
  maskImg.circle(_radius/2, _radius/2, _radius);

  let newImg = createImage(_radius, _radius);
  newImg.copy(mainCanvas, _x, _y, _radius, _radius, 0, 0, _radius, _radius);
  newImg.mask(maskImg);

  mainCanvas.push();

  mainCanvas.translate(targetX + 0.5 * targetW, targetY + 0.5 * targetH);
  mainCanvas.rotate(radians(rotation));

  mainCanvas.image(newImg, -0.5 * targetW, -0.5 * targetH, targetW, targetH, 0, 0, targetW, targetH);

  mainCanvas.pop();
}
function CopyRectAndRotate (_x, _y, _w, _h, _rotation)
{
  push();
  let targetX = _x;
  let targetY = _y;
  let targetW = _w;
  let targetH = _h;
  let rotation = _rotation;


  translate(targetX + 0.5 * targetW, targetY + 0.5 * targetH);
  rotate(radians(rotation));
  image(patterns[0], -0.5 * targetW, -0.5 * targetH, targetW, targetH, targetX, targetY, targetW, targetH);

  pop();
}

function draw() {

}
