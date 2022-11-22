

let totems = [];
let mainHue = 0;

function preload() {
  totems[0] = loadImage('images/totem-0.png');
  totems[1] = loadImage('images/totem-1.png');
  totems[2] = loadImage('images/totem-2.png');
  totems[3] = loadImage('images/totem-3.png');

  mainHue = random(0, 360);
}

function setup() {
  createCanvas(800, 800);
  background(30);

  let xCount = floor(random(4, 20));
  let drawWidth = width / xCount;
  let startX = 0;

  let yCount = floor(random(4, 20));
  let drawHeight = height / yCount;
  let startY = 0;

  if (drawWidth > drawHeight) {
    drawWidth = drawHeight;
    startX = (width - xCount * drawWidth) / 2;
  }
  else if(drawWidth < drawHeight)
  {
    drawHeight = drawWidth;
    startY = (height - yCount * drawHeight) / 2;
  }

  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      let drawX = startX + x * drawWidth;
      let drawY = startY + y * drawHeight;

      drawTotem(drawX, drawY, drawWidth, drawWidth);
    }
  }


}

function drawTotem(_x, _y, _w, _h) {
  let totemIndex = floor(random(0, 4));
  let toX = _x + 0.5 * _w;
  let toY = _y + 0.5 * _h;
  let drawX = -0.5 * _w;
  let drawY = -0.5 * _h;

  let rotation = floor(random(0, 4)) * 90.0;

  colorMode(HSB);
  let nowHue = mainHue + random(-20, 20);
  let nowSat = random(40, 80);
  let nowBri = 100;

  if(random() < 0.1)
    nowHue += 180;

  if(nowHue > 360)
    nowHue -= 360;
  else if(nowHue < 0)
    nowHue += 360;


  push();

  translate(toX, toY);
  rotate(radians(rotation));

  tint(nowHue, nowSat, nowBri);
  image(totems[totemIndex], drawX, drawY, _w, _h);

  pop();
}

function draw() {

}
