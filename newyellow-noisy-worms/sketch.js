

// global use
let renderer;
let gl;

// shaders
let wormsShader;

// models
let wormModel;
let wormGeometry;

// random values
let baseHue = 0.0;

function preload() {
  wormsShader = loadShader("wormsVert.vert", "wormsFrag.frag");
}

function setup() {
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);
  gl = renderer.GL;

  background(0);

  baseHue = random(0, 360);

  // setAttributes('antialias', true);
  wormModel = new WormModel("testWorm");

  // let xCount = int(random(3, 20));
  // let yCount = int(random(3, 20));

  let xCount = 2;
  let yCount = 2;

  // if (random() < 0.1)
  //   xCount = 60;

  // if (random() < 0.1)
  //   yCount = 60;

  console.log(`worm grid: ${xCount} x ${yCount}`);

  let xSpace = width / xCount;
  let ySpace = height / yCount;
  let wormSpace = min(xSpace, ySpace) * random(0.9, 1.1);

  // recalculate space
  // xCount = floor(width / wormSpace);
  // yCount = floor(height / wormSpace);

  // xSpace = width / xCount;
  // ySpace = height / yCount;

  let moveDir = random(0, 360);

  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {

      let xPos = -width / 2 + (0.5 + x) * xSpace;
      let yPos = -height / 2 + (0.5 + y) * ySpace;

      wormModel.shapeEdgeCount = int(random(3, 12));
      wormModel.nodeRadius = random(1, 3);
      wormModel.walkDirAngle = noise(x * 0.06, y * 0.02) * 360;
      wormModel.startOffset = noise(x * 0.1, y * 0.1, 300) * 100;

      wormModel.addWormLine(xPos, yPos, wormSpace, int(random(6, 24)));
    }
  }

  // console.log(wormModel.build(renderer));

  // let geometryCount = 30;
  // let randomWaveDir = [0, 30];

  // wormModel.addRegularShape(0, 0, 100, geometryCount);

  // for (let i = 0; i < geometryCount * 3; i++)
  //   wormModel.addCustomAttribute("aSeed", randomWaveDir);

  // geometryCount = 10;
  // randomWaveDir = [0, -30];

  // wormModel.addRegularShape(-100, 100, 60, geometryCount);

  // for(let i=0; i< geometryCount * 3; i++)
  //   wormModel.addCustomAttribute("aSeed", randomWaveDir);


  wormGeometry = wormModel.build(renderer);
  // console.log(wormGeometry);

  shader(wormsShader);
  model(wormGeometry);

  wormsShader.setUniform('uMoveSpace', wormSpace);
}

function draw() {

  background(0);
  noStroke();
  wormsShader.setUniform('uTime', frameCount);

  model(wormGeometry);

}





class WormModel {
  constructor(_modelName) {
    this.model = new NYModel(_modelName);
    this.shapeEdgeCount = -1; // -1 = random
    this.nodeRadius = 100;
    this.walkDirAngle = 0;
    this.startOffset = 0;
    this.colorValues = [1, 1, 1];
  }

  addWormLine(_centerX, _centerY, _spaceW, _nodeCount) {
    let tSpace = 1.0 / _nodeCount;
    let startX = _centerX + sin(radians(this.walkDirAngle)) * _spaceW / 2;
    let endX = _centerX + sin(radians(this.walkDirAngle + 180)) * _spaceW / 2;
    let startY = _centerY + cos(radians(this.walkDirAngle)) * _spaceW / 2;
    let endY = _centerY + cos(radians(this.walkDirAngle + 180)) * _spaceW / 2;

    let waveX = sin(radians(this.walkDirAngle + 90));
    let waveY = cos(radians(this.walkDirAngle + 90));

    let nodeSize = _spaceW * random(0.02, 0.1);
    let randomColor = getNYColor();
    let rValue = red(randomColor);
    let gValue = green(randomColor);
    let bValue = blue(randomColor);

    this.colorValues = [rValue / 255.0, gValue / 255.0, bValue / 255.0];
    for (let i = 0; i < _nodeCount; i++) {
      let t = (i + 0.5) * tSpace;
      let nodeX = lerp(startX, endX, t);
      let nodeY = lerp(startY, endY, t);

      this.addWormNode(nodeX, nodeY, nodeSize, [waveX, waveY], this.startOffset + i * 10);
    }
  }

  addWormNode(_centerX, _centerY, _radius, _waveDir, _walkOffset) {
    let edgeCount = this.shapeEdgeCount;
    if (this.shapeEdgeCount == -1)
      edgeCount = int(random(3, 12));

    this.model.addRegularShape(_centerX, _centerY, _radius, edgeCount);


    // cuz there are 3 verts per triangle
    let centerPosDatas = [];
    let waveDirDatas = [];
    let walkOffsetDatas = [];
    let colorDatas = [];
    for (let i = 0; i < edgeCount * 3; i++) {
      centerPosDatas.push(_centerX);
      centerPosDatas.push(_centerY);

      waveDirDatas.push(_waveDir[0]);
      waveDirDatas.push(_waveDir[1]);

      walkOffsetDatas.push(_walkOffset);

      colorDatas.push(this.colorValues[0]);
      colorDatas.push(this.colorValues[1]);
      colorDatas.push(this.colorValues[2]);
    }

    this.model.addCustomAttribute("aCenterPos", centerPosDatas);
    this.model.addCustomAttribute("aWaveDir", waveDirDatas);
    this.model.addCustomAttribute("aWalkOffset", walkOffsetDatas);
    this.model.addCustomAttribute("aNodeColor", colorDatas);
  }

  build(_renderer) {
    return this.model.build(_renderer);
  }
}

