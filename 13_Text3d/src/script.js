import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
//https://gero3.github.io/facetype.js/
//we can create font here

//also we can load fontface from three

//also we can store used facetypes in static folder
// also good practice is add license in that folder
//because facetypes in THREE.JS is not typical web fonts
//its an object with a lot of fields

//for loading fonts we need to use FontLoader
const fontLoader = new FontLoader();
//but we cant use loaded fonts like textures
//because its async operation
//so we pass callback into load method
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json', //path to fontface
    //here is call back that will be triggered after font loaded
    (font) => { //first arg is would be loaded font object
        //here we can create and add something to the scene
        const textGeometry = new TextGeometry(
            'Zhen*She', //here our text what will be render
            { //object with a lot of settings
                font, //loaded font
                size: 0.5,
                height: 0.2,
                //in segments parts we can optimize render
                //because its hard for computer work with 3d text 
                //especially with a lot of segments during the curve...
                curveSegments: 4,
                bevelEnabled: true, //bevel - скос, фаска, заокруглення
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                //... and bevel
                bevelSegments: 3,
            }
        );

        //by default we have sphere bounding bat it harder for computer then box
        //so we can change this to optimize program for text geometry
        // textGeometry.computeBoundingBox();
        // //after that we have ability to use Box3 coordinates of mesh wrap

        // // if we want to position our shape we must move geometry not mesh
        // //because we want to save boundings to axis rotation
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // );

        //but we can center our shape mush easier...))
        textGeometry.center();
        
        const text = new THREE.Mesh(
            textGeometry,
            material
        );
        scene.add(text);
    }
);

//all objects in ThreeJS are wrapped into "boxes" and "spheres"
//to easier calculation position our mesh on scene and camera direction
//it calls
//BOX AND SPHERE BOUNDING

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapMaterial = textureLoader.load('/textures/matcaps/5.png');

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

// const axisHelper = new THREE.AxisHelper();
// scene.add(axisHelper);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

//IMPORTANT
//WE MUST CREATE MATERIAL AND GEOMETRIES OUTSIDE OF LOOP
//IT VERY GOOD PRACTICE FOR OPTIMIZATION
const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
const material = new THREE.MeshMatcapMaterial({
    matcap: matcapMaterial,
});

for (let i = 0; i < 300; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random()

    donut.scale.set(scale, scale, scale);

    scene.add(donut);
};

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()