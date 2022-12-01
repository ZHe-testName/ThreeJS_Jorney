import './style.css';
import * as THREE from 'three';
import { MathUtils } from 'three';

//Scene
const scene = new THREE.Scene();

//Red Cube
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({color: 0xff0000});
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

//Group
const group = new THREE.Group(); //Create group of any other mesh object for moving/scale/rotate it in same axis
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry,
  new THREE.MeshBasicMaterial({color: 0xff0000}),
);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry,
  new THREE.MeshBasicMaterial({color: 0x00ff00}),
);
cube2.position.x = -2;
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry,
  new THREE.MeshBasicMaterial({color: 0x0000ff}),
);
cube3.position.x = 2;
group.add(cube3);
group.position.y = 2;
group.rotateY(Math.PI * 0.25);

const axisHelper = new THREE.AxesHelper(); //display axis of environment, it is very helpful
scene.add(axisHelper);                     //length of each axis is 1 unit of all length
                                          //THREE.AxesHelper() can take argument of axis length value in units
// mesh.position.x = 0.7;
// mesh.position.y = -0.5;
// mesh.position.z = 1;
// mesh.position.set(0.7, 0, 1); //set all coordinates at once;

// mesh.scale.x = 0.7;
// mesh.scale.y = -0.5;
// mesh.scale.z = 1;
// mesh.scale.set(2, 0.5, 0.5); //set all scales at once;

//Rotation
// mesh.rotation.reorder('YXZ')
// mesh.rotation.x = Math.PI * 0.25 //Math.PI is the half of turn and equ 188 degries
// mesh.rotation.y = Math.PI * 0.25

//Sizes
const sizes = {
  width: 800,
  height: 600,
};

//Camera
const camera = new THREE.PerspectiveCamera(
  75, //Viewport angel
  sizes.width / sizes.height, //Aspect Ratio
);
camera.position.z = 4;
camera.position.x = 0;
camera.position.y = 0;
scene.add(camera);

// console.log(mesh.position.length()); //from centre of scene to centre of mesh
// console.log(mesh.position.distanceTo(camera.position)); //from camera to centre of mesh
// mesh.position.normalize(); //make position.length === 1

// camera.lookAt(mesh.position); //focus camera on coordinates to focus on some object we can do like this 

//Renderer
const canvas = document.querySelector('.webjl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
