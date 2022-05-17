import * as THREE from 'three';

import { Prop } from './Prop';

export enum RoomType {
  START = 'start-room',
  COMBAT_NORMAL = 'combat-normal',
  REST = 'rest-room',
  SHOP = 'shop-room',
}

/**
 * A room has its own scene containing all of the props in that room, spawn points and exits.
 */
export class Room {
  public scene = new THREE.Scene();
  public props: Prop[] = [];
  public playerSpawnPoint = new THREE.Vector3();

  constructor(public type: RoomType) {}

  public addProp(prop: Prop) {
    // Track props in this room
    this.props.push(prop);
    // Add to this room's scene
    this.scene.add(prop.model);
  }
}
