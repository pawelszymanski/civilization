import {Timestamp} from '../utils/timestamp';
import {Uuid} from '../utils/uuid';
import {GameMap} from '../game-map/game-map';
import {Camera} from '../camera/camera';

export interface Save {
  name: string;
  uuid: Uuid;
  timestamp: Timestamp;
  gameMap: GameMap;
  camera: Camera;
  isAutosave: boolean;
}
