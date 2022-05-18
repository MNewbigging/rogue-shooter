import * as THREE from 'three';

import { Prop } from './Prop';

/**
 * A block is a cuboid which the player can collide with. It could be used as flooring,
 * pillars or other obstacles.
 */
export class Block extends Prop {
  constructor(width: number, height: number, depth: number) {
    super();

    // Blocks use box geometry
    const geom = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshNormalMaterial();
    this.model = new THREE.Mesh(geom, mat);
  }

  public moveTo(pos: THREE.Vector3) {
    this.model.position.set(pos.x, pos.y, pos.z);
  }
}
