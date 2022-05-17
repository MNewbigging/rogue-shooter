import { action, makeObservable, observable } from 'mobx';

import { AssetLoader } from './state/loaders/AssetLoader';
import { GameEventListener } from './state/listeners/GameEventListener';
import { GameState } from './state/GameState';

export class AppState {
  public loading = true;
  public assetLoader = new AssetLoader();
  public eventListener = new GameEventListener();
  public gameState: GameState;

  constructor() {
    makeObservable(this, {
      loading: observable,
      onLoad: action,
    });
  }

  public loadGame() {
    this.assetLoader.load(this.onLoad);
  }

  public onLoad = () => {
    // Construct game state
    this.gameState = new GameState(
      document.getElementById('main-canvas') as HTMLCanvasElement,
      this.assetLoader,
      this.eventListener
    );

    // Ready to play
    this.loading = false;
  };
}
