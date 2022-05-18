import * as THREE from 'three';

import { PlayerState } from './PlayerState';
import { Prop } from './rooms/Prop';
import { Room } from './rooms/Room';

/**
 * Responsible for testing for collisions between various game objects
 */
export class CollisionManager {
  public checkCollisions(player: PlayerState, room: Room) {
    //this.playerToProps(player, room.props);
  }

  private playerToProps(player: PlayerState, props: Prop[]) {
    // Handles player gravity
    player.fpsController.gravity = -0.01;

    for (const prop of props) {
      // Test intersection with player's feet
      const propBox = new THREE.Box3().setFromObject(prop.model);
      const feetBox = new THREE.Box3().setFromObject(player.fpsController.feet);

      if (feetBox.intersectsBox(propBox)) {
        console.log('intersects');
        // Ignore gravity this frame
        player.fpsController.gravity = 0;
        // Need to move player up outside of intersect radius
      }
    }
  }
}
