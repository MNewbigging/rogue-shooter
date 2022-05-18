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
  public gravity = 0.1;

  constructor(private keyboardListener: KeyboardListener) {
    // Make cube
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 'red' });
    this.cube = new THREE.Mesh(geom, mat);

    // Controls
    keyboardListener.on('keyj', this.jump);
  }

  public moveTo(pos: THREE.Vector3) {
    this.cube.position.set(pos.x, pos.y, pos.z);
  }

  public update(deltaTime: number, props: Prop[]) {
    // Apply gravity
    this.dy -= this.gravity;

    // If on the ground, set dy to 0
    for (const prop of props) {
      // Test intersection with ground
      const propBox = new THREE.Box3().setFromObject(prop.model);
      const cubeBox = new THREE.Box3().setFromObject(this.cube);
      if (cubeBox.intersectsBox(propBox)) {
        // This prevents jumping while on the ground
        this.dy = 0;
      }
    }

    // Move
    this.cube.position.y += this.dy * deltaTime;
  }

  private jump = () => {
    console.log('jump');
    this.dy = 5;
  };
}
