import * as THREE from 'three';

const graves = new THREE.Group();

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

export default graves