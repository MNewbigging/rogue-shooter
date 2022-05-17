import * as THREE from 'three';

import { CameraManager } from './CameraManager';
import { GameEventListener } from './listeners/GameEventListener';
import { InputAction, InputManager } from './listeners/InputManager';

export class PlayerState {
  // TODO - player will need a mesh to detect collisions against others
  // TODO - might want to separate this into a first person controller class
  private lookEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  private lookSpeed = 1.5;
  private readonly minPolarAngle = 0;
  private readonly maxPolarAngle = Math.PI;
  private readonly halfPi = Math.PI / 2;
  private forward = new THREE.Vector3();
  private moveSpeed = 3;

  constructor(
    private cameraManager: CameraManager,
    private inputManager: InputManager,
    private eventListener: GameEventListener
  ) {}

  public update(deltaTime: number) {
    // Look around
    this.mouseLook();
    // Move
    this.moveActions(deltaTime);
  }

  private mouseLook() {
    // Mouse movement delta
    const movement = this.inputManager.mouseListener.movement;
    // Current camera rotation
    this.lookEuler.setFromQuaternion(this.cameraManager.camera.quaternion);
    // Adjust per mouse delta
    this.lookEuler.y -= movement.x * 0.002 * this.lookSpeed;
    this.lookEuler.x -= movement.y * 0.002 * this.lookSpeed;
    // Avoid gimbal lock
    this.lookEuler.x = Math.max(
      this.halfPi - this.maxPolarAngle,
      Math.min(this.halfPi - this.minPolarAngle, this.lookEuler.x)
    );
    // Update camera rotation
    this.cameraManager.camera.quaternion.setFromEuler(this.lookEuler);
  }

  private moveActions(deltaTime: number) {
    const nextPosition = this.cameraManager.camera.position.clone();

    const moveSpeed = this.moveSpeed * deltaTime;

    // Facing direction
    this.cameraManager.camera.getWorldDirection(this.forward);

    // Right direction
    const rightDir = this.forward.clone().cross(this.cameraManager.camera.up);

    // Forward
    if (this.inputManager.takingAction(InputAction.MOVE_FORWARD)) {
      const moveStep = this.forward.clone().multiplyScalar(moveSpeed);
      nextPosition.add(moveStep);
    }
    // Backward
    if (this.inputManager.takingAction(InputAction.MOVE_BACKWARD)) {
      const moveStep = this.forward.clone().multiplyScalar(-moveSpeed);
      nextPosition.add(moveStep);
    }
    // Left
    if (this.inputManager.takingAction(InputAction.STRAFE_LEFT)) {
      const moveStep = rightDir.multiplyScalar(-moveSpeed);
      nextPosition.add(moveStep);
    }
    // Right
    if (this.inputManager.takingAction(InputAction.STRAFE_RIGHT)) {
      const moveStep = rightDir.multiplyScalar(moveSpeed);
      nextPosition.add(moveStep);
    }

    // Apply movement
    this.cameraManager.camera.position.set(nextPosition.x, nextPosition.y, nextPosition.z);
  }
}
