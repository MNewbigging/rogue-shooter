import { GameEventListener } from './listeners/GameEventListener';
import { KeyboardListener } from './listeners/KeyboardListener';
import { MouseListener } from './listeners/MouseListener';

/**
 * InputAction lists the game actions the player can take via input.
 */
export enum InputAction {
  MOVE_FORWARD = 'move-forward',
  MOVE_BACKWARD = 'move-backward',
  STRAFE_LEFT = 'strafe-left',
  STRAFE_RIGHT = 'strafe-right',
}

export class InputManager {
  private mouseListener = new MouseListener();
  private keyboardListener = new KeyboardListener();

  constructor(private eventListener: GameEventListener) {}
}
