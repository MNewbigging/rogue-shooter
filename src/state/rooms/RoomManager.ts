import { GameEvent, GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { Room, RoomType } from './Room';
import { RoomBuilder } from './RoomBuilder';

export class RoomManager {
  public currentRoom?: Room;
  public roomCount = 0;
  private previousRoomTypes: RoomType[] = [];
  private roomBuilder = new RoomBuilder();

  constructor(private eventListener: GameEventListener) {
    eventListener.on(GameEventType.BUILD_ROOM, this.onRequestNewRoom);
  }

  private onRequestNewRoom = (event: GameEvent<GameEventType.BUILD_ROOM>) => {
    // If not first room, add the current room's type to previous rooms
    if (this.currentRoom) {
      this.previousRoomTypes.push(this.currentRoom.type);
    }

    const room = this.roomBuilder.buildRoom(event.roomType);

    this.currentRoom = room;
  };
}
