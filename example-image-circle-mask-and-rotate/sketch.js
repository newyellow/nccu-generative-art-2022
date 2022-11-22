

let patternImg;
let clothTexture;

function preload() {
  patternImg = loadImage('images/patterns-1.jpg');
  clothTexture = loadImage('images/cloth-texture.jpg');
}

function setup() {
  createCanvas(2048, 2048);
  
  background(0);
  image(patternImg, 0, 0, width, height);

  colorMode(HSB);

  CopyCircleAndRotate(100, 100, 300, 60);
  CopyCircleAndRotate(500, 500, 1200, 20);
  
  for(let i=0; i< 10; i++)
  {
    let x = i * 100;
    let y = i * 100;
    let w = 2048 - i * 200;
    let rotateAngle = 12 * i;

    let bri = 100 - 10 * i;
    tint(0, 0, bri);
    CopyCircleAndRotate(x, y, w, rotateAngle);
  }

}

function CopyCircleAndRotate(_x, _y, _radius, _rotation)
{
  let targetX = _x;
  let targetY = _y;
  let centerX = _x + 0.5 * _radius;
  let centerY = _y + 0.5 * _radius;
  let targetW = _radius;
  let targetH = _radius;
  let rotation = _rotation;

  let maskImg = createGraphics(_radius, _radius);
  maskImg.noStroke();
  maskImg.fill('white');
  maskImg.circle(_radius/2, _radius/2, _radius);

  let newImg = createImage(_radius, _radius);
  newImg.copy(patternImg, _x, _y, _radius, _radius, 0, 0, _radius, _radius);
  newImg.mask(maskImg);

  push();

  translate(centerX, centerY);
  rotate(radians(rotation));

  image(newImg, -0.5 * targetW, -0.5 * targetH, targetW, targetH);

  pop();
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
  image(patternImg, -0.5 * targetW, -0.5 * targetH, targetW, targetH, targetX, targetY, targetW, targetH);

  pop();
}

function draw() {

}
