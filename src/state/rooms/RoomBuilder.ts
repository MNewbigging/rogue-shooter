import * as THREE from 'three';

import { Block } from './Block';
import { Room, RoomType } from './Room';

/**
 * Responsible for procedurally generating a room of a given type.
 */
export class RoomBuilder {
  public buildRoom(type: RoomType) {
    switch (type) {
      case RoomType.START:
        return this.buildStartRoom();
    }
  }

  private buildStartRoom() {
    const room = new Room(RoomType.START);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    room.scene.add(ambientLight);

    // Floor
    const floor = new Block(40, 0.1, 40);
    room.addProp(floor);

    // Blocks
    const block = new Block(3, 1, 3);
    block.moveTo(new THREE.Vector3(0, 1.5, -5));
    room.addProp(block);

    const b2 = new Block(10, 1, 10);
    b2.moveTo(new THREE.Vector3(0, 0.5, -5));
    room.addProp(b2);

    // Player spawn point
    room.playerSpawnPoint = new THREE.Vector3(0, 2, -5);

    return room;
  }
}
