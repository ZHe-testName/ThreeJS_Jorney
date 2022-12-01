import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Displace texture it is not a color it make verticies up and down in depend of the 
// Darkness or whiteness of texture surface 
// We need enough subdivisions for this

// Normal texture adding details. Its about light
// Its dont need subdivisions

// Ambient occlusion create fake shadows and add contrast of details

// Metalness is grayscale image and behave like reflector

// All textures working like PBR
// (Physics Based Rendering)
// To get real life effects

/**
 * Textures
 */
// native way to load images
// const image = new Image();
// const texture = new THREE.Texture(image); //but image not loaded yet...

// // we can not use images directly
// // we need create texture
// image.onload = () => {
//     //...when it loaded we need to update our texture with new image value
//     texture.needsUpdate = true;
// };

// image.src = '/textures/door/color.jpg';

// Also we can use loading manager if we want to know about all
// textures are processed or be informed when everything is loaded
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
    console.log('onStart');
};

loadingManager.onLoad = () => {
    console.log('onLoad');
};

loadingManager.onProgress = () => {
    console.log('onProgress');
};

loadingManager.onError = () => {
    console.log('onError');
};

// Faster way to load textures
const textureLoader = new THREE.TextureLoader(loadingManager);
// const texture = textureLoader.load(
//     '/textures/door/color.jpg',
//     // () => {console.log('load')}, //we also have 3 callbacks for different situation
//     // () => {console.log('progress')},
//     // () => {console.log('error')}
// );

// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
// const colorTexture = textureLoader.load('/textures/door/color.jpg');
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
const colorTexture = textureLoader.load('/textures/minecraft.png');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const ambientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// We can repeat wrapping by
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 2;

// or more correct way is 
colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping; 

// or in mirror style
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping; 

// also we have offset of texture
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// all this values are Vector2 coordinates

// we can control a pivot point of rotation texture
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

// we can rotate texture
// it is not an axis because it placed on flat 2d area
// colorTexture.rotation = Math.PI * 0.25;

///////////////////////////TRANSFORMATIONS/////////////////////////////
// Filtering and mipMapping

// Mipmapping - its a technic that consist of creating
// half smaller version of texture again and again
// until we get 1x1 texture

// there are two types of algorithm of mipmapping

// NEAREST FILTER IS BETTER FOR PERFORMANCE AND FRAME

// 1 - minificaton filter - feppens when the pixels of texture is smaller then
// the pixels of a render

// we can change minFilter value to handle this minification with THREE consts
// WITH THIS MINFILTER WE DONT NEED TO USE MIPMAPPING
// colorTexture.generateMipmaps = true;
// colorTexture.minFilter = THREE.NearestFilter;
// colorTexture.minFilter = THREE.LinearFilter;
// colorTexture.minFilter = THREE.NearestMipMapNearestFilter;
// colorTexture.minFilter = THREE.NearestMipMapLinearFilter;
// colorTexture.minFilter = THREE.LinearMipMapNearestFilter;
// colorTexture.minFilter = THREE.LinearMipMapLinearFilter;

// 2 - magnification filter
// Happens when the pixel of the texture is bigger than the pixels of render
// (oposite mipmapping)

colorTexture.magFilter = THREE.NearestFilter;
// colorTexture.magFilter = THREE.LinearFilter; //default

// different geometries has its own wrapping rules
// it based on UV UNWRAPPING coordinates

// all geometries have its own specific uv coordinates
// we can get them in geometry.attributes.uv

// OPTIMIZATION
// Consist of three things
// - weight
// - size (resolution)
// - data

// Good practice is using 2x2 resolution(521x521, 512x1024) all nums must divide by 2 not (512x1029)

// NORMAL TEXTURE ARE USUALLY .PNG FORMAT BECAUSE WE NEED PIXEL PERFECT POSITION

// ////////////////WHERE GET TEXTURES
// poligon.com
// 3dtextures.me
// arroway-texture.ch

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: colorTexture})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()