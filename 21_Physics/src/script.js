import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

// PHYSICS

// To make physics in ThreeJS world
// We can use Raycaster and work and create
// a lot of physical scales
// (gravity, resistance, speed,.. etc)

// But instead of that better use libraries
// (Cannon, Aimmo)
// For different situations we have 2D and 3D libs
// In the both we can calculate physical things for our
// ThreeJs word and apply it into it

// It not necessary to use 3D libs for 3D word in ThreeJS
// Depend of situation, you can use and 2D libs to

// To calculate collisions CANNON use different strategies
// It calls Broadphaces
// Some of them a better for performance so in some cases we can change it
// NaiveBroadphace - calculate all Bodies with all Bodies
// It means that every time it will be recalculated every Body in the physics world
// It is default strategy and most hard for computer
//  GridBroadphace - quadrilles the world and calculate only
// Bodies in same or nearest cell, not more
// It much better for performance but bugs can happen
// Like one body throw down another body
// SAPBroadphase(Sweep And Prune) - tests Bodies on arbitrary axes during
//  multiplies steps
// I dont know what it means 
// But its a better way to save performance
// But bugs still can happen when bodies moving with high speed 

// Constraint can be helpful read doc
//Examples
// schteppe.github.io/cannon.js
// To improve performance we can use Workers
// Multi thread JS
//Also IMPORTANT!!!
// CANNON JS dont updates long of time
// so some people improve that and call CANNON-ES
// use as npm package
// Other libs for physics
// AMMO, PHYSIJS

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {};

debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: Math.floor((Math.random() - 0.5) * 3),
            y: Math.floor(Math.random() * 5),
            z: Math.floor((Math.random() - 0.5) * 3),
        }
    );
};

debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: Math.floor((Math.random() - 0.5) * 3),
            y: Math.floor(Math.random() * 5),
            z: Math.floor((Math.random() - 0.5) * 3),
        }
    );
};

gui.add(debugObject, 'createSphere');
gui.add(debugObject, 'createBox');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
]);

/**
 * Sounds
 */
// Adding sound play function for collisions
const hitSound = new Audio('/sounds/hit.mp3');

function playSound(event) {
    // To prevent playing sound each collision
    // only strength collision we can detect the force level in event object
    const collisionStrength = event.contact.getImpactVelocityAlongNormal();

    if (collisionStrength >= 1.5) {
        // set time to 0 because we need to stop previous playing
        hitSound.currentTime = 0;
        // Add randomness t sound each play
        hitSound.play();
    }
};

// Material
// Material in CANNON is not the same as ThreeJS
// This is only links to associate each material with body
// const concreteMaterial = new CANNON.Material('concrete');
// const plasticMaterial = new CANNON.Material('plastic'); // passed name might be any

// But also we can create one default material
// if projects alow
//  and use it for different bodies
const defaultMaterial = new CANNON.Material('default');

/**
 * Physics
 */
// In this way we cen create the world and add gravity inside
// Empty world has no any physical scales
// Gravity value is almost the same like Vector3 in ThreeJS
// But here it calls Vec3 
//World
const world = new CANNON.World();

// Change Broadphase
world.broadphase = new CANNON.SAPBroadphase(world);

// ANOTHER WONDERFUL WAY TO FORCE PERFORMANCE A LOT
// Its allow CANNON to make sleepy Bodies
// It means that Bodies what have e very small speed became a Sleepy state
// and they dont be calculated in each time
// Bur some Body push it awaked and will works fine
// To add this
world.allowSleep = true; 

world.gravity.set(0, - 9.82, 0);

/**
 * Utils
 */
const spheresToUpdates = [];
const boxesToUpdates = [];

const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2,
    envMap: environmentMapTexture,
});

