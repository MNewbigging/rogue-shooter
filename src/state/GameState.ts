import * as THREE from 'three';

import { AssetLoader } from './loaders/AssetLoader';
import { CameraManager } from './CameraManager';
import { CanvasListener } from './listeners/CanvasListener';
import { GameEventListener, GameEventType } from './listeners/GameEventListener';
import { InputManager } from './listeners/InputManager';
import { PlayerState } from './PlayerState';
import { Renderer } from './Renderer';
import { RoomManager } from './rooms/RoomManager';
import { RoomType } from './rooms/Room';

export class GameState {
  // Canvas and renderer
  private canvasListener: CanvasListener;
  private renderer: Renderer;
  // Managers
  private inputManager: InputManager;
  private cameraManager: CameraManager;
  private roomManager: RoomManager;
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
    this.roomManager = new RoomManager(eventListener);

    // Setup player
    this.playerState = new PlayerState(this.cameraManager, this.inputManager, eventListener);

    // Setup first room
    eventListener.fireEvent({ type: GameEventType.BUILD_ROOM, roomType: RoomType.START });

    // Move player to spawn point
    const spawn = this.roomManager.currentRoom?.playerSpawnPoint;
    this.playerState.moveToSpawnPoint(spawn);
  }

  public start() {
    // Lock camera to first person
    this.cameraManager.lock();

    // Start the game loop
    this.update();
  }

  // Main update loop
  private update = () => {
    requestAnimationFrame(this.update);

    // Get time from last frame
    const deltaTime = this.clock.getDelta();

    // Get input
    this.inputManager.update();

    // Update scene
    this.playerState.update(deltaTime);

    // Check for collisions

    // Render
    this.renderer.render(this.roomManager.currentRoom.scene, this.cameraManager.camera);

    // Post update
    this.inputManager.postUpdate();
  };
}
