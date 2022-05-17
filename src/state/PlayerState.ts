import { CameraManager } from './CameraManager';
import { GameEventListener } from './listeners/GameEventListener';
import { InputManager } from './listeners/InputManager';

export class PlayerState {
  constructor(
    private cameraManager: CameraManager,
    private inputManager: InputManager,
    private eventListener: GameEventListener
  ) {}

  public update(deltaTime: number) {
    // Check for actions, respond
  }
}
