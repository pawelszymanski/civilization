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

export interface SaveHeader {
  name: string;
  uuid: Uuid;
  timestamp: Timestamp;
  isAutosave: boolean;
}

export interface SaveData {
  gameplayUi: GameplayUi;
  camera: Camera;
  map: Map;
}

export type Save = SaveHeader & SaveData;
