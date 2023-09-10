import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xff00ff, 0.6);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

let currentIntersect = null;
/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)
// RAYCASTER
// Raycaster - its a "rifle" what shooting the rays
// This rays fly and pass thro the objects on its way
// And we can tace information about object interaction with rays
// This info will be useful for bullet fly counting
// and other seems like this 

// To create raycaster
const raycaster = new THREE.Raycaster();

// coordinates of raycaster is a Vector3

// point in space where ray is started
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// // direction of the vector of the ray
// const rayDirection = new THREE.Vector3(10, 0, 0);
// // ALWAYS TRY TO NORMALIZE DIRECTION SCALE
// // Because after that any scale value will be scaled down or higher to 1
// // his is the best way to work with it
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);

// // Now we can get intersect or intersection object from this shooting ray
// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);
// In this objects we can find a lot of intersect information
// distance - between tho origin of the ray and collision point
// face - what face of geometry was hit bu the ray
// faceIndex - index of that face
// object - what object is concerned by the collision
// point - the Vector3 of the exact position of the collision on the object
// uv - uv coordinates of that geometry

// Raycaster is useful to detect mouse hovering on different objects
/**
 * Mouse
 */
const mouse = new THREE.Vector2();

// listener to detect hover events
window.addEventListener('mousemove', ev => {
    // To normalize min and max scale from pixels to -1 - 1
    // Use the formula
    mouse.x = ev.clientX / sizes.width * 2 - 1;
    mouse.y = - (ev.clientY / sizes.height) * 2 + 1;
});

// listener to detect click events
window.addEventListener('click', ev => {
    if (currentIntersect) {
        console.log('click to sphere');
    }
});


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
camera.position.z = 3
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

const gltfLoader = new GLTFLoader();

let model = null;
gltfLoader.load(
    '/models/Duck/glTF-Binary/Duck.glb',
    gltf => {
        model = gltf.scene;
        model.position.y = -1.2;
        scene.add(gltf.scene);
    }
);

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    // Spheres animate
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.2) * 1.5;

    // Cast a ray
    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(10, 0, 0);
    // rayDirection.normalize();

    // raycaster.set(rayOrigin, rayDirection);

    // Here we set raycaster according to the cursor position
    raycaster.setFromCamera(mouse, camera);

    const intersectObjects = [object1, object2, object3];

    const intersects = raycaster.intersectObjects(intersectObjects);
    // here we can detect the intersection of the objects with a ray
    intersectObjects.forEach(obj => {
        obj.material.color.set('#ff0000');
    });

    intersects.forEach(obj => {
        obj.object.material.color.set('#0000ff');
    });
    // MOUSELEAVE AND MOUSEENTER LISTENERS
    if (intersects.length) {
        if (currentIntersect === null) {
            console.log('mouse enter');
        }
        // first object in this array is current intersect
        currentIntersect = intersects[0];
    } else {
        if (currentIntersect) {
            console.log('mouse leave');
        }

        currentIntersect = null;
    };

    // Model intersect test
    if (model) {
        const modelIntersects = raycaster.intersectObject(model);

        if (modelIntersects.length) {
            model.scale.set(1.2, 1.2, 1.2);
        } else {
            model.scale.set(1, 1, 1);
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()