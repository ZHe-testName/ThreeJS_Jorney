import * as THREE from 'three';

const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#f35b45' })
);

roof.position.y = 3;
roof.rotation.y = Math.PI * 0.25;

export default roof;
