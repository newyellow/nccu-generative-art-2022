
let baseHue = 0.0;
let treeColor;
let leafColor;

async function setup() {
  createCanvas(1200, 1600);
  background(30);

  colorMode(HSB);

  baseHue = random(0, 360);


  // draw landscape
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {

      let noiseY = y + noise(x * 0.003, y * 0.004, -2000) * 300.0;

      let landHue = baseHue + noise(x * 0.001, y * 0.01, 1000) * 60;
      let landSat = noise(x * 0.001, y * 0.002, 1600) * 30 + 30;
      let landBri = noise(x * 0.003, y * 0.002, -2000) * 80 + 20;
      // let landBri = random(40, 80);

      if (landHue > 360)
        landHue -= 360;

      let treeAreaNoise = noise(x * 0.006, y * 0.008, 8000);
      if (treeAreaNoise < 0.4) {
        if (random() < 0.006) {
          let treeSizeT = 1.0 - treeAreaNoise / 0.4 + random(0.0, 0.3);


          // noStroke();
          // noFill();
          // stroke(0, 0, 100, 1.0);
          // noFill();
          // fill(0, 0, random(0, 10));
          stroke(landHue, random(80, 100), landBri);
          fill(0, 0, random(80, 100));

          treeColor = color(landHue, random(80, 100), landBri);
          leafColor = color(landHue, random(30, 60), 100);
          drawTree(x, noiseY, 180 + random(-10, 10), int(40 * treeSizeT * random(0.6, 2.0)), int(20 * treeSizeT * random(0.6, 1.2)));
        }
      }


      let grassLandNoise = noise(x * 0.01, y * 0.02, 6000);

      if (grassLandNoise < 0.8) {
        let grassLandT = 1.0 - grassLandNoise / 0.8 + random(0.0, 0.3);

        let grassHue = landHue + random(-30, 30);
        let grassSat = random(60, 100);
        let grassBri = random(80, 100);

        stroke(0, 0, 100, 0.3);
        fill(grassHue, grassSat, grassBri);
        // stroke(grassHue, grassSat, grassBri);
        noFill();
        let grassDir = 180 + lerp(-30, 30, noise(x * 0.1, y * 0.1, 3000));
        drawGrass(x, noiseY, grassDir, 20 * grassLandT, 6 * grassLandT, color(grassHue, grassSat, grassBri));
      }


      stroke(landHue, landSat, landBri, 0.6);
      fill(landHue, landSat, random(10, 30));
      circle(x, noiseY, 10);
    }
    await sleep(10);
  }
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawTree(_x, _y, _startDir, _growNodes, _nodeWidth) {
  let nowDir = _startDir;
  let posX = _x;
  let posY = _y;

  for (let i = 0; i < _growNodes; i++) {
    let t = 1.0 - i / _growNodes;
    posX += sin(radians(nowDir)) * _nodeWidth;
    posY += cos(radians(nowDir)) * _nodeWidth;

    push();

    translate(posX, posY);
    rotate(radians(-nowDir));
    scale(t);

    rect(-0.5 * _nodeWidth, -0.5 * _nodeWidth, _nodeWidth, _nodeWidth);

    if(t < 0.6)
    {
      let leafCount = 3;

      for(let leafInedx = 0; leafInedx < leafCount; leafInedx++)
      {
        let xPos = random(-12, 12) * _nodeWidth * t;
        let yPos = random(-6, 6) * _nodeWidth * t;

        stroke('white');
        fill(leafColor);
        circle(xPos, yPos, _nodeWidth * random(0.8, 2.0));
      }
    }

    pop();

    if (t < 0.6) {
      if (random() < 0.2) {
        let splitDir = random(-60.0, 60.0);

        let remainNodes = _growNodes - i;
        drawTree(posX, posY, nowDir - splitDir, remainNodes + random(0, 3), _nodeWidth * t);
      }
    }

    
    nowDir += noise(posX * 0.001, posY * 0.006, 3000) * 10 - 5;
  }
}

function drawGrass(_x, _y, _startDir, _growNodes, _nodeWidth, _grassColor) {
  let nowDir = _startDir;
  let posX = _x;
  let posY = _y;

  let grassHue = hue(_grassColor);
  let grassSat = saturation(_grassColor);
  let grassBri = brightness(_grassColor);

  for (let i = 0; i < _growNodes; i++) {
    let t = 1.0 - i / _growNodes;
    posX += sin(radians(nowDir)) * _nodeWidth;
    posY += cos(radians(nowDir)) * _nodeWidth;

    push();

    translate(posX, posY);
    rotate(radians(-nowDir));
    scale(t);

    let newBri = lerp(0.3, 1.2, 1.0 - t) * grassBri;
    fill(grassHue, grassSat, newBri);
    rect(-0.5 * _nodeWidth, -0.5 * _nodeWidth, _nodeWidth, _nodeWidth);

    pop();
    nowDir += noise(posX * 0.001, posY * 0.006, 3000) * 10 - 5;
  }
}