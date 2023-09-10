import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

// REALISTIC RENDER

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl');

const debugObject = {
    envMapIntensity: 3,
};

// Loaders
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

gltfLoader.load(
    '/models/hamburger.glb',
    gltf => {
        gltf.scene.scale.set(0.3, 0.3, 0.3);
        gltf.scene.position.set(0, -1, 0);
        gltf.scene.rotation.y = Math.PI * 0.5;

        scene.add(gltf.scene);

        gui
            .add(gltf.scene.rotation, 'y')
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.001)
            .name('rotationY');

        updateMaterials();
    }
);

// Scene
const scene = new THREE.Scene()

// Functions
function updateMaterials() {
    // this method call callback for all children on the scene
    scene.traverse(child => {
        if (child instanceof THREE.Mesh
            && child.material instanceof THREE.MeshStandardMaterial){
                // child.material.envMap = environmentMap;
                child.material.envMapIntensity = debugObject.envMapIntensity;
                child.material.needsUpdate = true;

                // bad for preformance
                child.castShadow = true;
                child.receiveShadow = true;
            }
    });
};

// Light
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
// increase the resolution of shadow mar (default 512)
directionalLight.shadow.mapSize.set(1024, 1024);
// to prevent casting shadows to itself ba objects
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

// const directionalLightCameraHelper = new THREE.CameraHelper(
//     directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraHelper);

gui
    .add(directionalLight, 'intensity')
    .min(0)
    .max(10)
    .step(0.001)
    .name('lightIntensity');

gui
    .add(directionalLight.position, 'x')
    .min(-5)
    .max(5)
    .step(0.001)
    .name('lightX');

gui
    .add(directionalLight.position, 'y')
    .min(-5)
    .max(5)
    .step(0.001)
    .name('lightY');

gui
    .add(directionalLight.position, 'z')
    .min(-5)
    .max(5)
    .step(0.001)
    .name('lightZ');

gui
    .add(debugObject, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .name('envMapIntens')
    .onChange(updateMaterials);

/**
 * Maps
 */
const environmentMap = cubeTextureLoader.load([
    'textures/environmentMaps/2/px.jpg',
    'textures/environmentMaps/2/nx.jpg',
    'textures/environmentMaps/2/py.jpg',
    'textures/environmentMaps/2/ny.jpg',
    'textures/environmentMaps/2/pz.jpg',
    'textures/environmentMaps/2/nz.jpg'
]);
// to change default (THREE.LinearEncoding) settings of map to sRGB
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
// set material to all meshes what can support this map
scene.environment = environmentMap;

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // to remove steirs effect
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// to say THREEJS to use physical light scales
renderer.physicallyCorrectLights = true;

// To add realistic change default (THREE.LinearEncoding)
// to THREE.sRGBEncoding(outputColorSpace) for renderer
renderer.outputEncoding = THREE.sRGBEncoding;

// We can use tone mapping to process HDR values to LDR values
// even it all looks normal
// it not for what tone mapping use but it looks cool
// TONEMAP ALGORITHMS IN THREE JS
// THREE.NoToneMapping (default)
// THREE.LinearToneMapping
// THREE.ReinhardToneMapping
// THREE.CineonToneMapping
// THREE.ACESFilmicToneMapping
// to use it
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// To control tone map light exposure
renderer.toneMappingExposure = 2.5;

gui.add(renderer, 'toneMapping', {
    no: THREE.NoToneMapping,
    linear: THREE.LinearToneMapping,
    reinhard: THREE.ReinhardToneMapping,
    cineonToneMapping: THREE.CineonToneMapping,
    filmic: THREE.ACESFilmicToneMapping,
})

gui
    .add(renderer, 'toneMappingExposure')
    .min(0)
    .max(10)
    .step(0.001)
    .name('toneMappingExposure');
/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()