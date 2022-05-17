import * as THREE from 'three';

import { AssetLoader } from './loaders/AssetLoader';
import { CameraManager } from './CameraManager';
import { CanvasListener } from './listeners/CanvasListener';
import { GameEventListener } from './listeners/GameEventListener';
import { InputManager } from './InputManager';
import { PlayerState } from './PlayerState';
import { Renderer } from './Renderer';
import { RoomManager } from './RoomManager';

export class GameState {
  // Canvas and renderer
  private canvasListener: CanvasListener;
  private renderer: Renderer;
  // Managers
  private inputManager: InputManager;
  private cameraManager: CameraManager;
  private roomManager = new RoomManager();
  // Player
  private playerState: PlayerState;
  // Game
  private clock = new THREE.Clock();

  constructor(
    canvas: HTMLCanvasElement,
    private assetLoader: AssetLoader,
    private eventListener: GameEventListener
  ) {
    this.canvasListener = new CanvasListener(canvas);
    this.renderer = new Renderer(this.canvasListener);

    // Setup managers
    this.inputManager = new InputManager(eventListener);
    this.cameraManager = new CameraManager(this.canvasListener);

    // Setup player
    this.playerState = new PlayerState(this.cameraManager);
  }

  public start() {
    // Start the game loop
    this.update();
  }

  // Main update loop
  private update = () => {
    requestAnimationFrame(this.update);

    // Get time from last frame
    const deltaTime = this.clock.getDelta();

    // Check for collisions

    // Update scene
    this.playerState.update(deltaTime);

    // Render

    // Post update
  };
}
