
function setup() {
  createCanvas(800, 800);
  background(200);

  let isDarkMode = false;
  if (random(0.0, 1.0) > 0.5)
    isDarkMode = true;

  if (isDarkMode)
    background(20);
  else
    background(200);

  let shapeType = floor(random(0, 3));
  print(shapeType);

  let baseHue = random(100, 200);

  for (let i = 0; i < 100; i++) {
    let drawX = random(0, 800);
    let drawY = random(0, 800);
    let w = random(10, 200);
    let h = random(10, 200);

    colorMode(HSB);

    let hue = baseHue + random(-30, 30);
    let sat = random(60, 100);
    let bright = random(80, 100);

    if (isDarkMode)
      bright = random(80, 100);
    else
      bright = random(30, 60);

    strokeWeight(random(3, 6));
    fill(hue, sat, bright, random(0.1, 0.3));

    push();
    // translate(drawX, drawY);
    // let rotateValue = floor( random(0, 6));
    // rotate(radians(rotateValue * 45));
    // rect(-0.5 * w, -0.5 * h, w, h);
    if (isDarkMode)
    {
      blendMode(ADD);
      stroke(100);
    }
    else
    {
      blendMode(MULTIPLY);
    }

    if (shapeType == 0) {
      rect(drawX, drawY, w, h);
    }
    else if (shapeType == 1) {
      circle(drawX, drawY, w);
    }
    else if (shapeType == 2) {
      arc(drawX, drawY, w, w, random(0, 180), random(180, 360));
    }

    pop();
  }

  // frame
  let frameWidth = random(10, 100);
  noStroke();

  colorMode(RGB);
  if (isDarkMode)
    fill(40);
  else
    fill(230);

  rect(0, 0, width, frameWidth);
  rect(0, 0, frameWidth, height);
  rect(width - frameWidth, 0, frameWidth, height);
  rect(0, height - frameWidth, width, frameWidth);


}

function draw() {

}
