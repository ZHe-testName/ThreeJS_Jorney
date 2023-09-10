// All this matrices are provide us by Three JS
// And need for render in clip-space(like space in bix and we watxh all from camera)
// transform coordinates to clip-space coordinates
uniform mat4 projectionMatrix;
// apply transformations relative to camera(position, rotation, near, far)
uniform mat4 viewMatrix;
// apply transformations relative to Mash(position, rotation, scale)
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;
// attribute float aRandom;

// We cant use attributes in fragment shader but we can pass it from here
// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
    // to convert to some matrix multiply to it
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.z += aRandom * 0.1;
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z = elevation;

    // modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    // modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
    vElevation = elevation;

    // vRandom = aRandom;
}