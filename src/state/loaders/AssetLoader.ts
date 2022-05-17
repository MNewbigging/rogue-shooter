export class AssetLoader {
  public load(onLoad: () => void) {
    // Load the assets
    setTimeout(onLoad, 1000);
  }
}
