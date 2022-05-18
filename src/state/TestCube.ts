import * as THREE from 'three';

import { KeyboardListener } from './listeners/KeyboardListener';
import { Prop } from './rooms/Prop';

/**
 * Using a cube to test gravity, collision detection, jump logic
 * so I can view it with the first person camera!
 */
export class TestCube {
  public cube: THREE.Mesh;
  public dy = 0;
  public dz = 0;
  public gravity = 0.1;
  public drag = 0.5;
  public onGround = false;

  constructor(private keyboardListener: KeyboardListener) {
    // Make cube
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 'red' });
    this.cube = new THREE.Mesh(geom, mat);

    // Controls
    keyboardListener.on('keyj', this.jump);
    keyboardListener.on('arrowup', this.moveZ);
  }

  public moveTo(pos: THREE.Vector3) {
    this.cube.position.set(pos.x, pos.y, pos.z);
  }

  public updater(deltaTime: number, props: Prop[]) {
    // Apply gravity
    this.dy -= this.gravity;

    // Test for collisions with props
    this.onGround = false;
    for (const prop of props) {
      // Test intersection with ground
      const propBox = new THREE.Box3().setFromObject(prop.model);
      const cubeBox = new THREE.Box3().setFromObject(this.cube);
      if (cubeBox.intersectsBox(propBox)) {
        console.log('intersects ground');
        // Move out of intersection range
        cubeBox.intersect(propBox);
        // Clear y movement
        this.dy = 0;
        // On ground
        this.onGround = true;
      }
    }

    // Move
    this.cube.position.y += this.dy * deltaTime;
  }

  public update(deltaTime: number, props: Prop[]) {
    // Apply gravity
    this.dy -= this.gravity;

    // Apply drag
    if (this.dz > 0) {
      this.dz -= this.drag;
    }

    // Save current position
    const lastPos = this.cube.position.clone();

    // Move to new positionw
    this.cube.position.y += this.dy * deltaTime;
    this.cube.position.z += this.dz * deltaTime;

    // Test for intersections
    for (const prop of props) {
      const propBox = new THREE.Box3().setFromObject(prop.model);
      const cubeBox = new THREE.Box3().setFromObject(this.cube);
      if (cubeBox.intersectsBox(propBox)) {
        // Intersects with prop; move backwards. Get reverse of travelled direction
        const backwards = lastPos.sub(this.cube.position).normalize(); //this.cube.position.clone().sub(lastPos).normalize();
        // Get amount intersected
        const intersectDepth = propBox.max.y - cubeBox.min.y;
        // Move backwards by depth
        const moveStep = backwards.multiplyScalar(intersectDepth);
        this.cube.position.add(moveStep);
        this.dy = 0;
        break;
      }
    }
  }

  /**
   * The above will alawys intersect due to gravity pulling downwards
   *
   *
   */

  private jump = () => {
    console.log('jump');
    this.dy = 5;
  };

  private moveZ = () => {
    this.dz = -5;
  };
}
