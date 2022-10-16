
async function setup() {
  createCanvas(800, 500);
  background(200);


  // 連續畫直線，每條直線間格 1px，這樣最後畫出來就會變成一個 rect
  for(let i=0; i< 160; i++)
  {
    let x1 = 20 + i;
    let y1 = 20;
    let x2 = 20 + i;
    let y2 = 120;

    stroke(30);
    line(x1, y1, x2, y2);

    await sleep(10); // 每條線之間，隔 10 毫秒再畫，比較看的出來畫的過程
  }

  // 連續畫直線，但每次畫出來的時候，讓顏色稍微有一點變化，就可以畫出漸層色
  for(let i=0; i< 160; i++)
  {
    let x1 = 220 + i;
    let y1 = 20;
    let x2 = 220 + i;
    let y2 = 120;

    let hue = 10 + i; // 每次 hue + 1
    let sat = 40; 
    let brightness = 80;

    colorMode(HSB);
    stroke(hue, sat, brightness);
    line(x1, y1, x2, y2);

    await sleep(10); // 每條線之間，隔 10 毫秒再畫，比較看的出來畫的過程
  }

  // 連續畫出直線，但是每次的間隔讓他變大 (i*4) 所以就會變成網格狀的效果
  for(let i=0; i< 40; i++)
  {
    let x1 = 420 + i * 4;
    let y1 = 20;
    let x2 = 420 + i * 4;
    let y2 = 120;

    stroke(30);
    line(x1, y1, x2, y2);

    await sleep(10);
  }

  // 畫出網格一樣可以加入顏色漸變效果
  for(let i=0; i< 40; i++)
  {
    let x1 = 620 + i * 4;
    let y1 = 20;
    let x2 = 620 + i * 4;
    let y2 = 120;

    let hue = 10 + i;
    let sat = 40; 
    let brightness = 80;

    colorMode(HSB);
    stroke(hue, sat, brightness);
    line(x1, y1, x2, y2);

    await sleep(10);
  }


  // 同理，用 rect 或其他形狀也可以做一樣的事情
  for(let i=0; i< 60; i++)
  {
    let xPos = 20 + i;
    let yPos = 220 + i;
    let rectWidth = 100;
    let rectHeight = 100;

    stroke(30);
    noFill();

    rect(xPos, yPos, rectWidth, rectHeight);

    await sleep(10);
  }

  // 變成網格狀
  for(let i=0; i< 20; i++)
  {
    let xPos = 220 + i * 3;
    let yPos = 220 + i * 3;
    let rectWidth = 100;
    let rectHeight = 100;

    stroke(30);
    noFill();

    rect(xPos, yPos, rectWidth, rectHeight);

    await sleep(10);
  }


  // 如果要看起來往內縮，那 rect 的寬度和高度要同時往內縮
  for(let i=0; i< 20; i++)
  {
    let xPos = 420 + i * 3;
    let yPos = 220 + i * 3;
    let rectWidth = 160 - i * 6;
    let rectHeight = 160 - i * 6;

    stroke(30);
    noFill();

    rect(xPos, yPos, rectWidth, rectHeight);

    await sleep(10);
  }

  // 再加上顏色漸變
  for(let i=0; i< 20; i++)
  {
    let xPos = 620 + i * 3;
    let yPos = 220 + i * 3;
    let rectWidth = 160 - i * 6;
    let rectHeight = 160 - i * 6;

    let hue = 100 + i * 2;
    let sat = 40; 
    let brightness = 80 - i;

    colorMode(hue, sat, brightness);
    stroke(hue, sat, brightness);
    noFill();

    rect(xPos, yPos, rectWidth, rectHeight);

    await sleep(10);
  }
}

function draw() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
