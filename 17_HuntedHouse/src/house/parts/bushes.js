import * as THREE from 'three';
import { houseBushes } from '../../data';

const houseBushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const houseBushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'});

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