import { AssetLoader } from './loaders/AssetLoader';
import { CanvasListener } from './listeners/CanvasListener';
import { GameEventListener } from './listeners/GameEventListener';

export class GameState {
  private canvasListener: CanvasListener;

  constructor(
    canvas: HTMLCanvasElement,
    private assetLoader: AssetLoader,
    private eventListener: GameEventListener
  ) {
    // Setup canvas listener
    this.canvasListener = new CanvasListener(canvas);
  }
}
