import * as THREE from 'three';
import textureLoader from '../../textureLoader';

const basementColorTexture = textureLoader.load('/textures/basement/color.jpg');
const basementAmbientOcclusionTexture = textureLoader.load('/textures/basement/ambientOcclusion.jpg');
const basementNormalTexture = textureLoader.load('/textures/basement/normal.jpg');
const basementRoughnessTexture = textureLoader.load('/textures/basement/roughness.jpg');

basementColorTexture.repeat.set(4, 0.5, 4);
basementAmbientOcclusionTexture.repeat.set(4, 0.5, 4);
basementNormalTexture.repeat.set(4, 0.5, 4);
basementRoughnessTexture.repeat.set(4, 0.5, 4);

basementColorTexture.wrapS = THREE.RepeatWrapping;
basementAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
basementNormalTexture.wrapS = THREE.RepeatWrapping;
basementRoughnessTexture.wrapS = THREE.RepeatWrapping;

basementColorTexture.wrapT = THREE.RepeatWrapping;
basementAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
basementNormalTexture.wrapT = THREE.RepeatWrapping;
basementRoughnessTexture.wrapT = THREE.RepeatWrapping;

const texture = new THREE.MeshStandardMaterial({
  transparent: true,
  map: basementColorTexture,
  aoMap: basementAmbientOcclusionTexture,
  normalMap: basementNormalTexture,
  roughnessMap: basementRoughnessTexture,
  roughness: 0.7,
});
const material = new THREE.MeshStandardMaterial({color: '#000000'});

const basement = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4.2, 0.5, 4.2),
  [
    texture,
    texture,
    material,
    material,
    texture,
    texture,
  ]
);

basement.geometry.setAttribute(
  'uv2', 
  new THREE.Float32BufferAttribute(basement.geometry.attributes.uv.array, 2) 
);

basement.position.y = 0.5 * 0.5 - 0.01;

export default basement;
