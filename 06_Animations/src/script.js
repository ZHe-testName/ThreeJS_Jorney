import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//Animation
// In different computers different processors and animation speed
// Thats why we need to normalize animation speed to computer speed
// Because in different computers we will have different animation speed

//1 - First way is to remember in closer time out of tick function...
// let time = Date.now();

// 2 - Second way is to use THREE js clock
//it clock can to return elapsed time
// so use it
// const clock = new THREE.Clock();

//3 - Third its to use a library like GSAP
// Because its give more control with a lot of sings in large animations
gsap.to(mesh.position, { //method to provides to options number from and number to
    x: 2,                 //second option is an object with animation properties
    delay: 1,
    duration: 1,
});
gsap.to(mesh.position, {
    x: 0,                 
    delay: 2,
    duration: 2,
});

function tick() {
    // 1
    //...after check time in tick call
    // const currentTime = Date.now(),
    //     deltaTime = currentTime - time; //and find delta of this times

    // time = currentTime; //Don't forgot update time in closer for the next tick

    // mesh.rotation.x += 0.003 * deltaTime;
    // mesh.rotation.y += 0.001 * deltaTime;

    // 2
    // Take current pass elapsed time
    // const time = clock.getElapsedTime();
    // add to rotate
    // mesh.rotation.x = time;
    // To set speed rotate per second we can use formula
    // time * (Math.PI * 2) * rotations_per_sec_number
    // mesh.rotation.y = time * Math.PI * 2;

    // also we can use math for creating rotation animations simple
    // sin(angle) - is the sinusoide to start from 0 in coords x and y
    // cos(angle) - is the sinusoide to start from 1 in coords x and y
    // so we can make circle rotation
    // mesh.position.x = Math.sin(time);
    // mesh.position.y = Math.cos(time);

    // and camera to
    // camera.position.x = Math.sin(time);
    // camera.position.y = Math.cos(time);

    renderer.render(scene, camera);

    requestAnimationFrame(tick);
};

tick();