import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
//In this project i 1 ThreeJS unit scale === 1 meter for usability

const pi = Math.PI;

const houseBushes = [
    {
        scale: [0.5, 0.5, 0.5],
        position: [0.8, 0.2, 2.2],
    },
    {
        scale: [0.25, 0.25, 0.25],
        position: [0.4, 0.1, 2.1],
    },
    {
        scale: [0.4, 0.4, 0.4],
        position: [-0.8, 0.1, 2.2],
    },
    {
        scale: [0.15, 0.15, 0.15],
        position: [-1, 0.05, 2.6],
    },
    {
        scale: [0.4, 0.4, 0.4],
        position: [-2.2, 0.2, -1.7],
    },
    {
        scale: [0.2, 0.2, 0.2],
        position: [-1.9, 0.1, -2.1],
    },
    {
        scale: [0.35, 0.35, 0.35],
        position: [2.1, 0.1, -0.5],
    },
    {
        scale: [0.5, 0.5, 0.5],
        position: [2.2, 0.2, -1.4],
    },
    {
        scale: [0.2, 0.2, 0.2],
        position: [2.4, 0.1, -0.6],
    },
];

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

//Door Textures
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');

//Walls Textures
const wallColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const wallAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const wallNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const wallRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

//Grass Textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

//To reduce scale of texture we need do that with all textures
grassColorTexture.repeat.set(8, 8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8, 8);
grassNormalTexture.repeat.set(8, 8, 8);
grassRoughnessTexture.repeat.set(8, 8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// Temporary sphere
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial({ roughness: 0.7 })
// )
// sphere.position.y = 1
// scene.add(sphere)

//HOUSE*////////////
const house = new THREE.Group();
scene.add(house);

//WALLS*////////////
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        transparent: true,
        map: wallColorTexture,
        aoMap: wallAmbientOcclusionTexture,
        normalMap: wallNormalTexture,
        roughness: wallRoughnessTexture
    })
);

walls.geometry.setAttribute(
    'uv2', //name of new attribute
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2) //set coords of our texture
);

walls.position.y = 2.6 * 0.5;

house.add(walls);

//ROOF*////////////
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#f35b45' })
);

roof.position.y = 3;
roof.rotation.y = pi * 0.25;

house.add(roof);

//DOOR*////////////
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2, 2.2, 50, 50),
    new THREE.MeshStandardMaterial({
        transparent: true,
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    }),
);

door.geometry.setAttribute(
    'uv2', //name of new attribute
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2) //set coords of our texture
);

door.position.y = 1;
door.position.z = 2 + 0.01;

house.add(door);

//FLOOR*////////////
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughness: grassRoughnessTexture
    })
);

floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2) 
);

floor.rotation.x = - Math.PI * 0.5;
floor.position.y = 0;

floor.receiveShadow = true;

scene.add(floor);

//BUSHES*////////////
const houseBushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const houseBushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'});

const bushes = houseBushes.map(bush => {
    const bushMesh = new THREE.Mesh(
        houseBushGeometry,
        houseBushMaterial
    );

    bushMesh.scale.set(...bush.scale);
    bushMesh.position.set(...bush.position);

    return bushMesh;
});

house.add(...bushes);

//GRAVES*////////////
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 40; i++) {
    const grave = new THREE.Mesh(
        graveGeometry,
        graveMaterial,
    );

    //we need random set the graves position in round square

    //take random angle from 360
    const angle = Math.random() * Math.PI * 2;

    //set radius between ranges
    const radius = 3.3 + Math.random() * 6;

    //set position
    grave.position.x = Math.sin(angle) * radius;
    grave.position.z = Math.cos(angle) * radius;
    grave.position.y = 0.35;

    //set rotation
    grave.rotation.x = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    grave.castShadow = true;

    graves.add(grave);
};

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);

scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);

moonLight.position.set(4, 5, - 2);

gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001);

scene.add(moonLight);

//House LIght
const houseLight = new THREE.PointLight('#ff7d46', 1, 7);

houseLight.position.set(0, 2.2, 2.7);

house.add(houseLight);

//Axis Helper
// const axisHelper = new THREE.AxisHelper();
// scene.add(axisHelper);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
const ghost2 = new THREE.PointLight('#ffff00', 2, 3);
const ghost3 = new THREE.PointLight('#00ffff', 2, 3);

scene.add(ghost1, ghost2, ghost3);

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

moonLight.castShadow = true;
houseLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bushes.forEach(bush => bush.castShadow = true);

//optimization of shadows
houseLight.shadow.mapSize.width = 256;
houseLight.shadow.mapSize.height = 256;
houseLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;



/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    //Update ghosts
    const ghost1Angle = elapsedTime * 0.5;

    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;

    ghost1.position.y =  Math.sin(ghost1Angle * 3);

    const ghost2Angle = -elapsedTime * 0.32;

    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;

    ghost2.position.y =  Math.sin(ghost2Angle * 4) + Math.sin(ghost2Angle * 2.5);

    const ghost3Angle = -elapsedTime * 0.7;

    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(ghost3Angle * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(ghost3Angle * 0.5));

    ghost3.position.y =  Math.sin(ghost3Angle * 4) * Math.sin(ghost3Angle * 2.5);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();