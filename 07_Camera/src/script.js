import './style.css'
import * as THREE from 'three'
// import * as Geometry from ' three/jsm/deprecated/Geometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

const cursor = {
    x: 0,
    y: 0,
};

// window.addEventListener('mousemove', event => {
//     // We cant move camera for the mouse in pixels 
//     // because it will be very large format in our coords system
//     // coords of all field from right to left and from top to height
//     // must to be like 1 in THREE unites scale

//     // also useful had negative coords of render so in our case
//     // we can minus 0.5 
//     cursor.x = (event.clientX / sizes.width - 0.5);
//     cursor.y = -(event.clientY / sizes.height - 0.5);

// });

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height =  window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);

    // more than 2 pixel ratio its rely to much and dont need on any devices
    // we set it on resize handler because if user has 2 screens and switch
    // then we can set new pixel ratio of screen
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
    // this line of code its for fucked my ass Safari browser
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    !fullscreenElement
        ?
        canvas.requestFullscreen 
            ? 
            canvas.requestFullscreen() 
            : 
            canvas.webkitRequestFullscreen || canvas.webkitRequestFullscreen() //also for Safari
        :
        document.exitFullscreen
            ? 
            document.exitFullscreen()
            :
            document.webkitExitFullscreen || document.webkitExitFullscreen(); //All this shit due to Safari
});

// Scene
const scene = new THREE.Scene()

// We can create empty geometry and adding own vertices what we need
// const geometry = new Geometry(1, 2, 3);

// geometry.vertices.push(new THREE.Vector3(0, 0, 0));
// geometry.vertices.push(new THREE.Vector3(0, 1, 0));
// geometry.vertices.push(new THREE.Vector3(1, 0, 0));

// const face = new THREE.Face(1, 2, 3);
// geometry.faces.push(face);

// Float32Array US IT EVERYWHERE BECAUSE IT VERY EASY FOR COMPUTER TO HANDLE IT
// const positionArray = new Float32Array([
//     0, 0, 0, //init wit 3 vrtices position
//     0, 1, 0,
//     1, 0, 0 
// ]);

// for three js we need to convert buffer
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3); //(positionArray, step array length)

// creating geometry from buffer
const geometry = new THREE.BufferGeometry();
// geometry.setAttribute('position', positionAttribute); //(name of attr, buffer)

const count = 50;
const length = count * 3 * 3;
const positionArray = new Float32Array(length);

for (let i = 0; i < length; i++) {
    positionArray[i] = (Math.random() - 0.5) * 4;
};

const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry.setAttribute('position', positionAttribute);

// Object
const mesh = new THREE.Mesh(
    // new THREE.BoxBufferGeometry(1, 1, 1, 4, 4, 4),
    geometry,
    new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        wireframe: true,
    })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(
    75, //Field of view in degrees in vertical axis
    sizes.width / sizes.height, //aspect ratio ots width of render divide height of render
    0.1, //how close camera can see objects and objects can be visible
    100, //how far we can see an objects
)

// Orthographic Camera
// used for without perspective effect

// to now what position we need for our render we must to calculate aspect ratio
// it needs because -1 1 1 -1 its a rect and render field its not a rect
// const aspect = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//     -1 * aspect, //left
//     1 * aspect, //right
//     1, //top
//     -1, //bottom
//     0.1, //close visible
//     100, //far visible
// );
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
// camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
// we can add dumping its rely cool smooth control
controls.enableDamping = true;
// ...also in tick we need to update controls

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // camera.position.x = cursor.x;
    // camera.position.y = cursor.y;
    // camera.lookAt(mesh.position);

    // to rotate camera around cube we need to us trigonometry with cos and sin
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(mesh.position);
    controls.update();

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()