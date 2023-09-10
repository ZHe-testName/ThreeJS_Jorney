import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/gradients/3.jpg');

const objectDistance = 4;

// it needs to explain ThreeJS and WebGL
// how to choose shadow gradient according to texture
texture.magFilter = THREE.NearestFilter;

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
		.onChange(() => {
			material.color.set(parameters.materialColor);
		});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Creating one example of material
// and use it for all geometries good for performance
const material = new THREE.MeshToonMaterial({ 
	color: parameters.materialColor,
	gradientMap: texture,
});

/**
 * Light
 */

const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 0);

scene.add(directionalLight);

/**
 * Objects
 */
const mesh1 = new THREE.Mesh(
	new THREE.TorusGeometry(1, 0.4, 16, 60),
	material
);

const mesh2 = new THREE.Mesh(
	new THREE.ConeGeometry(1, 2, 32),
	material
);

const mesh3 = new THREE.Mesh(
	new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
	material
);

mesh2.position.y = - objectDistance * 1;
mesh3.position.y = - objectDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3)

const meshesArray = [
	mesh1,
	mesh2,
	mesh3
];

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
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Particles
 */
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
	positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
	positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * meshesArray.length;
	positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
	color: parameters.materialColor,
	sizeAttenuation: true,
	size: 0.03,
});

const particles = new THREE.Points(
	particlesGeometry,
	particlesMaterial
);

scene.add(particles);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
		alpha: true, // make transparent canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
	scrollY = window.scrollY;

	const newSection = Math.round(scrollY / sizes.height);

	if (currentSection !== newSection) {
		currentSection = newSection;

		gsap.to(
			meshesArray[currentSection].rotation,
			{
				duration: 1.5,
				ease: 'power2inOut',
				x: '+=6',
				y: '+=3',
				z: '+=1.5',
			}
		);
	}
});

/**
 * Cursor
 */
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener('mousemove', e => {
	// dividing to get same value for different users
	// between 0 to 1

	//- 0.5 to get as positive as negative values
	cursor.x = e.clientX / sizes.width - 0.5;
	cursor.y = e.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
		// delta variable needs to make similar speed in screens with 
		// different frequency
		const deltaTime = elapsedTime - previousTime;
		previousTime = elapsedTime;

		// Animate camera
		camera.position.y = - scrollY / sizes.height * objectDistance;

		// * 0.5 make camera speed slower
		const paralaxX = cursor.x * 0.5;
		const paralaxY = - cursor.y  * 0.5;

		// Calculations to add camera position changing more smoothly effect
		cameraGroup.position.x += (paralaxX - cameraGroup.position.x) * 4 * deltaTime;
		cameraGroup.position.y += (paralaxY - cameraGroup.position.y) * 4 * deltaTime;

		// Animate meshes
		meshesArray.forEach(mesh => {
			mesh.rotation.x += deltaTime * 0.2;
			mesh.rotation.y += deltaTime * 0.12;
		});

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()