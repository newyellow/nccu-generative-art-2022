
let baseHue = 0.0;

function setup() {
  createCanvas(800, 800);
  background(100);

  baseHue = random(0, 360);

  let padding = 20;
  let xCount = floor(random(1, 6));
  let yCount = floor(random(1, 6));

  console.log("X: " + xCount);

  let blockWidth = (800 - padding * 2) / xCount;
  let blockHeight = (800 - padding * 2) / yCount;


  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {

      let xPos = padding + x * blockWidth;
      let yPos = padding + y * blockHeight;

      NYRect(xPos, yPos, blockWidth, blockHeight);
    }
  }
}

function NYRect(_x, _y, _width, _height) {

  let isSplit = false;
  if (random(0.0, 1.0) < 0.9)
    isSplit = true;

  if (_width < 10)
    isSplit = false;

  if (_height < 10)
    isSplit = false;

  if (isSplit) {
    let splitRatio = random(0.1, 0.9);

    let splitType = floor(random(0, 2)); // 0 or 1

    if (splitType == 0) {
      NYRect(_x, _y, _width * splitRatio, _height);
      NYRect(_x + _width * splitRatio, _y, _width * (1.0 - splitRatio), _height);
    }
    else {
      NYRect(_x, _y, _width, _height * splitRatio);
      NYRect(_x, _y + _height * splitRatio, _width, _height * (1.0 - splitRatio));
    }

  }
  else {
    let isHorizontal = false;
    let isVertical = false;

    let randomValue = random(0.0, 1.0); // 0 ~ 1
    if (randomValue < 0.2) {
      isHorizontal = true;
      isVertical = true;
    }
    else if (randomValue < 0.6) {
      isHorizontal = true;
    }
    else {
      isVertical = true;
    }

    let lines = random(3, 60);
    let lineXSpace = _width / lines;
    let lineYSpace = _height / lines;
    let lineWidth = 1;

    colorMode(HSB);
    let hue = baseHue + random(60, 90);
    let sat = random(20, 60);
    let bright = random(40, 90);

    if (random(0.0, 1.0) < 0.2)
      hue += 180;

    if(hue > 360)
      hue -= 360;

    let _color = color(hue, sat, bright);
    stroke(_color);

    let specialColorChance = random(0.0, 1.0);

    if (specialColorChance < 0.05)
      stroke(0, 0, 100);
    else if (specialColorChance > 0.98)
      stroke(0, 0, 10);

    let isFilled = false;
    if (random(0.0, 1.0) < 0.1)
      isFilled = true;

    if (isFilled) {
      noStroke();
      fill(_color);
      rect(_x, _y, _width, _height);
    }
    else {
      if (isHorizontal == true) {
        for (let i = 0; i <= lines; i++) {
          let lineX = _x + i * lineXSpace;

          strokeWeight(lineWidth);
          line(lineX, _y, lineX, _y + _height);
        }
      }

      if (isVertical == true) {
        for (let i = 0; i <= lines; i++) {
          let lineY = _y + i * lineYSpace;

          strokeWeight(lineWidth);
          line(_x, lineY, _x + _width, lineY);
        }
      }
    }
  }


}

function draw() {

}
