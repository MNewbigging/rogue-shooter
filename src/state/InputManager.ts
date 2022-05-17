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
  private keybindings = new Map<InputAction, string>();

  constructor(private eventListener: GameEventListener) {
    // Initialise action map
    this.realtimeActions.forEach((action) => this.actionMap.set(action, false));
    // Set default keybindings
    this.setDefaultKeybindings();
  }

  public takingAction(action: InputAction) {
    return this.actionMap.get(action) ?? false;
  }

  public update() {
    // Check if realtime actions are taking place
    this.realtimeActions.forEach((action) => {
      const boundKey = this.keybindings.get(action);
      const actionKeyPressed = this.keyboardListener.isKeyPressed(boundKey);
      this.actionMap.set(action, actionKeyPressed);
    });
  }

  public postUpdate() {
    this.mouseListener.postUpdate();
  }

  private setDefaultKeybindings() {
    // TODO - provide rebind keys UI interface & logic

    // WASD
    this.keybindings.set(InputAction.MOVE_FORWARD, 'w');
    this.keybindings.set(InputAction.MOVE_BACKWARD, 's');
    this.keybindings.set(InputAction.STRAFE_LEFT, 'a');
    this.keybindings.set(InputAction.STRAFE_RIGHT, 'd');
  }
}
