import * as THREE from 'three';
import textureLoader from '../../textureLoader';

// const roofColorTexture = textureLoader.load('/textures/roof/color.jpg');
// const roofAmbientOcclusionTexture = textureLoader.load('/textures/roof/ambientOcclusion.jpg');
// const roofNormalTexture = textureLoader.load('/textures/roof/normal.jpg');
// const roofRoughnessTexture = textureLoader.load('/textures/roof/roughness.jpg');
// const roofHeightTexture = textureLoader.load('/textures/roof/height.png');

// roofColorTexture.repeat.set(4, 4, 4);
// roofAmbientOcclusionTexture.repeat.set(4, 4, 4);
// roofNormalTexture.repeat.set(4, 4, 4);
// roofRoughnessTexture.repeat.set(4, 4, 4);
// roofHeightTexture.repeat.set(4, 4, 4);

// roofColorTexture.wrapS = THREE.RepeatWrapping;
// roofAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
// roofNormalTexture.wrapS = THREE.RepeatWrapping;
// roofRoughnessTexture.wrapS = THREE.RepeatWrapping;
// roofHeightTexture.wrapS = THREE.RepeatWrapping;

// roofColorTexture.wrapT = THREE.RepeatWrapping;
// roofAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
// roofNormalTexture.wrapT = THREE.RepeatWrapping;
// roofRoughnessTexture.wrapT = THREE.RepeatWrapping;
// roofHeightTexture.wrapT = THREE.RepeatWrapping;
// color: '#f35b45' 
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4, 24),
  new THREE.MeshStandardMaterial({
    // transparent: true,
    // map: roofColorTexture,
    // aoMap: roofAmbientOcclusionTexture,
    // normalMap: roofNormalTexture,
    // roughnessMap: roofRoughnessTexture,
    // roughness: 4,
    // displacementMap: roofHeightTexture,
    // displacementScale: 0.4,
    color: '#f35b45', 
  })
);

roof.position.y = 3;
roof.rotation.y = Math.PI * 0.25;

export default roof;
