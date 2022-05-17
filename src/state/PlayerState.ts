import * as THREE from 'three';

import { CameraManager } from './CameraManager';
import { FirstPersonController } from './FirstPersonController';
import { GameEventListener } from './listeners/GameEventListener';
import { InputManager } from './listeners/InputManager';

export class PlayerState {
  // TODO - player will need a mesh to detect collisions against others
  public bounds: THREE.Mesh;
  private fpsController: FirstPersonController;

  constructor(
    private cameraManager: CameraManager,
    private inputManager: InputManager,
    private eventListener: GameEventListener
  ) {
    // Create player bounds
    const geom = new THREE.BoxGeometry(0.5, 1.8, 0.3);
    const mat = new THREE.MeshBasicMaterial();
    this.bounds = new THREE.Mesh(geom, mat);

    // Setup controls
    this.fpsController = new FirstPersonController(cameraManager, inputManager, this.bounds);
  }

  public moveToSpawnPoint(point: THREE.Vector3) {
    this.cameraManager.camera.position.set(point.x, point.y, point.z);
    this.bounds.position.set(point.x, point.y, point.z);
  }

  public update(deltaTime: number) {
    // First person controls
    this.fpsController.update(deltaTime);
  }
}
