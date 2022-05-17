import { CameraManager } from './CameraManager';
import { FirstPersonController } from './FirstPersonController';
import { GameEventListener } from './listeners/GameEventListener';
import { InputManager } from './listeners/InputManager';

export class PlayerState {
  // TODO - player will need a mesh to detect collisions against others
  // TODO - might want to separate this into a first person controller class
  private fpsController: FirstPersonController;

  constructor(
    private cameraManager: CameraManager,
    private inputManager: InputManager,
    private eventListener: GameEventListener
  ) {
    this.fpsController = new FirstPersonController(cameraManager, inputManager);
  }

  public update(deltaTime: number) {
    // First person controls
    this.fpsController.update(deltaTime);
  }
}
