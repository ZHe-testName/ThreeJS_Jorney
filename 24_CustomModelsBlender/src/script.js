import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'lil-gui'

// BLENDER
// Its a free 3D creation software
// Areas in blender have twigs in left-top corner

// By default we have 4 areas
// 3D Viewport
// Timeline for animations
// Outliner - its like scene structure
// Properties area

////////

// Areas are sencetive to shotcats
// Shortcats might be deferent for different areas
// Mode sencitive

///////

// Some shortcats

// Create new obj - shift + A
// Orbit rotation of camera - Mouse wheel press + mouse move
// Truck and pedstal of camera -  Shift + Mouse wheel press + mouse move
// Dolly - Mouse wheel rotation
// left and right camera rotation - Shift + ` + mouse move
// Find yourself - Shift + C
// Move back to the object selection history - Ctrl + Z
// Select all objects - Ctrl + A
// Unselect all objects - Ctrl + A(double click)
// Choose camera view - 0 on numpad
// Change axes - 1, 3, 7 on numpad
// Get into view selected object - Ctrl + ,(or del) on numpad 
// Delete selected object - X
// Reopen panel with object crating settings after it lose focus - f9(dont work if another object was selected)
// Select multiple objects - Shift + left click on object
// Hide all objects and focus on selected - / on numpad
// Hide selected object - H
// Show back selected object -Alt + H
// Hide all objects instead selected - Shift + / on numpad
// Show/hide interaction menu - T
// three next shortcats called transformations
// to use only one axis after mode keypress button
// (G, R, S) press name of axis you want (X, Y, Z)
// To exclude axis and move only to another 
// Press - Shift + name of axis you want (X, Y, Z)
// Move object to any place on scene - G + mousemove (left click to save, right click to return back)
// Rotate object - R + mousemove
// Scale object - S + mousemove
// Duplicate object - Shift + D

// Shading menu - Z
// Mode menu - Ctrl + Tab
// To cut object with loop cut - Ctrl + R
// Proportional editing for changeing coordinates of verticies - O
// We can set curve in menu

// SHADING
// Shading - its how we see obj on scene

// IMPORTANT RECOMMENDATION
// Always try scale objects in Blender in edit mode
// It prevent many problems in ThreeJS after import
// In this mode object will change size but not a scale

// Try to create things from cube mesh
// Because in edit mode we can play with it very easy
// Just add modifies and smoothing to create sphere 

// Blender save current file and backup file 
// Its normal behavior for case when something went wrong with
// Main file 

// To add subdivision chose object
// Click on subdivision
// Dont touch nothing)
// Chose appeared menu and set object

// FORMAT OF MODEL FOR THREE JS IS gltf 2.0 
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
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
    '/models/hamburger.glb',
    (gltf) =>
    {
        scene.add(gltf.scene)
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
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
camera.position.set(- 8, 4, 8)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1, 0)
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

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()