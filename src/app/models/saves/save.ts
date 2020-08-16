import {GameMap} from '../game-map/game-map';
import {Timestamp} from '../utils/timestamp';
import {Uuid} from '../utils/uuid';

export interface Save {
  uuid: Uuid;
  name: string;
  timestamp: Timestamp;
  gameMap: GameMap;
  isAutosave: boolean;
}
