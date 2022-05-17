import { CameraManager } from './CameraManager';
import { GameEventListener } from './listeners/GameEventListener';
import { InputManager } from './InputManager';

export class PlayerState {
  constructor(
    private cameraManager: CameraManager,
    private inputManager: InputManager,
    private eventListener: GameEventListener
  ) {}

  public update(deltaTime: number) {}
}
