import { TextureLoader } from 'three';

export class AssetLoader {
  private basePath = 'assets';

  public load(onLoad: () => void) {
    // Set base path to assets
    if (window.location.href.includes('localhost')) {
      this.basePath = 'dist/assets';
    }

    // Load the assets
    setTimeout(onLoad, 1000);
  }

  private loadTextures() {
    const textureLoader = new TextureLoader();

    const environmentPath = `${this.basePath}/textures/environment`;

    const folders = ['Dark', 'Green', 'Light', 'Orange', 'Purple', 'Red'];
  }
}
