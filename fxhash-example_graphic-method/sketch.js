
// 你希望設定的畫布大小
let originCanvasWidth = 1600;
let originCanvasHeight = 2400;

// 最終的畫布大小
let canvasWidth = 800;
let canvasHeight = 1200;

let _mainCanvas;

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

  console.log(fxhash);
  noiseSeed(fxRandom(-10000, 10000));

  setupCanvasRatio();

  _mainCanvas = createGraphics(originCanvasWidth, originCanvasHeight);
  createCanvas(canvasWidth, canvasHeight);

  console.log('origin:' + originCanvasWidth + ',' + originCanvasHeight);
  console.log('screen:' + canvasWidth + ',' + canvasHeight);

  _mainCanvas.background(30);

  // 設定要有幾排 (yCount) 以及每一排有幾個圓 (xCount)
  let xCount = floor(fxRandom(10, 60));
  let yCount = floor(fxRandom(1, 12));

  // 根據 xCount 跟 yCount 的數量計算 每個圓之間需要間隔多大的距離 才不會重疊
  let xSpace = originCanvasWidth / xCount;
  let ySpace = originCanvasHeight / yCount;

  // 隨機顏色
  let baseHue = fxRandom(0, 360);

  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      let xPos = (x + 0.5) * xSpace;
      let yPos = (y + 0.5) * ySpace;
      let radius = fxRandom(0.7, 0.9) * xSpace;

      yPos += (noise(xPos * 0.12, yPos * 0.12) - 0.5) * ySpace;
      _mainCanvas.strokeWeight(6);

      _mainCanvas.colorMode(HSB);
      let fillHue = baseHue + fxRandom(-30, 30);
      let fillSat = fxRandom(30, 100);
      let fillBri = fxRandom(60, 100);

      let strokeHue = baseHue + fxRandom(-30, 30);
      let strokeSat = fxRandom(20, 70);
      let strokeBri = fxRandom(10, 60);

      _mainCanvas.fill(fillHue, fillSat, fillBri);
      _mainCanvas.stroke(strokeHue, strokeSat, strokeBri);
      _mainCanvas.circle(xPos, yPos, radius);

      await sleep(1);
    }
  }

  fxpreview();
}

function draw() {
  image(_mainCanvas, 0, 0, width, height);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
