import * as THREE from 'three';

export class MouseListener {
  // TODO - this game may not need all of these buttons tracked or callbacks
  public lmb = false;
  public mmb = false;
  public rmb = false;
  public movement = new THREE.Vector2();

  constructor() {
    // TODO - might need to add these listeners to the canvas element, or UI clicks will interfere...
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  public postUpdate() {
    this.movement.x = 0;
    this.movement.y = 0;
  }

  private onMouseDown = (event: MouseEvent) => {
    switch (event.button) {
      case 0:
        this.lmb = true;
        break;
      case 1:
        this.mmb = true;
        break;
      case 2:
        this.rmb = true;
        break;
    }
  };

  private onMouseUp = (event: MouseEvent) => {
    switch (event.button) {
      case 0:
        this.lmb = false;
        break;
      case 1:
        this.mmb = false;
        break;
      case 2:
        this.rmb = false;
        break;
    }
  };

  private onMouseMove = (event: MouseEvent) => {
    this.movement.x = event.movementX;
    this.movement.y = event.movementY;
  };
}
