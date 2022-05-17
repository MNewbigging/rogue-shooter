import { AssetLoader } from './loaders/AssetLoader';
import { CanvasListener } from './listeners/CanvasListener';
import { GameEventListener } from './listeners/GameEventListener';
import { InputManager } from './InputManager';
import { Renderer } from './Renderer';

export class GameState {
  private canvasListener: CanvasListener;
  private renderer: Renderer;
  private inputManager = new InputManager();

  constructor(
    canvas: HTMLCanvasElement,
    private assetLoader: AssetLoader,
    private eventListener: GameEventListener
  ) {
    // Setup canvas listener with canvas element
    this.canvasListener = new CanvasListener(canvas);
    // Setup renderer with canvas listener
    this.renderer = new Renderer(this.canvasListener);
  }

  public start() {
    // Start the game loop
    this.update();
  }

  // Main update loop
  private update = () => {
    requestAnimationFrame(this.update);
  };
}
