import * as THREE from 'three';

import { CameraManager } from './CameraManager';
import { GameEventListener, GameEventType } from './listeners/GameEventListener';
import { InputAction, InputManager } from './listeners/InputManager';

export class FirstPersonController {
  //public feet: THREE.Mesh;
  public collider: THREE.Mesh;
  public dy = 0;
  public onGround = false;
  public velocity = new THREE.Vector3();
  private direction = new THREE.Vector3();
  private lookEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  private lookSpeed = 1.5;
  private readonly minPolarAngle = 0;
  private readonly maxPolarAngle = Math.PI;
  private readonly halfPi = Math.PI / 2;
  private moveSpeed = 3;
  private height = 0.2;

  constructor(
    private cameraManager: CameraManager,
    private inputManager: InputManager,
    private eventListener: GameEventListener
  ) {
    // Create player capsule collider
    const capGeom = new THREE.CapsuleGeometry(1, 1, 4, 8);
    this.collider = new THREE.Mesh(capGeom);

    eventListener.on(GameEventType.PLAYER_JUMP, this.onJump);
  }

  public moveTo(pos: THREE.Vector3) {
    // Move player collider
    this.collider.position.set(pos.x, pos.y, pos.z);

    // Set camera to collider pos, plus height
    const camPos = this.collider.position.clone();
    camPos.y += this.height;

    this.cameraManager.camera.position.set(camPos.x, camPos.y, camPos.z);
  }

  public update(deltaTime: number) {
    // Look around
    this.mouseLook();
    // Input actions
    this.moveActions(deltaTime);
    // Movement
    this.move();
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

    // Update facing direction for forward movement
    this.cameraManager.camera.getWorldDirection(this.direction);
    this.direction.y = 0;
    this.direction.normalize();
  }

  private moveActions(deltaTime: number) {
    const moveSpeed = this.moveSpeed * deltaTime;

    // Right direction
    const rightDir = this.direction.clone().cross(this.cameraManager.camera.up);

    // Forward
    if (this.inputManager.takingAction(InputAction.MOVE_FORWARD)) {
      const moveStep = this.direction.clone().multiplyScalar(moveSpeed);

      // Add forward impulse
      this.velocity.add(moveStep);
    }
    // Backward
    if (this.inputManager.takingAction(InputAction.MOVE_BACKWARD)) {
      const moveStep = this.direction.clone().multiplyScalar(-moveSpeed);

      // Add backward impulse
      this.velocity.add(moveStep);
    }
    // Left
    if (this.inputManager.takingAction(InputAction.STRAFE_LEFT)) {
      const moveStep = rightDir.multiplyScalar(-moveSpeed);

      // Add left impulse
      this.velocity.add(moveStep);
    }
    // Right
    if (this.inputManager.takingAction(InputAction.STRAFE_RIGHT)) {
      const moveStep = rightDir.multiplyScalar(moveSpeed);

      // Add right impulse
      this.velocity.add(moveStep);
    }
  }

  private move() {
    // Fall with gravity
    this.velocity.y -= 0.01;

    // Velocity gives the next position to move to
    const nextPos = this.collider.position.clone().add(this.velocity);

    this.moveTo(nextPos);
  }

  private onJump = () => {
    if (this.onGround) {
      this.velocity.y = 0.2;
    }
  };
}
