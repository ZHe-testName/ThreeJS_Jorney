import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// MODELS
// We can load models from 3d creator into ThreeJS
// We have a lot of formats to load
// Formats are different in
//  Wight
//  Size
//  Compatibility
//  Compression
//  Popular formats
//  OBJ, STL, FBX, PLY, COLLADA, 3DS, GLTF
// GLTF
// This format cover most needs what we can have
// Each formats contain a bunch of data inside
// geometries, materials, cameras, skeletons, lights, animation
// find free examples can here
// https://github.com/KhronosGroup/glTF-Sample-Models

// GLTF format also have different formats
// for different needs and cases
// glTF
// glTF-Binary
// glTF-Draco
// glTF-Embedded

// To load 3D model we needs to use a GLTFloader
// Also we can use a lot of loaders from that folder
const gltfLoader = new GLTFLoader();
// also with this loader we can use load manager

// DRACO format of glTF is much lighter then others
// Its a binary data
// We cant load DRACO models directly but we can use loader
const dracoLoader = new DRACOLoader(); 
// we can work without it
// BUT IT MAKES REALLY FAST COMPUTING AND DECOMPRESSIN MODELS
// We can use another thread for it
// For ThreeJs we can find code for that worker in
// node_modules/three/examples/[ls, lsx]/libs/draco
// copy it into static folder and it will be work much more faster
// to mdo that we needs to provide path to this folder for Decoder
// Its perfect because if we dont load draco models it dont starts to work
dracoLoader.setDecoderPath('/draco/');

// After that we have provide draco loader to gltfLoader
gltfLoader.setDRACOLoader(dracoLoader); 

// Also we can use ThreeJS editor to create or lock different models
// Its like tiny Blender in browser 

let mixer = null;
gltfLoader.load(
    // 'models/Duck/glTF-Draco/Duck.gltf',
    // 'models/Duck/glTF/Duck.gltf', //  path to model from static
    // 'models/FlightHelmet/glTF/FlightHelmet.gltf',
    'models/Fox/glTF/Fox.gltf',
    (gltf) => { //  success handler
        // if model have one children on scene we can load it like this
        // scene.add(gltf.scene.children[0]);

        // but if this is real model it will be have a lot of children
        // we cant add it in the loop because we will have strange result
        // objects from one scene will be removed into another scene
        // and loop will working wrong
        // but we can copy scene children arr
        // [...gltf.scene.children].forEach(child => scene.add(child));

        // if model has animations we can get to them in code 
        // it contains in animations app and each animation composed from different
        // ThreeJS AnimationClip classes/
        // It lick keyframes
        // But we need to play this keyframes so we will be use
        // AnimationMixer for that
        // (like player to play songs)
        mixer = new THREE.AnimationMixer(gltf.scene);

        // to create an action use clipAction method
        // it returns AnimationAction instance
        const action = mixer.clipAction(gltf.animations[1]);

        // to play action what we created
        action.play();
        gltf.scene.scale.set(0.025, 0.025, 0.025);
        // but also we can load the scene Group
        scene.add(gltf.scene);
    },
    () => { //  process handler

    },
    () => { //error handler

    }
);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer to see animations what we use
    mixer?.update(deltaTime);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()