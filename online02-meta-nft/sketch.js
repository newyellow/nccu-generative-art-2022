

async function setup() {
  createCanvas(800, 800);
  background(0);

  // 撈資料，因為上鏈 NFT 後才會得到 token id，在上架時並不知道
  // 所以必須要先透過 aritst creation 去抓資料
  // 取得 token id 後，可以再透過其他 api 取得想要的資料
  let creationData = await getArtistCreation();
  let tokenId = creationData.tokens[0].tokenId;
  console.log(tokenId);

  let tokenData = await getTokenData(tokenId);
  console.log(tokenData);

  let ownerData = tokenData.owners;
  let ownerAddresses = Object.keys(ownerData);
  console.log(ownerAddresses);

  // 根據持有的數量畫成長條狀
  let xCount = ownerAddresses.length;
  let padding = 100;
  let xSpace = (width - padding * 2) / xCount;
  let ySpace = (height - padding * 2) / 10;

  for(let i=0; i< xCount; i++)
  {
    let currentAddress = ownerAddresses[i];
    let holdAmount = ownerData[currentAddress];

    colorMode(HSB);

    let hueValue = 30 * holdAmount;
    let satValue = 60;
    let briValue = 80;

    stroke(30);
    strokeWeight(3);
    fill(hueValue, satValue, briValue);
    
    let xPos = padding + i * xSpace;
    let yPos = padding + (10 - holdAmount) * ySpace;
    let rectHeight = holdAmount * ySpace;

    rect(xPos, yPos, xSpace, rectHeight);

    // 把持有人的 address 寫上去
    push();

    let ownerName = tokenData.ownerAliases[currentAddress];

    translate(xPos, height - padding);
    rotate(radians(-90));

    noStroke();
    fill(255);
    textSize(16);

    if(ownerName == "")
      text(currentAddress, 6.0, 16.0);
    else
      text(ownerName, 6.0, 16.0);

    pop();
  }
}

async function getArtistCreation() {
  let artistAddress = "tz1RPZp6NLzn7x4g7jhqHtCkhCQVnhbVMj8y";
  let targetCreationTag = "nightcitystreet";

  let apiUrl = `https://api.akaswap.com/v2/accounts/${artistAddress}/creations?tag=${targetCreationTag}`;

  let result = await fetch(apiUrl);
  let jsonData = await result.json();

  return jsonData;
}

async function getTokenData(_tokenId) {
  let apiUrl = `https://api.akaswap.com/v2/fa2tokens/KT1AFq5XorPduoYyWxs5gEyrFK6fVjJVbtCj/${_tokenId}`;

  let result = await fetch(apiUrl);
  let jsonData = await result.json();

  return jsonData;
}

function draw() {

}
