import { AssetLoader } from './loaders/AssetLoader';
import { CanvasListener } from './listeners/CanvasListener';
import { GameEventListener } from './listeners/GameEventListener';
import { InputManager } from './InputManager';

export class GameState {
  private canvasListener: CanvasListener;
  private inputManager = new InputManager();

  constructor(
    canvas: HTMLCanvasElement,
    private assetLoader: AssetLoader,
    private eventListener: GameEventListener
  ) {
    // Setup canvas listener
    this.canvasListener = new CanvasListener(canvas);
  }

  public start() {
    // Start the game loop
  }
}
