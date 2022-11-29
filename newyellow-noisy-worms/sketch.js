

// global use
let renderer;
let gl;

// shaders
let wormsShader;

// models
let wormModel;
let wormGeometry;

function preload() {
  wormsShader = loadShader("wormsVert.vert", "wormsFrag.frag");
}

function setup() {
  renderer = createCanvas(1600, 1600, WEBGL);
  gl = renderer.GL;

  background(0);
  // setAttributes('antialias', true);
  wormModel = new NYModel("worms");

  let xCount = 100;
  let yCount = 100;

  let xSpace = width/xCount;
  let ySpace = height/yCount;

  for(let x=0; x< xCount; x++)
  {
    for(let y=0; y< yCount; y++)
    {
      let cX = -0.5 * width + (x + 0.5) * xSpace;
      let cY = -0.5 * height + (y + 0.5) * ySpace;

      let edgeCount = int(random(3, 12));
      let noiseValue = noise(cX * 0.01, cY * 0.01);
      let moveAmountX = sin(radians(noiseValue * 360)) * xSpace / 4;
      let moveAmountY = cos(radians(noiseValue * 360)) * xSpace / 4;
      let randomDir = [moveAmountX, moveAmountY];

      wormModel.addRegularShape(cX, cY, xSpace/2, edgeCount);
      for(let a=0; a< edgeCount * 3; a++)
        wormModel.addCustomAttribute("aSeed", randomDir);
    }
  }

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

  shader(wormsShader);
  model(wormGeometry);
}

function draw() {

  background(0);
  noStroke();
  wormsShader.setUniform('uTime', frameCount);

  model(wormGeometry);

}








class NYModel {
  constructor(_modelName) {
    this.verts = [];
    this.triangles = [];
    this.uvs = [];
    this.vertIndex = 0;

    this.modelName = _modelName;

    this.customAttributeNames = [];
    this.customAttributeDatas = [];
  }

  addRegularShape(_centerX, _centerY, _radius = 100, _edgeCount = 4, _initRotation = 0) {
    for (let i = 0; i < _edgeCount; i++) {
      let p1x = _centerX;
      let p1y = _centerY;

      let p2Angle = i / _edgeCount * 360.0;
      let p3Angle = ((i + 1) / _edgeCount) * 360.0;

      let p2x = _centerX + sin(radians(p2Angle)) * _radius;
      let p2y = _centerY + cos(radians(p2Angle)) * _radius;

      let p3x = _centerX + sin(radians(p3Angle)) * _radius;
      let p3y = _centerY + cos(radians(p3Angle)) * _radius;

      this.addTriangle(p1x, p1y, p2x, p2y, p3x, p3y);
    }
  }

  addTriangle(_x1, _y1, _x2, _y2, _x3, _y3, _uv1 = [0, 1], _uv2 = [1, 0], _uv3 = [1, 1]) {
    this.verts.push([_x1, _y1]);
    this.verts.push([_x2, _y2]);
    this.verts.push([_x3, _y3]);

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