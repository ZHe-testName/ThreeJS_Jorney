import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import gui from './gui';

import house from './house/house';
import graves from './graves/graves';
import floor from './floor/floor';
import moonLight from './lights/moonLight';
import ghosts from './lights/ghosts';

//In this project i 1 ThreeJS unit scale === 1 meter for usability

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

//Fog
const fog = new THREE.Fog(
    '#262837', //color of fog
    1, //distance to nearest fog we see
    11, //distance how far from camera fog will de sean
);
scene.fog = fog;

scene.add(
    house, 
    graves, 
    floor, 
    moonLight, 
    ...ghosts
);


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);

scene.add(ambientLight);

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
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

controls.maxPolarAngle = Math.PI * 0.5 - 0.05;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//to set color of surroundings and hide edges of the scene
renderer.setClearColor('#262837');

//Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const [ghost1, ghost2, ghost3] = ghosts;

    const elapsedTime = clock.getElapsedTime();

    //Update ghosts
    const ghost1Angle = elapsedTime * 0.5;

    ghost1.position.x = Math.cos(ghost1Angle) * 3.4;
    ghost1.position.z = Math.sin(ghost1Angle) * 3.4;

    ghost1.position.y =  Math.sin(ghost1Angle * 3);

    const ghost2Angle = -elapsedTime * 0.32;

    ghost2.position.x = Math.cos(ghost2Angle) * 4;
    ghost2.position.z = Math.sin(ghost2Angle) * 4;

    ghost2.position.y =  Math.sin(ghost2Angle * 4) + Math.sin(ghost2Angle * 2.5);

    const ghost3Angle = -elapsedTime * 0.7;

    ghost3.position.x = Math.cos(ghost3Angle) * (6.5 + Math.sin(ghost3Angle * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (6.5 + Math.sin(ghost3Angle * 0.5));

    ghost3.position.y =  Math.sin(ghost3Angle * 4) * Math.sin(ghost3Angle * 2.5);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();