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

/**
 * Reads input from key/mouse and gamepad, provides rebindable key system, tracks
 * which actions are being taken in real time.
 */
export class InputManager {
  private mouseListener = new MouseListener();
  private keyboardListener = new KeyboardListener();
  private actionMap = new Map<InputAction, boolean>();
  private realtimeActions: InputAction[] = Object.values(InputAction);

  constructor(private eventListener: GameEventListener) {
    // Initialise action map
    this.realtimeActions.forEach((action) => this.actionMap.set(action, false));
  }

  public takingAction(action: InputAction) {
    return this.actionMap.get(action) ?? false;
  }

  public postUpdate() {
    this.mouseListener.postUpdate();

    // No longer taking realtime actions
    this.realtimeActions.forEach((action) => this.actionMap.set(action, false));
  }
}
