import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

import testVertexShader from './shaders/test/vertex.glsl';
import testFragmentShader from './shaders/test/fragment.glsl';
// SHADERS
// Everything what we can see in WebGL is possible
// because of shaders
// Shader - is one of the most important component of WebGL
// Shader - is
// - program written on GLSL
// - is program what sent to GPU
// - position of each vertex of geometry on screen
// - colorize each pixel of geometry on screen

// Fragments - its like pixels but for the render
// Pixels is not uniq scale unit

// Shaders have to process data (vertices, fog, light ...)
// And send it to GPU

// Shaders are use for render each vertex
// Each vertex has 
// Attributes - data what change to each vertex(coordinates etc.)
// Uniforms - data what dont change(color, camera pos..etc)

// Paint object flow
// We have data on start
// Data have attributes and uniforms
// Thats data about vertices
// This data processed in vertex shader
// Next data from shader go'es to another shader
// This data call varying
// Also we have uniform data on the enter of
// Next shader
// All this shaders make our render

// To create our own shader we needs
// ShaderMaterial and PawShaderMaterial

// LINKS
// shaders Book - https://thebookofshaders.com
// shader toy - https://www.shadertoy.com

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const flagTexture = textureLoader.load('/textures/ukraine-flag.jpg');

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms.map(() => Math.random()), 1));

// Material
// We need to provide shaders for this material
// Ass descripted above
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    // transparent: true,
    uniforms: {
        // to pass few values use Vector
        uFrequency: { value: new THREE.Vector2(16, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: flagTexture },
    },
});

gui
    .add(material.uniforms.uFrequency.value, 'x')
    .min(0)
    .max(20)
    .step(0.01)
    .name('frequencyX');

gui
    .add(material.uniforms.uFrequency.value, 'y')
    .min(0)
    .max(20)
    .step(0.01)
    .name('frequencyY');

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 /3;
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0.25, - 0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    material.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
};

tick();