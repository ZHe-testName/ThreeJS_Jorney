import * as THREE from 'three';
import textureLoader from '../../textureLoader';

const windows = [];

//Window Textures
const windowColorTexture = textureLoader.load('/textures/windows/color.jpg');
const windowAmbientOcclusionTexture = textureLoader.load('/textures/windows/ambientOcclusion.jpg');
const windowNormalTexture = textureLoader.load('/textures/windows/normal.jpg');
const windowHeightTexture = textureLoader.load('/textures/windows/height.png');
const windowRoughnessTexture = textureLoader.load('/textures/windows/roughness.jpg');
const windowMetallicTexture = textureLoader.load('/textures/windows/metallic.jpg');

const windowGeometry = new THREE.BoxBufferGeometry(0.8, 1, 0.1, 10, 10);
const windowMaterial = new THREE.MeshStandardMaterial({color: '#000000'});
const windowTextureMaterial = new THREE.MeshStandardMaterial({
    map: windowColorTexture,
    aoMap: windowAmbientOcclusionTexture,
    normalMap: windowNormalTexture,
    displacementMap: windowHeightTexture,
    displacementScale: 0.01,
    metalnessMap: windowMetallicTexture,
    roughnessMap: windowRoughnessTexture,
}); 

for (let i = 0; i < 3; i++) {
    const window = new THREE.Mesh(
        windowGeometry,
        [
          windowMaterial,
          windowMaterial,
          windowMaterial,
          windowMaterial,
          windowTextureMaterial,
          windowMaterial
        ]
    );

    window.geometry.setAttribute(
      'uv2', 
      new THREE.Float32BufferAttribute(window.geometry.attributes.uv.array, 2)
    );

    windows.push(window);
};

const wy = 1.5 * 0.5 + 0.7;

windows[0].position.z = -2.001;
windows[0].position.y = wy;

windows[0].rotation.y = Math.PI;

windows[1].position.x = 2;
windows[1].position.y = wy;

windows[1].rotation.y = Math.PI * 0.5;

windows[2].position.x = -2.001;
windows[2].position.y = wy;

windows[2].rotation.y = -Math.PI * 0.5;

export default windows;