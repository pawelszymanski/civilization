import {Coords} from '../utils/coords';
import {EraId} from '../era';
import {CivicId} from './civic';

export interface CivicIdWithEraCoords {
  id: CivicId;
  eraCoords: Coords;
}

export interface CivicTreeEra {
  id: EraId;
  civics: CivicIdWithEraCoords[]
}

export type CivicTree = CivicTreeEra[];
