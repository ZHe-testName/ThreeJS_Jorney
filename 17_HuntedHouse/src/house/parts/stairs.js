import * as THREE from 'three';

import { houseStairs } from '../../data';

const stairs = new THREE.Group();

const stairsGeometry = new THREE.BoxBufferGeometry();
const stairsMaterial = new THREE.MeshStandardMaterial({
  color: '#ff6622'
});

houseStairs.forEach(item => {
  const stair = new THREE.Mesh(
    stairsGeometry,
    stairsMaterial
  );

  stair.scale.set(0.7, 0.2, item.deep);

  stair.position.y = item.yPosition;
  stair.position.z = item.zPosition;

  stairs.add(stair);
});

stairs.position.z = 2.4;

export default stairs;
