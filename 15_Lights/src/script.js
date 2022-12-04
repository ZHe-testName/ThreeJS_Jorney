import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui' 
//Lights cost a lot for GPU
//so nwe must use a loss lights as we can (no more 50)
//and try to use lights what costs less for memory
// new RectAreaLightHelper

//Minimal cost is
//Ambient Light
//Hemisphere Light

//Middle cost
//Directional Light
//PointLight

//Maximum cost
//Spot Light
//Rect Area Light

//Good idea its the bake light effects on textures in deferent programs

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
//Ambient Light its the basic light what comes from everywhere
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

//Directional Light its rays are parallel
// and lays in same direction
const directionLight = new THREE.DirectionalLight(0xff00ff, 0.6);
scene.add(directionLight);

//Hemisphere Light its like Ambient Light
//but we cen set gradient colors
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.6);
scene.add(hemisphereLight);

//Point light it light what illuminate rays in any direction
//from infinity small point
//we can control intensity and fading of rays  
const pointLight = new THREE.PointLight(0x00ff00, 0.6, 2, 1);
pointLight.distance = 10;
pointLight.decay = 0.9
pointLight.position.set(-1.5, -0.2, 1);
scene.add(pointLight);

//Rect Area Light its lice photo shots 
//its square what lay lights in deferent direction
//Works only with MeshStandardMaterial and MeshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight(
    0x00ff90,
    2,
    3,
    1,
);
scene.add(rectAreaLight);

//Spot Light its like a flashlight
//lights in conic direction from centre
const spotLight = new THREE.SpotLight(
    0x9900ff,
    1.3,
    8, //distance how far light get
    Math.PI * 0.1, //angle of spot
    0.25, //penumbra its bluring on light contact spots
    1 //decay its about how fast light going to limit
);
spotLight.position.set(0, 2, 3);
//we cant use lockAt with spot light
scene.add(spotLight);

//we cant tur light only like this
spotLight.position.x = -2.75;
//we must add a special object for this light to the scene
//it invisible but it help position our light
scene.add(spotLight.target);

//we can use light helpers to set position of our lights
//because lights are not visible
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight, //light instance must be right type
    0.3 //size
);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionLight, 
    0.3 
);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(
    pointLight, 
    0.3 
);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(
    spotLight, 
    0.3 
);
scene.add(spotLightHelper);

gui
    .add(spotLight.position, 'x')
    .min(-2)
    .max(2)
    .step(0.001);

gui
    .add(directionLight, 'intensity')
    .min(0)
    .max(1)
    .step(0.001);

gui
    .add(directionLight.position, 'x')
    .min(-2)
    .max(2)
    .step(0.001);

// const pointLight = new THREE.PointLight(0xffffff, 0.5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()

gui
    .add(material, 'roughness')
    .min(0)
    .max(1)
    .step(0.001);

 gui
    .add(material, 'metalness')
    .min(0)
    .max(1)
    .step(0.001);

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()