import * as THREE from 'three';

import { CanvasListener } from './listeners/CanvasListener';

/**
 * Handles camera setup and pointer lock
 */
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

    // Pointer lock needs gesture
    // document.addEventListener('pointerlockchange', () => {
    //   if (document.pointerLockElement !== this.canvasListener.canvas) {
    //     // Do something on unlock
    //   }
    // });
  }

  public lock() {
    this.canvasListener.canvas.requestPointerLock();
  }

  public unlock() {
    document.exitPointerLock();
  }
}
