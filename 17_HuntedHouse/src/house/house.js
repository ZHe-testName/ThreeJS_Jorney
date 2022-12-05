import * as THREE from 'three';

import basement from './parts/basement';
import walls from './parts/walls';
import bushes from './parts/bushes';
import door from './parts/door';
import windows from './parts/windows';
import roof from './parts/roof';
import houseLight from '../lights/houseLight';
import stairs from './parts/stairs';

const house = new THREE.Group();

house.add(
  basement, 
  stairs, 
  walls,  
  door, 
  roof, 
  houseLight, 
  ...windows,
  ...bushes
);

export default house;
