import { GameEventListener } from './GameEventListener';
import { KeyboardListener } from './KeyboardListener';
import { MouseListener } from './MouseListener';

/**
 * InputAction lists the game actions the player can take via input.
 */
export enum InputAction {
  MOVE_FORWARD = 'move-forward',
  MOVE_BACKWARD = 'move-backward',
  STRAFE_LEFT = 'strafe-left',
  STRAFE_RIGHT = 'strafe-right',
  JUMP = 'jump',
  FIRE = 'fire',
}

/**
 * Reads input from key/mouse and gamepad, provides rebindable key system, tracks
 * which actions are being taken in real time.
 */
export class InputManager {
  public mouseListener = new MouseListener();
  private keyboardListener = new KeyboardListener();
  private keybindings = new Map<InputAction, string>();
  private keyboardActions: InputAction[] = [
    InputAction.MOVE_BACKWARD,
    InputAction.MOVE_FORWARD,
    InputAction.STRAFE_LEFT,
    InputAction.STRAFE_RIGHT,
    InputAction.JUMP,
  ];
  private actionMap = new Map<InputAction, boolean>();
  private allActions: InputAction[] = Object.values(InputAction);

  constructor(private eventListener: GameEventListener) {
    // Initialise action map
    this.allActions.forEach((action) => this.actionMap.set(action, false));
    // Set default keybindings
    this.setDefaultKeybindings();
  }

  public takingAction(action: InputAction) {
    return this.actionMap.get(action) ?? false;
  }

  public update() {
    // Check if keyboard actions are taking place
    this.keyboardActions.forEach((action) => {
      // Keyboard bindings
      const boundKey = this.keybindings.get(action);
      const actionKeyPressed = this.keyboardListener.isKeyPressed(boundKey);
      this.actionMap.set(action, actionKeyPressed);
    });

    // Check if mouse actions are taking place
    this.actionMap.set(InputAction.FIRE, this.mouseListener.lmb);
  }

  public postUpdate() {
    this.mouseListener.postUpdate();
  }

  private setDefaultKeybindings() {
    // TODO - provide rebind keys UI interface & logic
    this.keybindings.set(InputAction.MOVE_FORWARD, 'keyw');
    this.keybindings.set(InputAction.MOVE_BACKWARD, 'keys');
    this.keybindings.set(InputAction.STRAFE_LEFT, 'keya');
    this.keybindings.set(InputAction.STRAFE_RIGHT, 'keyd');
    this.keybindings.set(InputAction.JUMP, 'space');
  }
}
