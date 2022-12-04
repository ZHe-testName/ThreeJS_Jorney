import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
//Shadows is always was a challenge in every 3d Model branch
//it hard to calculate and render on computer
//By default any object in  Three JS dont can giv a shadow or take a shadow

//it hard to calculate shadows so Three JS need shadow map
//to render every shadow for every object on the scene

//before each render ThreeJS take a picture of the scene
//from the "light camera view" to create shadow map

//and after that when scene will render ThreeJS use this shadow maps for painting
//shadows for each object and on each object what will be in "photo" of this
//single light

//only the following light types support shadows
//PointLight
//DirectionalLight
//SpotLight

//Better performance is when we backing our textures pictures
//And use it instead realtime moving shadows
//But in this case our shadows will be static
const textureLoader = new THREE.TextureLoader();

// const shadowTexture = textureLoader.load('/textures/bakedShadow.jpg');

//also we have another way
//we can create plane above the sphere and move it with sphere like realistic shadow
//and when we going up to with sphere we will increase alpha of texture
//and increase shadow effect
//dont put plane on the same square with flour
//because it calls glitch effect or z-fighting
const simpleTextureShadow = textureLoader.load('/textures/simpleShadow.jpg');

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// DIRECTIONAL LIGHT

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
// scene.add(directionalLight)

//third we need
//3 - add ability cast shadow for the lights
directionalLight.castShadow = true;

//to handle with shadow quality we can use shadowMap sizing
//but don use huge map scales, it eat your render
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

//near and far options set how close and far light will be create shadows
//we must correct it for every scene to optimize render and performance
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 6;
//also for every scene we need to set amplitude of viewport
//Our light camera has Orthographic type so we can do like this
//all properties its a distance form centre of viewport to each age
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2.3;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2.3;

//we can add blur on shadow edge
directionalLight.shadow.radius = 8;

//we have a good helper for working with light cameras
//CameraHelper
const directionalLightCamera = new THREE.CameraHelper(
    directionalLight.shadow.camera
);
directionalLightCamera.visible = false;
// scene.add(directionalLightCamera);

//SPOT LIGHT
//Here we use PERSpECTIVE CAMERA
const spotLight = new THREE.SpotLight(
    0x00ff00,
    0.4,
    10,
    Math.PI * 0.3
);

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 35; //field of view
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0, 2, 2);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;

// scene.add(spotLightCameraHelper);

// scene.add(spotLight);
// scene.add(spotLight.target);

//POINT LIGHT
//That light use perspective camera viewport for render lights in all directions
//For that it use 6 viewport maps of all surrounding 
const pointLight = new THREE.PointLight(0xffff00, 0.4);

pointLight.castShadow = true;

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.camera.near = 0.3;
pointLight.shadow.camera.far = 4;

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(pointLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
//2 -For object we need to add shadows ability for each object in the scene what
//really need receive or cast shadow 
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

sphere.castShadow = true;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
    // new THREE.MeshBasicMaterial({
    //     map: shadowTexture,
    // })
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

plane.receiveShadow = true;

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        alphaMap: simpleTextureShadow,
        transparent: true,
    })
);

sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.001;

scene.add(sphere, plane, sphereShadow)

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

//to add shadows at first we need to 
//1 - enable it in renderer
// renderer.shadowMap.enabled = true;

//also we can choose Shadow Mapping Algorythm
//to optimize or instead lose our performance
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//this optimized and good shadow but it not support shadow.radius

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.position.z = Math.cos(elapsedTime) * 1.5;
    sphere.position.x = Math.sin(elapsedTime) * 1.5;

    //for ball bouncing
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    sphereShadow.position.z = Math.cos(elapsedTime) * 1.5;
    sphereShadow.position.x = Math.sin(elapsedTime) * 1.5;

    //shadow blur
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.5;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()