import * as THREE from 'three';
import { lerp } from 'three/src/math/MathUtils';

import { CameraManager } from './CameraManager';
import { GameEventListener, GameEventType } from './listeners/GameEventListener';
import { InputAction, InputManager } from './listeners/InputManager';

export class FirstPersonController {
  //public feet: THREE.Mesh;
  public radius = 1;
  public collider: THREE.Mesh;
  public onGround = false;
  public velocity = new THREE.Vector3();
  public direction = new THREE.Vector3();
  private lookEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  private lookSpeed = 1.5;
  private readonly minPolarAngle = 0;
  private readonly maxPolarAngle = Math.PI;
  private readonly halfPi = Math.PI / 2;
  private moveSpeed = 3;
  private height = 0.2;
  private targetCameraRot = new THREE.Quaternion();
  private maxCameraTilt = 10;
  private friction: number = 0.2; // should be normalized

  constructor(
    private cameraManager: CameraManager,
    private inputManager: InputManager,
    private eventListener: GameEventListener
  ) {
    // Create player capsule collider
    const capGeom = new THREE.CapsuleGeometry(this.radius, 1, 4, 8);
    this.collider = new THREE.Mesh(capGeom);
    this.collider.name = 'collider';
    this.cameraManager.camera.position.y += this.height;
    this.collider.attach(this.cameraManager.camera);

    // Debug
    const box = new THREE.Box3().setFromObject(this.collider);
    console.log('capsule aabb', box);

    const size = new THREE.Vector3();
    box.getSize(size);
    console.log('capsule aabb size', size);

    eventListener.on(GameEventType.PLAYER_JUMP, this.onJump);
  }

  public moveTo(pos: THREE.Vector3) {
    // Move player collider
    this.collider.position.set(pos.x, pos.y, pos.z);

    // Set camera to collider pos, plus height
    //const camPos = this.collider.position.clone();
    //camPos.y += this.height;

    //this.cameraManager.camera.position.set(camPos.x, camPos.y, camPos.z);
  }

  public update(deltaTime: number) {
    // Look around
    this.mouseLook();
    // Input actions
    this.moveActions(deltaTime);
    // Movement
    this.move();

    this.cameraSway(this.moveSpeed, deltaTime);
  }

  private mouseLook() {
    // Mouse movement delta
    const movement = this.inputManager.mouseListener.movement;
    // Current camera rotation
    this.lookEuler.setFromQuaternion(this.collider.quaternion);
    // Adjust per mouse delta
    this.lookEuler.y -= movement.x * 0.002 * this.lookSpeed;
    this.lookEuler.x -= movement.y * 0.002 * this.lookSpeed;

    this.cameraManager.camera.rotation.x -= movement.y * 0.002 * this.lookSpeed;
    // Avoid gimbal lock
    this.cameraManager.camera.rotation.x = Math.max(
      this.halfPi - this.maxPolarAngle,
      Math.min(this.halfPi - this.minPolarAngle, this.cameraManager.camera.rotation.x)
    );
    // Update camera rotation
    //this.cameraManager.camera.quaternion.setFromEuler(this.lookEuler);

    // update collider rotation
    this.collider.quaternion.setFromEuler(new THREE.Euler(
      0,
      this.lookEuler.y,
      0,
    ));

    // Update facing direction for forward movement
    this.collider.getWorldDirection(this.direction);
    this.direction.y = 0;
    this.direction.normalize();
    this.direction.multiplyScalar(-1);
  }

  private moveActions(deltaTime: number) {
    const moveSpeed = this.moveSpeed * deltaTime;

    // Right direction
    const rightDir = this.direction.clone().cross(this.collider.up);

    // Forward
    if (this.inputManager.takingAction(InputAction.MOVE_FORWARD)) {
      const moveStep = this.direction.clone().multiplyScalar(moveSpeed);

      // Add forward impulse
      this.velocity.add(moveStep);
    } else if (this.inputManager.takingAction(InputAction.MOVE_BACKWARD)) {
      const moveStep = this.direction.clone().multiplyScalar(-moveSpeed);

      // Add backward impulse
      this.velocity.add(moveStep);
    } else {
      //const moveStep = this.direction.clone().multiplyScalar(-1).sub(moveSpeed);
      //this.velocity.add(moveStep);
    }
    // Left
    if (this.inputManager.takingAction(InputAction.STRAFE_LEFT)) {
      const moveStep = rightDir.multiplyScalar(-moveSpeed);

      // Add left impulse
      this.velocity.add(moveStep);
    } else if (this.inputManager.takingAction(InputAction.STRAFE_RIGHT)) {
      const moveStep = rightDir.multiplyScalar(moveSpeed);

      // Add right impulse
      this.velocity.add(moveStep);
    } else {
      //const moveStep = this.direction.clone().multiplyScalar(-1).multiplyScalar(moveSpeed);
      //this.velocity.add(moveStep);
    }
  }

  private move() {
    // Fall with gravity
    //this.velocity.y -= 0.01;

    this.velocity.x *= 1 - this.friction;
    this.velocity.z *= 1 - this.friction;

    // Velocity gives the next position to move to
    const nextPos = this.collider.position.clone().add(this.velocity);

    this.moveTo(nextPos);
  }

  private onJump = () => {
    this.velocity.y = 0.2;
  };

  private cameraSway(moveSpeed: number, deltaTime: number): void {
    // we need to add in a local-space animation
    // the amount of added rotation should be directly tied to movement speed

  }
}
