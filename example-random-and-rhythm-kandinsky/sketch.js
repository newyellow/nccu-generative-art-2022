
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(250, 200, 150);

  colorMode(HSB);

  // stroke background
  for (let i = 0; i < 300; i++) {
    let hue = random(10, 20);
    let sat = 60;
    let brightness = 60;
    blendMode(MULTIPLY);
    stroke(color(hue, sat, brightness, 0.05));
    randomAlignedLines();
  }

  // draw frame
  smooth();
  noStroke();
  fill(0);

  let frameThickness = 40;
  rect(0, 0, width, frameThickness);
  rect(0, 0, frameThickness, height);
  rect(0, height - frameThickness, width, frameThickness);
  rect(width - frameThickness, 0, frameThickness, height);

  

  // main thick lines
  for (let i = 0; i < 3; i++) {
    push();

    let rotateDegree = random(0.0, 360.0);

    let x = random(0.2, 0.8) * width;
    let y = random(0.2, 0.8) * height;

    let thickness = random(6, 24);
    let randomThick = random(-10, 20);

    NYThickLine(x, y, rotateDegree, thickness, thickness + randomThick, height * random(0.3, 0.8), randomThick, randomThick);

    pop();
  }

  // thin lines
  for (let i = 0; i < 6; i++) {
    let distRange = random(0.2, 0.8) * width;

    let point1 = { x: random(0.1, 0.9) * width, y: random(0.1, 0.9) * height };
    let point2 = { x: point1.x + random(-1.0, 1.0) * distRange, y: point1.y + random(-1.0, 1.0) * distRange };
    let point3 = { x: point1.x + random(-1.0, 1.0) * distRange, y: point1.y + random(-1.0, 1.0) * distRange };

    stroke(0);
    strokeWeight(2);
    line(point1.x, point1.y, point2.x, point2.y);
    line(point1.x, point1.y, point3.x, point3.y);
  }

  // small aligned lines
  for (let i = 0; i < 10; i++) {
    randomAlignedLines();
  }

  // random circles
  for( let i=0; i< 6; i++)
  {
    let circleHue = int(random(0, 5)) * 80;
    let circleSat = 60;
    let circleBright = 100;

    let x = random(0.1, 0.9) * width;
    let y = random(0.1, 0.9) * height;
    let circleWidth = random(0.05, 0.3) * width;
    blendMode(MULTIPLY);
    colorMode(HSB);
    strokeWeight(2);

    if(random()>0.5)
      noStroke();
    else
    {
      strokeWeight(random(2, 30));
      stroke(0);
    }

    fill(color(circleHue, circleSat, circleBright));
    circle(x, y, circleWidth);
  }

  NYPaperTexture();
}

function NYThickLine(x, y, rot, upWidth, botWidth, height, edgeXRandomRange, edgeYRandomRange) {
  push();

  translate(x, y);
  rotate(radians(rot));

  let point1 = { x: -0.5 * upWidth, y: -0.5 * height };
  let point2 = { x: 0.5 * upWidth, y: -0.5 * height };
  let point3 = { x: -0.5 * botWidth, y: 0.5 * height };
  let point4 = { x: 0.5 * botWidth, y: 0.5 * height };

  point1.x += random(0.0, -edgeXRandomRange);
  point1.y += random(0.0, -edgeXRandomRange);
  point2.x += random(0.0, edgeXRandomRange);
  point2.y += random(0.0, -edgeXRandomRange);
  point3.x += random(0.0, -edgeXRandomRange);
  point3.y += random(0.0, edgeXRandomRange);
  point4.x += random(0.0, edgeXRandomRange);
  point4.y += random(0.0, edgeXRandomRange);

  beginShape();
  vertex(point1.x, point1.y);
  vertex(point2.x, point2.y);
  vertex(point4.x, point4.y);
  vertex(point3.x, point3.y);
  endShape();

  pop();
}

function randomAlignedLines() {
  let linesCount = random(2, 8);
  let lineLength = random(0.01, 0.2) * width;
  let lineMargin = random(10, 30);

  let lineRotation = random(0, 360);
  let strokeRotation = random(-60, 60);

  if(random() < 0.5)
    strokeRotation = 0;

  let posX = random(0.1, 0.9) * width;
  let posY = random(0.1, 0.9) * height;

  push();

    translate(posX, posY);
    rotate(radians(lineRotation));

  for(let i=0; i< linesCount; i++)
  {
    push();

    translate(i * lineMargin, 0.0);
    rotate(radians(strokeRotation));
    line(0, -0.5 * lineLength, 0, 0.5 * lineLength);

    pop();
  }

  pop();
}

async function NYPaperTexture() {
  let paperNoiseX = random(-1000.0, 1000.0);
  let paperNoiseY = random(-1000.0, 1000.0);
  let paperXScale = 0.03;
  let paperYScale = 1.2;
	
	let counter = 100;
	
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let nx = paperNoiseX + paperXScale * x;
      let ny = paperNoiseY + paperYScale * y;

      let noiseValue = noise(nx, ny);
      let colorValue = noiseValue * 255;

      blendMode(ADD);
			
      colorMode(RGB);
      fill(colorValue, 30);
      noStroke();
			
      rect(x, y, 1, 1);
			
			if((counter++ % 30000) == 0)
      {
				await sleep(100);
      }
    }
  }
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}