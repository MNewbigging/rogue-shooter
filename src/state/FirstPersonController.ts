import * as THREE from 'three';

import { CameraManager } from './CameraManager';
import { InputAction, InputManager } from './listeners/InputManager';

export class FirstPersonController {
  public feet: THREE.Mesh;
  // Y movement delta; may be set by collision manager
  public deltaY = 0;
  private lookEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  private lookSpeed = 1.5;
  private readonly minPolarAngle = 0;
  private readonly maxPolarAngle = Math.PI;
  private readonly halfPi = Math.PI / 2;
  private forward = new THREE.Vector3();
  private moveSpeed = 3;
  private height = 0.5;
  public gravity = -0.01;

  constructor(private cameraManager: CameraManager, private inputManager: InputManager) {
    const feetGeom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    this.feet = new THREE.Mesh(feetGeom);
  }

  public update(deltaTime: number) {
    // Adhere to gravity
    //this.applyGravity();
    // Look around
    this.mouseLook();
    // Move
    this.moveActions(deltaTime);
  }

  public moveTo(pos: THREE.Vector3) {
    // Set camera to the position
    this.cameraManager.camera.position.set(pos.x, pos.y, pos.z);
    // Set feet to the same position, minus height on y
    this.feet.position.set(pos.x, pos.y - this.height, pos.z);
  }

  public addPositionY(y: number) {
    this.cameraManager.camera.position.y += y;
    this.feet.position.y += y;
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
    this.forward.y = 0;
    this.forward.normalize();

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

    // Move to new position
    this.moveTo(nextPosition);
  }
}
