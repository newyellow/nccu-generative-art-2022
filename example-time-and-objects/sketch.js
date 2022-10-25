
let objs = [];

function setup() {
  createCanvas(800, 1200);
  background(30);

  colorMode(HSB);
  let baseHue = random(0, 360);

  for (let i = 0; i < 100; i++) {
    objs[i] = new MoveObj(width / 2, height / 2);

    let hue = baseHue + random(-30, 30);
    if (random() < 0.1)
      hue += 180;

    if (hue > 360)
      hue -= 360;
    else if (hue < 0)
      hue += 360;

    objs[i].hue = hue;
  }
}

function draw() {

  for (let i = 0; i < objs.length; i++) {
    objs[i].step();
    objs[i].draw();
  }
}

class MoveObj {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.steps = 0;
    this.speed = random(1, 10);

    this.direction = random(0, 360);
    this.directionChangeMultiplier = random(-20, 20);
    this.noiseX = random(-1000, 1000);
    this.noiseY = random(-1000, 1000);
    this.noiseScale = random(0.001, 0.01);

    this.strokeWidth = random(1, 6);

    this.hue = 0;

    this.satMax = random(60, 80);
    this.satMin = random(30, 60);
    this.satSpeed = random(0.1, 2)
    
    this.lightMax = random(80, 100);
    this.lightMin = random(40, 60);
    this.lightSpeed = random(0.1, 2);

    if(random() < 0.1) // become white
    {
      this.hue = 0;
      this.satMax = 0;
      this.satMin = 0;
      this.lightMax = 100;
      this.lightMin = random(60, 80);
    }

    this.circleWidthMax = random(10, 300);
    this.circleWidth = sin(radians(this.steps)) * this.circleWidthMax;

    if(random() < 0.8)
    {
      this.circleWidthMax = 3;
      this.circleWidth = 3;
    }

    this.sizeChangeMultipler = random(0.1, 3.0);
  }

  step() {
    this.steps++;

    this.x += sin(radians(this.direction)) * this.speed;
    this.y += cos(radians(this.direction)) * this.speed;

    if (this.x < -300)
      this.x += width + 599;
    else if (this.x > width + 300)
      this.x -= width + 599;

    if (this.y < -300)
      this.y += height + 599;
    else if (this.y > height + 300)
      this.y -= height + 599;

    this.circleWidth = sin(radians(this.steps * this.sizeChangeMultipler)) * this.circleWidthMax;

    this.noiseX += this.noiseScale;
    this.noiseY += this.noiseScale;
    this.direction += (noise(this.noiseX, this.noiseY) * 2 - 1) * this.directionChangeMultiplier;

    this.sat = lerp(this.satMin, this.satMax, sin(radians(this.steps * this.satSpeed)));
    this.light = lerp(this.lightMin, this.lightMax, sin(radians(this.steps * this.lightSpeed)));
    this.color = color(this.hue, this.sat, this.light);
  }

  draw() {
    noFill();

    push();
    translate(this.x, this.y);
    rotate(radians(this.direction));

    strokeWeight(this.strokeWidth);

    stroke(this.color);
    rect(-0.5 * this.circleWidth, -0.5 * this.circleWidth, this.circleWidth, this.circleWidth);

    pop();
  }
}