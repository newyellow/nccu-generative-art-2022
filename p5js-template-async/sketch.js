
async function setup() {
  createCanvas(600, 600);
  background(30);

  for (let i = 0; i < 30; i++)
  {
    fill(255);
    rect(random(0, width), random(0, height), random(10, 60), random(10, 60));
    await sleep(200); // 等待 200 毫秒
  }
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
