import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
//https://github.com/nidorx/matcaps

const gui = new dat.GUI();

// Shaders - program algotytms what decided how and what pixel must be paint
// MAterial - used to put color of each pixel

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const mathcapTexture = textureLoader.load('/textures/matcaps/3.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg'); //its a very small image
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
//in our case it invisible but have good performance to productivity
gradientTexture.generateMipmaps = false;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//all what we test here will worked with most
// other materials in list
// MeshBasicMaterial - is a most basic and maybe useful type

// we can add different properties in different ways
// const material = new THREE.MeshBasicMaterial({
//     // map: doorColorTexture, //1
//     color: 'red', //3
// });

// material.map = doorColorTexture; //2
//some properties have uniq behavior
// material.color = 'green' //will call mistake
//we cant do like in example before
//instead we can add them like constructor properties
//or with some special methods
// material.color.set('green') //4
//or
// some props must be special types
// material.color = new THREE.Color('tomato');
//we can combine map and color
// material.map = doorColorTexture;

//wireframe works like carcass of shape
// material.wireframe = true;

//opacity is alpha chanel
//if we need to use it we need to set it
// material.opacity = 0.5;
// material.transparent = true

//we can set alphamap
//its black and white picture. what white wil be visible, black invisible
// material.alphaMap = doorAlphaTexture;

//materials are transparent from one side by default
// material.side = THREE.FrontSide; //default
// material.side = THREE.BackSide; //opposite
// material.side = THREE.DoubleSide; //double visible but load GPU

//this type of material reflect light in 90 degreas angle to th surface
//thats why we can see shadows
//previous material dot have this property so we saw it like light
// const material = new THREE.MeshNormalMaterial();

//if we need strach our wireframe like a film to see edges
//and mace all faces flat us
// material.flatShading = true;

//this type of material try to pick color of set texture and replace it to material
//so we can get colors and shadows what we need without scene light settings
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = mathcapTexture;

//This type behave like mesh is in darkness
//when camera is close it will works like week lighter
// const material = new THREE.MeshDepthMaterial();

//to see next material we need to add light
const ambientLight = new THREE.AmbientLight('0xffffff', 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight('0xffffff', 1);

pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

//this material react on light
//this material wery performant but have some specific effect
//its lightin wireframe lines
// const material = new THREE.MeshLambertMaterial();

//it dont have defect like in previous example
//and have bright reflections of light
//also have les performance
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 200;
//we can choose color of reflection
// material.specular = new THREE.Color('red');

//this like cartoon style material light reflection
// const material = new THREE.MeshToonMaterial();

//here we add very small picture 3px 
//and it will be stratch to meas and lose cartoon effect
//because render will mip mapping texture
//to avoid this use NearestFilter
// material.gradientMap = gradientTexture;

//this kind rendered on real physics algoritms
// const material = new THREE.MeshStandardMaterial();
//this kind of material its more realistic of all
//here we can use cool things
// material.metalness = 0.3;
// material.roughness = 0.5;

const material = new THREE.MeshStandardMaterial();

material.metalness = 0.7;
material.roughness = 0.2;

//ENVIRONMENT MAP
//HDRIHaven website
//Used for environment or scene decoration
//this type of maps supports only cube presentation
//and create it from six edges
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
]);
material.envMap = environmentMapTexture;

gui.add(material, 'metalness')
    .min(0)
    .max(1)
    .step(0.001);

gui.add(material, 'roughness')
    .min(0)
    .max(1)
    .step(0.001);

gui.add(material, 'displacementScale')
    .min(0)
    .max(1)
    .step(0.001);

//here we can add ambient oclusion texture but if we have texture like our picture texture
//we need to place it correctly like picture lays
//because it add shadows like 3d object but it only effect not real

// material.map = doorColorTexture;  
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 4;
// material.displacementMap = doorHeightTexture;
// //give more details for texture
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// //also we can use alpha map
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// //here we control scale of mapping height
// material.displacementScale = 0.02;

//also we can map roughtnes and metalness
//for better result dont combine with 
// material.metalness = 0.3;
// material.roughness = 0.5;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 34, 34),
    material
);

sphere.position.x = -1.5;
scene.add(sphere);

//to make real 3d effect we can use displacement map
//for that we need more vertexes
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material
);
scene.add(plane);
console.log(plane.geometry.attributes.uv.array);
plane.geometry.setAttribute(
    'uv2', //speciall THREE JS name for aoMap coordinates
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2) //here we set position for aoTexture
    //for plane and take its own texture coords like instance
);

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.5, 0.2, 16, 100),
    material
);

torus.position.x = 1.5;
scene.add(torus);
 

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
camera.position.z = 2
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