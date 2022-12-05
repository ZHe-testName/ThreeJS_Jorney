import * as THREE from 'three';

import gui from '../gui';

const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);

moonLight.position.set(4, 5, - 2);

gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001);

moonLight.castShadow = true;

export default moonLight;