import { action, makeObservable, observable } from 'mobx';

import { AssetLoader } from './state/loaders/AssetLoader';
import { GameEventListener } from './state/listeners/GameEventListener';

export class AppState {
  public loading = true;
  public assetLoader = new AssetLoader();
  public eventListener = new GameEventListener();

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
    this.loading = false;
  };
}
