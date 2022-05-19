import * as THREE from 'three';

/**
 * A prop is a static object found in a room.
 */
export abstract class Prop {
  public model: THREE.Object3D;

  public get position() {
    return this.model.position;
  }
}
