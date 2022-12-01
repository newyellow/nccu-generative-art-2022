precision mediump float;

varying vec4 vColor;
varying vec2 vTexCoord;

void main() {
    
    // float sinValue = sin(30.0 * vTexCoord.y);
    // float stepValue = step(sinValue, 0.0);
    // float stepValue = 1.0;


    gl_FragColor = vec4(vColor.xyz * mix(0.8, 1.0, vTexCoord.x), 1.0);
    // gl_FragColor = vec4(vTexCoord.x, 0.0, vTexCoord.y, 1.0);
    // gl_FragColor = vec4(stepValue, stepValue, stepValue, 1.0);

    // if(vTexCoord.y > 0.95)
    //     gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    // else
    //     gl_FragColor = vec4(1.0, vTexCoord.x, 1.0, 1.0);
}