import * as THREE from 'three';

import { CameraManager } from './CameraManager';
import { FirstPersonController } from './FirstPersonController';
import { GameEventListener } from './listeners/GameEventListener';
import { InputManager } from './listeners/InputManager';

export class PlayerState {
  public fpsController: FirstPersonController;

  constructor(
    private cameraManager: CameraManager,
    private inputManager: InputManager,
    private eventListener: GameEventListener
  ) {
    // Setup controls
    this.fpsController = new FirstPersonController(cameraManager, inputManager);
  }

  public moveTo(point: THREE.Vector3) {
    this.fpsController.moveTo(point);
  }

  public update(deltaTime: number) {
    // First person controls
    this.fpsController.update(deltaTime);
  }
}
