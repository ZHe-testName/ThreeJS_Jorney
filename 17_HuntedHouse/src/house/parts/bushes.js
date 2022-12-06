import * as THREE from 'three';
import { houseBushes } from '../../data';
import textureLoader from '../../textureLoader';

//Grass Textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

const houseBushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const houseBushMaterial = new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
    roughness: 1,
    metalness: 0.1
});

const bushes = houseBushes.map(bush => {
    const bushMesh = new THREE.Mesh(
        houseBushGeometry,
        houseBushMaterial
    );

    bushMesh.scale.set(...bush.scale);
    bushMesh.position.set(...bush.position);

    return bushMesh;
});

bushes.forEach(bush => bush.castShadow = true);

export default bushes;