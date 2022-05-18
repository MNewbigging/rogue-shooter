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

  private applyGravity() {
    /**
     * https://stackoverflow.com/questions/48130461/how-to-make-my-character-jump-with-gravity
     *
     * - as long as player isn't intersecting on lower bounds
     * - apply gravity, reducing y
     *
     * - when player intersects, move up to just outside intersection, or
     * - maybe just inside
     *
     * Or:
     * DeltaY indicates a y direction, affected by jumping and gravity
     * - deltaY: number
     *
     * Always adjust y by delta in update, which is movement:
     * - y += deltaY
     *
     * At time of jump, add impulse to deltaY (player will move up)
     * - if (!isJumping && JUMP_ACTION) deltaY = 5;
     *
     * Always subtract gravity force from deltaY (makes jump arc)
     * - deltaY -= gravity
     *
     * When touching the ground, set deltaY to 0 (y will therefore not change)
     * - if (onGround()) deltaY = 0
     *
     */

    // Subtract gravity from y move delta
    this.deltaY -= this.gravity;

    // If touching the ground, set y move delta to 0

    // If jumping, add upward impulse value to y move delta

    // Apply y movement to player
    this.addPositionY(this.deltaY);
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

    // Move to new position
    this.moveTo(nextPosition);
  }
}
