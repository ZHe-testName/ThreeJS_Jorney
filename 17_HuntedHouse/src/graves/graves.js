import * as THREE from 'three';
import { Mesh } from 'three';

import textureLoader from '../textureLoader';

const graveColorTexture = textureLoader.load('/textures/grave/color.jpg');
const graveAmbientOcclusionTexture = textureLoader.load('/textures/grave/ambientOcclusion.jpg');
const graveNormalTexture = textureLoader.load('/textures/grave/normal.jpg');
const graveRoughnessTexture = textureLoader.load('/textures/grave/roughness.jpg');
// const graveHeightTexture = textureLoader.load('/textures/grave_hill/height.png');

const hillColorTexture = textureLoader.load('/textures/grave_hill/color.jpg');
const hillAmbientOcclusionTexture = textureLoader.load('/textures/grave_hill/ambientOcclusion.jpg');
const hillNormalTexture = textureLoader.load('/textures/grave_hill/normal.jpg');
const hillRoughnessTexture = textureLoader.load('/textures/grave_hill/roughness.jpg');
const hillHeightTexture = textureLoader.load('/textures/grave_hill/height.png');

const graves = new THREE.Group();

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.14);
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveAmbientOcclusionTexture,
    normalMap: graveNormalTexture,
    roughnessMap: graveRoughnessTexture,
    roughness: 6,
});

const graveHillGeometry = new THREE.SphereBufferGeometry(0.3, 24, 24);
const graveHillMaterial = new THREE.MeshStandardMaterial({
    transparent: true,
    map: hillColorTexture,
    aoMap: hillAmbientOcclusionTexture,
    normalMap: hillNormalTexture,
    roughnessMap: hillRoughnessTexture,
    roughness: 4,
    displacementMap: hillHeightTexture,
    displacementScale: 0.3,
});

for (let i = 0; i < 25; i++) {
    const grave = new THREE.Group();

    const graveMesh = new THREE.Mesh(
        graveGeometry,
        graveMaterial
    );

    const hillMesh = new Mesh(
        graveHillGeometry,
        graveHillMaterial
    ); 

    //we need random set the graves position in round square

    //take random angle from 360
    const angle = Math.random() * Math.PI * 2;

    //set radius between ranges
    const radius = 3.3 + Math.random() * 5;

    //set position
    grave.position.x = Math.sin(angle) * radius;
    grave.position.z = Math.cos(angle) * radius;
    grave.position.y = 0.35;

    //set rotation
    grave.rotation.x = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    // grave.castShadow = true;

    hillMesh.position.y = -0.5;
    hillMesh.position.z = 0.2;

    grave.add(graveMesh, hillMesh)
    graves.add(grave);
};

export default graves