import * as THREE from 'three';

const houseLight = new THREE.PointLight('#ff7d46', 1, 7);

houseLight.position.set(0, 2.2, 2.7);

houseLight.castShadow = true;

//optimization of shadows
houseLight.shadow.mapSize.width = 256;
houseLight.shadow.mapSize.height = 256;
houseLight.shadow.camera.far = 7;

export default houseLight;
