import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui' 
const gui = new dat.GUI({
	width: 360,
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/p3.jpg');

const galaxyParameters = {
  count: 10000, // amount of stars
  size: 0.02, // size of each particle
	radius: 5, // radius of galaxy
	branches: 3, // amount of galaxy branches
	spin: 1, // spin of branches
	randomness: 0.2, // randomness stars spread parameter
	randomnessPower: 4, // randomness pow number to control star position according to center of branch in each branch
	insideColor: '#ff6030', // color of starts closer to the centre of galaxy
	outsideColor: '#1b3984', // color of starts far of the centre of galaxy
};

gui
  .add(galaxyParameters, 'count')
	.min(100)
	.max(100000)
	.step(100)
	.onFinishChange(() => createGalaxy(galaxyParameters));

gui
  .add(galaxyParameters, 'size')
	.min(0.001)
	.max(0.1)
	.step(0.001)
	.onFinishChange(() => createGalaxy(galaxyParameters));

gui
  .add(galaxyParameters, 'radius')
	.min(1)
	.max(20)
	.step(1)
	.onFinishChange(() => createGalaxy(galaxyParameters));

gui
  .add(galaxyParameters, 'branches')
	.min(2)
	.max(20)
	.step(1)
	.onFinishChange(() => createGalaxy(galaxyParameters));

gui
  .add(galaxyParameters, 'spin')
	.min(-5)
	.max(5)
	.step(0.01)
	.onFinishChange(() => createGalaxy(galaxyParameters));

gui
  .add(galaxyParameters, 'randomness')
	.min(0)
	.max(2)
	.step(0.001)
	.onFinishChange(() => createGalaxy(galaxyParameters));

gui
  .add(galaxyParameters, 'randomnessPower')
	.min(1)
	.max(10)
	.step(0.001)
	.onFinishChange(() => createGalaxy(galaxyParameters));

gui
  .addColor(galaxyParameters, 'insideColor')
	.onFinishChange(() => createGalaxy(galaxyParameters));

gui
  .addColor(galaxyParameters, 'outsideColor')
	.onFinishChange(() => createGalaxy(galaxyParameters));

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffff77, 0.5);
// const directionLight = new THREE.DirectionalLight(0xff00ff, 0.6);
scene.add(ambientLight);

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.6);
// scene.add(hemisphereLight);

/**
 * Objects
 */
let galaxyMaterial = null;
let galaxyParticlesGeometry = null;
let galaxy = null;

/**
 * Galaxy
 */
function createGalaxy(params) {
	if (galaxy !== null) {
		//dispose method remove material and geometry fro GPU 
		galaxyMaterial.dispose();
		galaxyParticlesGeometry.dispose();

		scene.remove(galaxy);
	}

	// Material
	galaxyMaterial = new THREE.PointsMaterial({
		size: params.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
	});
	// galaxyMaterial.alphaMap = particleTexture;

	//Geometry
	galaxyParticlesGeometry = new THREE.BufferGeometry();

	const starsPositionsArray = new Float32Array(params.count * 3);
	const colorsArray = new Float32Array(params.count * 3);

	const insideColor = new THREE.Color(galaxyParameters.insideColor);
	const outsideColor = new THREE.Color(galaxyParameters.outsideColor);

	for (let i = 0; i < params.count; i++) {
		const i3 = i * 3;
		// POSITION

		// radius of each star
		const radius = Math.random() * galaxyParameters.radius;
		// setting of angle of branches
		const branchAngle = (i % galaxyParameters.branches) / galaxyParameters.branches * Math.PI * 2;
		// spin angle of each star
		// more far star from centre is more angle will be here
		const spinAngle = radius * galaxyParameters.spin; 

		const randomX = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
		const randomY = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
		const randomZ = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

		// we touch only x and z coords because we dont needs y elevation
		starsPositionsArray[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
		starsPositionsArray[i3 + 1] = randomY;
		starsPositionsArray[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

		// COLOR

		// we can mix the colors of stars
		// but for that we need to mace a clone of basic color
		// because color in lerp func will be changed
		const mixedColor = insideColor.clone();

		// read dox about this method
		mixedColor.lerp(outsideColor, radius / galaxyParameters.radius);

		colorsArray[i3] = mixedColor.r;
		colorsArray[i3 + 1] = mixedColor.g;
		colorsArray[i3 + 2] = mixedColor.b;
	}

	galaxyParticlesGeometry.setAttribute(
		'position',
		new THREE.BufferAttribute(starsPositionsArray, 3)
	);

	galaxyParticlesGeometry.setAttribute(
		'color',
		new THREE.BufferAttribute(colorsArray, 3)
	);

	galaxy = new THREE.Points(galaxyParticlesGeometry, galaxyMaterial);
	scene.add(galaxy);
};

createGalaxy(galaxyParameters);

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