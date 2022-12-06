
function setup() {
  createCanvas(600, 600);
  background(0);


  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

      // 可以透過乘的數值，去改變 noise map 最終呈現的分布細節
      let noiseValue = noise(x * 0.006, y * 0.006);

      // 把 noise value 畫出來，就可以看出 noise 雜訊的變化分布
      fill(noiseValue * 255);

      // 可以透過某一個數值去指定一個範圍
      // if (noiseValue < 0.4)
      //   fill('white');
      // else
      //   fill('black');

      noStroke();
      rect(x, y, 1, 1);
      
    }
  }
}

function draw() {

}
