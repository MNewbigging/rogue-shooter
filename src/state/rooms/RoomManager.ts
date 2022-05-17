import { GameEvent, GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { Room, RoomType } from './Room';
import { RoomBuilder } from './RoomBuilder';

export class RoomManager {
  public currentRoom: Room;
  private roomBuilder = new RoomBuilder();

  constructor(private eventListener: GameEventListener) {
    eventListener.on(GameEventType.BUILD_ROOM, this.onRequestNewRoom);
  }

  private onRequestNewRoom = (event: GameEvent<GameEventType.BUILD_ROOM>) => {
    const room = this.roomBuilder.buildRoom(event.roomType);

    this.currentRoom = room;
  };
}
