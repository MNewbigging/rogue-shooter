import { KeyboardListener } from './listeners/KeyboardListener';
import { MouseListener } from './listeners/MouseListener';

export class InputManager {
  private mouseListener = new MouseListener();
  private keyboardListener = new KeyboardListener();
}
