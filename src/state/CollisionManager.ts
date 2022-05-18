import * as THREE from 'three';

import { PlayerState } from './PlayerState';
import { Prop } from './rooms/Prop';
import { Room } from './rooms/Room';

/**
 * Responsible for testing for collisions between various game objects
 */
export class CollisionManager {
  public checkCollisions(player: PlayerState, room: Room) {
    this.playerToProps(player, room.props);
  }

  private playerToProps(player: PlayerState, props: Prop[]) {
    // Reset
    player.fpsController.onGround = false;

    for (const prop of props) {
      // Player's feet to ground
      const propBox = new THREE.Box3().setFromObject(prop.model);
      const feetBox = new THREE.Box3().setFromObject(player.fpsController.feet);
      if (feetBox.intersectsBox(propBox)) {
        // Get intersection depth
        const depth = propBox.max.y - feetBox.min.y;
        // Move upwards by depth
        const moveStep = new THREE.Vector3(0, 1, 0).multiplyScalar(depth);
        player.fpsController.moveBy(moveStep);
        player.fpsController.dy = 0;
        player.fpsController.onGround = true;
      }
    }
  }
}
