import {GameMap} from './game-map';
import {Timestamp} from './timestamp';
import {Uuid} from './uuid';

export interface Save {
  uuid: Uuid;
  name: string;
  timestamp: Timestamp;
  gameMap: GameMap;
}
