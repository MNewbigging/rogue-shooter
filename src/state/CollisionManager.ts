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
    // Broad phase first - AABB intersections
    const hitProps: Prop[] = [];
    const playerBox = new THREE.Box3().setFromObject(player.fpsController.collider);

    for (let i = 0; i < props.length; i++) {
      const propBox = new THREE.Box3().setFromObject(props[i].model);
      if (playerBox.intersectsBox(propBox)) {
        hitProps.push(props[i]);
      }
    }

    // No AABB intersections; stop
    if (!hitProps.length) {
      return;
    }

    // Narrow phase - raycast
    for (let i = 0; i < hitProps.length; i++) {
      // 1. Get the capsule's inner line from tip to base (minus radiush)
      // https://wickedengine.net/2020/04/26/capsule-collision-detection/
      // A capsule is a bunch of spheres strung out on a line running from capsule tip to base
      const capTip = player.fpsController.collider.position.clone().setY(playerBox.max.y);
      const capBase = player.fpsController.collider.position.clone().setY(playerBox.min.y);

      // Inset the points above to be one sphere's radius inside the tip/base
      capTip.y -= player.fpsController.radius;
      capBase.y += player.fpsController.radius;

      const capLine = new THREE.Line3(capTip, capBase);

      // 2. Find the nearest point on the capsule tip-base center line to the hitProp
      // Ideally, would use actual intersection point, but AABB doesn't give us that
      const closest = new THREE.Vector3();
      capLine.closestPointToPoint(hitProps[i].position, true, closest);

      // 3. Use a raycast to get intersection depth and collision normal
      const origin = closest;
      const target = hitProps[i].position.clone();
      const direction = target.sub(origin);

      const raycaster = new THREE.Raycaster(origin, direction, 0.1, 5); // tweak near/far as necessary

      // Test against this prop
      const intersects = raycaster.intersectObject(hitProps[i].model);

      if (!intersects.length) {
        // Test next hitProp
        continue;
      }

      const intersection = intersects[0];

      // Get intersection depth
      const r = player.fpsController.radius;
      let depth = Math.abs(intersection.distance - r);
      //depth *= -1; // because if intersecting, depth is less than radius

      // Get collision normal
      const colNormal = intersection.face.normal;

      // Move along collision normal by depth
      const moveStep = colNormal.multiplyScalar(depth);
      player.fpsController.velocity.add(moveStep);

      // Should also lower/clear player velocity - but how much? Which components?
    }
  }

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
