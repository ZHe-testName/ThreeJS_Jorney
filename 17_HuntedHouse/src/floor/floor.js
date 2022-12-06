import * as THREE from 'three';
import textureLoader from '../textureLoader';

//Grass Textures
const groundColorTexture = textureLoader.load('/textures/ground/color.jpg');
const groundAmbientOcclusionTexture = textureLoader.load('/textures/ground/ambientOcclusion.jpg');
const groundNormalTexture = textureLoader.load('/textures/ground/normal.jpg');
const groundRoughnessTexture = textureLoader.load('/textures/ground/roughness.jpg');

//To reduce scale of texture we need do that with all textures
groundColorTexture.repeat.set(8, 8, 8);
groundAmbientOcclusionTexture.repeat.set(8, 8, 8);
groundNormalTexture.repeat.set(8, 8, 8);
groundRoughnessTexture.repeat.set(8, 8, 8);

groundColorTexture.wrapS = THREE.RepeatWrapping;
groundAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
groundNormalTexture.wrapS = THREE.RepeatWrapping;
groundRoughnessTexture.wrapS = THREE.RepeatWrapping;

groundColorTexture.wrapT = THREE.RepeatWrapping;
groundAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
groundNormalTexture.wrapT = THREE.RepeatWrapping;
groundRoughnessTexture.wrapT = THREE.RepeatWrapping;


const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
      map: groundColorTexture,
      aoMap: groundAmbientOcclusionTexture,
      normalMap: groundNormalTexture,
      roughnessMap: groundRoughnessTexture,
      roughness: 1,
      metalness: 0.1
  })
);

floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2) 
);

floor.rotation.x = - Math.PI * 0.5;
floor.position.y = 0;

floor.receiveShadow = true;

export default floor;