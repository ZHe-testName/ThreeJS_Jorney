import * as THREE from 'three';
import textureLoader from '../../textureLoader';

//Walls Textures
const wallColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const wallAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const wallNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const wallRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
      transparent: true,
      map: wallColorTexture,
      aoMap: wallAmbientOcclusionTexture,
      normalMap: wallNormalTexture,
      roughnessMap: wallRoughnessTexture,
      roughness: 0.7,
  })
);

walls.geometry.setAttribute(
  'uv2', //name of new attribute
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2) //set coords of our texture
);

walls.castShadow = true;

walls.position.y = 2.5 * 0.5;

export default walls;