// Function to create boxes automatic
function createBox(width, height, depth, position) {
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    );

    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);

    scene.add(mesh);

    const shape = new CANNON.Box(new CANNON.Vec3(
        width * 0.5,
        height * 0.5,
        depth * 0.5
    ));

    const body = new CANNON.Body({
        mass: 2,
        material: defaultMaterial,
        position: new CANNON.Vec3(0, 4, 0),
        shape,
    });

    body.position.copy(position);

    boxesToUpdates.push({
        mesh,
        body,
    });
    // Adding event listener
    body.addEventListener('collide', playSound);

    world.addBody(body);
};

// Function for automatic creation of spheres
function createSphere(radius, position) {
    // ThreeJS mesh
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    );
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);

    scene.add(mesh);

    //Cannon body
    const shape = new CANNON.Sphere(radius);

    const body = new CANNON.Body({
        mass: 1,
        material: defaultMaterial,
        position: new CANNON.Vec3(0, 5, 0),
        shape,
    });
    body.position.copy(position);

    spheresToUpdates.push({
        mesh,
        body,
    });
    body.addEventListener('collide', playSound);

    world.addBody(body);
};

//To explain CANNON how they must interact with each other
//needs to use ContactMaterial
// in situations when they contact
// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial,
//     plasticMaterial,
//     {
//         friction: 0.1,
//         restitution: 0.7,
//     }
// );

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7,
    }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// Bodies
// Like Mesh in ThreeJS
// In Cannon we have Body
// we can throw a lot of parameters to it
// But at first we have to create shape (Sphere, Cube..) of the Body
// Like Geometry in ThreeJS

// Sphere creating
// Constructor takes one par = radius
// const sphereShape = new CANNON.Sphere(0.5); 
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 5, 0),
//     shape: sphereShape,
//     // material: plasticMaterial, if we create default material and want use by default in body we dont need this prop 
// });
// To apply force to each body we can use addForce()
// It the same like push body with some force
// 1 call of method make one push with setted parameters
// sphereBody.applyLocalForce(
//     new CANNON.Vec3(150, 0, 0), //direction and power
//     new CANNON.Vec3(0, 0, 0) // coordinates on body where force is apply
// ); 
// world.addBody(sphereBody);

// Floor creating
const planeShape = new CANNON.Plane(); 
const planeBody = new CANNON.Body();

// mass = 0 says to CANNON that this body dont move
planeBody.mass = 0;
// planeBody.material = concreteMaterial;
planeBody.addShape(planeShape);

// rotation in CANNON is not similar as ThreeJS
// To rotate some body we need to "insert" axis
// and rotate it wit the special method
planeBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
);
world.addBody(planeBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
);
floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);

debugObject.resetAll = () => {
  boxesToUpdates.forEach(box => {
    world.removeEventListener('collide', playSound);
    world.removeBody(box.body);

    scene.remove(box.mesh);
  }); 
  
  spheresToUpdates.forEach(sphere => {
    world.removeEventListener('collide', playSound);
    world.removeBody(sphere.body);

    scene.remove(sphere.mesh);
  }); 

  boxesToUpdates.splice(0, boxesToUpdates.length);
  spheresToUpdates.splice(0, spheresToUpdates.length);
};
gui.add(debugObject, 'resetAll');

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;

    oldElapsedTime = elapsedTime;

    // Physics world updating
    // make wind effect for sphere body
    // sphereBody.applyForce(
    //     new CANNON.Vec3(- 0.5, 0, 0),
    //     sphereBody.position
    // );

    // To update CANNON world we need to call
    // .step() method
    // firs par = fps
    // second par = time from last frame
    // third par = attempts when error
    world.step(1 / 60, deltaTime, 3);

    //  Updating spheres
    spheresToUpdates.forEach(obj => {
        obj.mesh.position.copy(obj.body.position);
    });

    //  Updating boxes
    boxesToUpdates.forEach(obj => {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
    });

    // In this lib we can pass some values to ThreeJS
    // and back
    // Because some things is the similar
    // sphere.position.copy(sphereBody.position);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();