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

  private playerToProps(player: PlayerState, props: Prop[]) {}

  // private playerToProps(player: PlayerState, props: Prop[]) {
  //   // Reset
  //   player.fpsController.onGround = false;

  //   for (const prop of props) {
  //     // Player's feet to ground
  //     const propBox = new THREE.Box3().setFromObject(prop.model);
  //     const feetBox = new THREE.Box3().setFromObject(player.fpsController.feet);
  //     if (feetBox.intersectsBox(propBox)) {
  //       // // Get intersection depth
  //       // const depth = propBox.max.y - feetBox.min.y;
  //       // // Move upwards by depth
  //       // const moveStep = new THREE.Vector3(0, 1, 0).multiplyScalar(depth);
  //       // player.fpsController.moveBy(moveStep);
  //       // player.fpsController.dy = 0;
  //       // player.fpsController.onGround = true;

  //       // Intersection depth
  //       const intMin = new THREE.Vector3(
  //         Math.max(propBox.min.x, feetBox.min.x),
  //         Math.max(propBox.min.y, feetBox.min.y),
  //         Math.max(propBox.min.z, feetBox.min.z)
  //       );

  //       const intMax = new THREE.Vector3(
  //         Math.min(propBox.max.x, feetBox.max.x),
  //         Math.min(propBox.max.y, feetBox.max.y),
  //         Math.min(propBox.max.z, feetBox.max.z)
  //       );

  //       const intDepth = new THREE.Vector3().subVectors(intMax, intMin);

  //       // Collision normal - reverse of player's velocity normal
  //       const colNormal = player.fpsController.moveDirection.clone().multiplyScalar(-1);

  //       const moveStep = colNormal.multiply(intDepth);

  //       player.fpsController.moveBy(moveStep);

  //       // TODO - work out when hit the ground
  //       player.fpsController.dy = 0;
  //       player.fpsController.onGround = true;

  //       // Make Box3 from itnersection depth stuff
  //       // get its center
  //       // raycast from player center to box3 center
  //       // get ray.intersection.face.normal
  //       // use that instead of colNomral aboev
  //     }
  //   }
  // }
}
