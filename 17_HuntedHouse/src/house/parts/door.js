import * as THREE from 'three';
import textureLoader from '../../textureLoader';

//Door Textures
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');

const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.7, 1.7, 50, 50),
  new THREE.MeshStandardMaterial({
      transparent: true,
      map: doorColorTexture,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.2,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture
  }),
);

door.geometry.setAttribute(
  'uv2', //name of new attribute
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2) //set coords of our texture
);

door.position.y = 1.25;
door.position.z = 2 - 0.025;

export default door;