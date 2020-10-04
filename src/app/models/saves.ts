import {Camera} from './camera';
import {Map} from './map';
import {GameplayUi} from './gameplay-ui';
import {Timestamp, Uuid} from './utils';

export enum SaveSortOrderId {
  DATE_ASCENDING,
  DATE_DESCENDING,
  NAME_ASCENDING,
  NAME_DESCENDING
}

export interface SaveListOptions {
  showAutosaves: boolean;
  sortOrder: SaveSortOrderId;
}

export interface Save {
  name: string;
  uuid: Uuid;
  timestamp: Timestamp;
  isAutosave: boolean;
  gameplayUi: GameplayUi;
  camera: Camera;
  map: Map;
}
