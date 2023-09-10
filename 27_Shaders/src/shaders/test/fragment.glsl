// GLSL - its a typed language and variables have type and cant be changed
// Besides typicaltypes in GLSL we have vec2(vec3, vec4) type like in ThreeJS
// vec2 vector = vec2(1.0, 2.0);
// after we can change them
// vector.x = 3.0;
// we can do arifmatic operation and it will inpact bouth valus
// vector *= 4;

// We can create vec3 from vec2
// vec3 bar = vec3(vector, 0.4);

// To create different thing use
// vec2 foo = bar.xz;

// We use this variable in general
// beacause low or high p can be bad for perfomance
precision mediump float;
uniform vec3 uColor;
// sampler2D is the type for textures
uniform sampler2D uTexture;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main()
{
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.7;
    // gl_FragColor = vec4(uColor, 1.0);
    gl_FragColor = textureColor;
}