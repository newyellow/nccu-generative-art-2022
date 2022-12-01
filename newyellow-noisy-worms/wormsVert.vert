precision mediump float;

// helpers
vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m * v;
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
}
// helpers


// default values
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;
// default values 

#define DEG_TO_RAD 0.0174532925

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

attribute vec2 aCenterPos;
attribute vec2 aWaveDir;
attribute float aWalkOffset;
attribute vec3 aNodeColor;
attribute vec2 aSeed;

varying vec4 vColor;
varying vec2 vTexCoord;

uniform float uMoveSpace;
uniform float uTime;

void main () {
    vec2 rotatedPos = rotate(aPosition.xy - aCenterPos.xy, DEG_TO_RAD * uTime);
    rotatedPos.x += aCenterPos.x;
    rotatedPos.y += aCenterPos.y;

    vec4 vPosition = vec4(rotatedPos, 1.0, 1.0);

    float moveAmount = sin(DEG_TO_RAD * uTime * 15.0 + aWalkOffset * 0.06) * uMoveSpace / 6.0;
    vPosition.xy += moveAmount * aWaveDir;
    // vPosition.y += aRandomSeed.y;

    gl_Position = uProjectionMatrix * uModelViewMatrix * vPosition;

    vTexCoord = aTexCoord;
    vColor = vec4(aNodeColor, 1.0);
    // vVertexColor = aVertexColor.xyz;
}



