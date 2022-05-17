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
    const floor = new Block(2, 0.1, 2);
    room.addProp(floor);

    // Player spawn point
    room.playerSpawnPoint = new THREE.Vector3(0, 0.3, 0);

    return room;
  }
}
