
function setup() {
  createCanvas(800, 1200);
  background(30);

  let baseHue = random(0, 360);
  let noiseScale = random(0.0001, 0.01);
  console.log('noise Scale: ' + noiseScale);


  // stroke lines
  for(let i=0; i< 2000; i++)
  {
    let xPos = random(0, width);
    let yPos = random(0, height);

    let lineHeight = random(0.001, 0.03) * height;

    colorMode(HSB);
    blendMode(ADD);
    let hue = baseHue + random(-30, 30);
    let sat = random(30, 80);
    let bright = random(60, 100);

    stroke(hue, sat, bright, 0.6);
    fill(hue, sat, bright, 0.3);

    strokeWeight(random(1, 3));
    

    let rotAngle = noise(xPos * noiseScale, yPos * noiseScale) * 180 + 90;

    push();

      translate(xPos, yPos);
      rotate(radians(rotAngle));
      line(0, -0.5 * lineHeight, 0, 0.5 * lineHeight);
    
    pop();

  }

  // rects
  for(let i=0; i< 600; i++)
  {
    let xPos = random(0, width);
    let yPos = random(0, height);

    let rectWidth = random(0.01, 0.15) * width;
    let rectHeight = random(0.2, 0.6) * rectWidth;

    colorMode(HSB);
    blendMode(ADD);
    let hue = baseHue + random(-30, 30);
    let sat = random(30, 80);
    let bright = random(60, 100);

    stroke(hue, sat, bright, 0.6);
    fill(hue, sat, bright, 0.3);

    strokeWeight(2);
    

    let rotAngle = noise(xPos * noiseScale, yPos * noiseScale) * 180;

    push();

      translate(xPos, yPos);
      rotate(radians(rotAngle));
      rect(-0.5 * rectWidth, -0.5 * rectHeight, rectWidth, rectHeight);
      // circle(0, 0, rectWidth);
    
    pop();
  }
}

function draw() {

}