function getNYColor() {
  colorMode(HSB);

  let hueValue = baseHue + random(-30, 30);
  let satValue = random(40, 80);
  let briValue = random(60, 100);

  if (random() < 0.05) {
    satValue = 0.0;
    briValue = 100;
  }

  if (random() < 0.05) {
    hueValue += random(160, 200);
  }

  if (hueValue > 360)
    hueValue -= 360;
  else if (hueValue < 0)
    hueValue += 360;

  return color(hueValue, satValue, briValue);
}

class NYModel {
  static UV_CENTER = 0;
  static UV_TOP_DOWN = 1;

  constructor(_modelName) {
    this.verts = [];
    this.vertColors = [];
    this.triangles = [];
    this.uvs = [];
    this.vertIndex = 0;

    this.modelName = _modelName;

    this.customAttributeNames = [];
    this.customAttributeDatas = [];

    this.uvMode = NYModel.UV_TOP_DOWN;
  }

  addRegularShape(_centerX, _centerY, _radius = 100, _edgeCount = 4, _initRotation = 0) {

    let minX = _centerX - _radius;
    let maxX = _centerX + _radius;
    let minY = _centerY - _radius;
    let maxY = _centerY + _radius;

    for (let i = 0; i < _edgeCount; i++) {
      let p1x = _centerX;
      let p1y = _centerY;

      let p2Angle = i / _edgeCount * 360.0;
      let p3Angle = ((i + 1) / _edgeCount) * 360.0;

      let p2x = _centerX + sin(radians(p2Angle)) * _radius;
      let p2y = _centerY + cos(radians(p2Angle)) * _radius;

      let p3x = _centerX + sin(radians(p3Angle)) * _radius;
      let p3y = _centerY + cos(radians(p3Angle)) * _radius;

      let uv1 = [0, 1];
      let uv2 = [1, 0];
      let uv3 = [1, 1];

      if (this.uvMode == NYModel.UV_CENTER) {
        uv1 = [0, 0];
        uv2 = [i / _edgeCount, 1];
        uv3 = [(i + 1) / _edgeCount, 1];
      }
      else if (this.uvMode == NYModel.UV_TOP_DOWN) {
        uv1 = [0.5, 0.5];
        uv2 = [inverseLerp(minX, maxX, p2x), inverseLerp(minY, maxY, p2y)];
        uv3 = [inverseLerp(minX, maxX, p3x), inverseLerp(minY, maxY, p3y)];
      }

      this.addTriangle(p1x, p1y, p2x, p2y, p3x, p3y, uv1, uv2, uv3);
    }
  }

  addTriangle(_x1, _y1, _x2, _y2, _x3, _y3, _uv1 = [0, 1], _uv2 = [1, 0], _uv3 = [1, 1]) {
    this.verts.push([_x1, _y1]);
    this.verts.push([_x2, _y2]);
    this.verts.push([_x3, _y3]);

    this.vertColors.push([1.0, 1.0, 1.0, 1.0]);
    this.vertColors.push([1.0, 1.0, 1.0, 1.0]);
    this.vertColors.push([1.0, 1.0, 1.0, 1.0]);

    this.uvs.push(_uv1);
    this.uvs.push(_uv2);
    this.uvs.push(_uv3);

    this.triangles.push([this.vertIndex + 0, this.vertIndex + 1, this.vertIndex + 2]);
    this.vertIndex += 3;
  }

  addCustomAttribute(_attributeName, _data) {

    // if attribute not exist yet, init attributes
    if (!this.customAttributeNames.includes(_attributeName)) {
      this.customAttributeNames.push(_attributeName);
      this.customAttributeDatas[_attributeName] = [];
    }

    // put in data
    for (let i = 0; i < _data.length; i++) {
      this.customAttributeDatas[_attributeName].push(_data[i]);
    }
  }

  build(_renderer = null) {
    let md = new p5.Geometry();
    md.gid = this.modelName;

    md.vertices = [];
    for (let i = 0; i < this.verts.length; i++)
      md.vertices.push(new p5.Vector(this.verts[i][0], this.verts[i][1], 0));

    md.faces = [];
    for (let i = 0; i < this.triangles.length; i++)
      md.faces.push(this.triangles[i]);

    md.uvs = [];
    for (let i = 0; i < this.uvs.length; i++)
      md.uvs.push(this.uvs[i]);

    md.vertexColors = [];
    for (let i = 0; i < this.vertColors.length; i++)
      md.vertexColors.push(this.vertColors[i]);

    if (this.customAttributeNames.length > 0) {
      if (_renderer == null) {
        console.error("Need renderer reference for custom attributes");
        return;
      }

      for (let i = 0; i < this.customAttributeNames.length; i++) {

        let attributeName = this.customAttributeNames[i];
        let customDataName = "custom_" + attributeName;
        let customBufferName = customDataName + "Buffer";

        let data = this.customAttributeDatas[attributeName];
        let dataCountPerVertex = int(data.length / this.verts.length);

        if (data.length % this.verts.length != 0) {
          console.error(`WARNING: custom attribute ${attributeName} data count [${data.length}] not match vertices count [${this.verts.length}]`);
          return;
        }

        // put in custom data
        md[customDataName] = [];
        for (let d = 0; d < data.length; d++)
          md[customDataName].push(data[d]);

        console.log(`names: ${customDataName}  ${customBufferName}  ${attributeName}`);
        _renderer.retainedMode.buffers.fill.push(
          new p5.RenderBuffer(
            dataCountPerVertex, // number of components per vertex
            customDataName, // src
            customBufferName, // dst
            attributeName, // attribute name
            _renderer // renderer
          )
        );
      }
    }
    return md;
  }
}

function inverseLerp(from, to, value) {
  let range = to - from;
  if (range == 0)
    return 0;
  else
    return (to - value) / range;
}