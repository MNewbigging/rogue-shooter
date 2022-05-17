import { action, makeObservable, observable } from 'mobx';

import { AssetLoader } from './loaders/AssetLoader';
import { GameEventListener } from './listeners/GameEventListener';
import { GameState } from './GameState';

export class AppState {
  public loading = true;
  public started = false;
  public assetLoader = new AssetLoader();
  public eventListener = new GameEventListener();
  public gameState: GameState;

  constructor() {
    makeObservable(this, {
      loading: observable,
      onLoad: action,
      started: observable,
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

    // Start game after short delay
    //setTimeout(() => this.gameState.start(), 500);
  };

  public onClickToStart = () => {
    this.started = true;

    // Start game after short delay
    setTimeout(() => this.gameState.start(), 500);
  };
}
