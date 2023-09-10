import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui' 
const gui = new dat.GUI()

//PARTICLES
//These Three Class used for creation of dust, fire, smoke, stars
//You can create thousands of them wITH REASONABLE frame rate
//Each particle composed of plane (2 triangles) always facing the camera

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/p1.jpg');

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffff77, 0.5);
const directionLight = new THREE.DirectionalLight(0xff00ff, 0.6);
scene.add(directionLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.6);
scene.add(hemisphereLight);

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

// To create particles we need also to use
// Any geometry
// Specific material
// And points instead of mesh

//Particles
// const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1, //each particle size
    sizeAttenuation: true, //it create perspective(if part far it will be small, if close - big)
});

// or we can set this props after instance created
// particlesMaterial.size = 0.02
// particlesMaterial.sizeAttenuation = true

//add texture to the particles material

//if use this way we will see that edges of each particle
//is hide another particle because texture is a picture
// particlesMaterial.map = particleTexture;

//to make edges transparent use alpha map
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
//but this way also with little bug
//edges still hide nearest particles
// there are different ways to fix it

// #1
// use alpha test
// it says to GPU that black pixels must be transparent
// particlesMaterial.alphaTest = 0.001;
// it really good and simple fix
// but it not perfect
// if we look closely we will see that some edges are still present
// because some of black pixels are not true black

// #2
// we can deactivate depth test
// then WebGL dont try to guess what of particle is closer
// and render it in direction what they was added
// particlesMaterial.depthTest = false;
// it looks good but it broken all scene when we add some one 
// another object to the scene

// #3
// The best way is to deactivate depth buffer
// To do that we tel WebGL dont check this buffer
// and result will be nice
particlesMaterial.depthWrite = false;

// ALL THIS WAYS DONT IMPACT PERFORMANCES HARDLY

// HERE ONE ANOTHER WAY TO SOLVE THAT PROBLEMS
// IS BLENDING
// ITS IMPACT PERFORMANCE
// With the blending we can tell WebGL to change color of the pixel
// when pixel is already drawn
particlesMaterial.blending = THREE.AdditiveBlending;
// in this way we tell WebGL to combine colors of lights of
// different objects and get a cool effect
// BUT THIS TECHNIC IMPACT PERFORMANCES
// and can be frame reit drop

// to alow different colors from our own colors buffer
particlesMaterial.vertexColors = true;

//Points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

//Custom Particles Geometry
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i <= count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
};

// set different positions of particles
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);

// set different colors of particles
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
);

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Objects
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

scene.add(cube)

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

    //Update particles
    // here we can simple update all particles geometry
    // rotation for example
    // particles.rotation.y = elapsedTime * 0.3;

    // but also we can update each of particle
    for (let i = 0; i < count; i++) {
        // this variable saved a number what includes
        //each vertex firs index in arr (x coord)
        //if we need y coord use (i3 + 1)...
        const i3 = i * 3;

        // every tick refresh y coord of each vertex
        // with x coord offset to get wave effect
        const x = particlesGeometry.attributes.position.array[i3 + 0];
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
        // but this is bad idea because if we would have a large arr of vertexes
        // it will be difficult to calculate for mobiles or old computers
    }

    // to see animation with position sya WebGL to refresh
    // new array of positions before render
    particlesGeometry.attributes.position.needsUpdate = true;

    // Update objects
    // cube.rotation.y = 0.1 * elapsedTime

    // cube.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()