import * as THREE from 'three';

import { CanvasListener } from './listeners/CanvasListener';

export class CameraManager {
  public camera: THREE.PerspectiveCamera;

  constructor(private canvasListener: CanvasListener) {
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75, // FOV
      this.canvasListener.width / this.canvasListener.height, // Aspect
      0.1, // Near
      100 // Far
    );
  }
}
