precision mediump float;

// default values
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;
// default values 


uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

attribute vec3 aCustomVertexColor;
attribute vec2 aSeed;

varying vec2 vTexCoord;
varying vec4 vColor;

uniform float uTime;

void main () {
    vec4 vPosition = vec4(aPosition, 1.0);
    // vPosition.x = aRandomSeed.x;
    vPosition.x += sin(uTime * 0.1) * aSeed.x;
    vPosition.y += cos(uTime * 0.1) * aSeed.y;
    
    // vPosition.y += aRandomSeed.y;

    gl_Position = uProjectionMatrix * uModelViewMatrix * vPosition;

    vTexCoord = aTexCoord;
    vColor = aVertexColor;
}

