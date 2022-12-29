
// 你希望設定的畫布大小
let originCanvasWidth = 800;
let originCanvasHeight = 1200;

// 最終的畫布大小
let canvasWidth = 800;
let canvasHeight = 1200;

function setupCanvasRatio () {
  let originRatio = originCanvasWidth / originCanvasHeight;
  let screenRatio = windowWidth / windowHeight;
  console.log(originRatio);
  console.log(screenRatio);

  // 如果螢幕的比例比作品比例寬，就以螢幕高度來當畫布高度
  if(screenRatio > originRatio)
  {
    canvasHeight = windowHeight;
    canvasWidth = canvasHeight * originRatio;
  }
  // 如果螢幕的比例比較窄，就以螢幕寬度來當畫布寬度
  else
  {
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / originRatio;
  }
}

async function setup() {

  setupCanvasRatio();

  createCanvas(canvasWidth, canvasHeight);
  background(30);

  // 設定要有幾排 (yCount) 以及每一排有幾個圓 (xCount)
  let xCount = floor(random(10, 60));
  let yCount = floor(random(1, 12));

  // 根據 xCount 跟 yCount 的數量計算 每個圓之間需要間隔多大的距離 才不會重疊
  let xSpace = width / xCount;
  let ySpace = height / yCount;

  // 隨機顏色
  let baseHue = random(0, 360);

  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      let xPos = (x + 0.5) * xSpace;
      let yPos = (y + 0.5) * ySpace;
      let radius = random(0.7, 0.9) * xSpace;

      yPos += (noise(xPos * 0.001, yPos * 0.001) - 0.5) * ySpace;
      strokeWeight(3);

      colorMode(HSB);
      let fillHue = baseHue + random(-30, 30);
      let fillSat = random(30, 100);
      let fillBri = random(60, 100);

      let strokeHue = baseHue + random(-30, 30);
      let strokeSat = random(20, 70);
      let strokeBri = random(10, 60);

      fill(fillHue, fillSat, fillBri);
      stroke(strokeHue, strokeSat, strokeBri);
      circle(xPos, yPos, radius);

      await sleep(1);
    }
  }
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
