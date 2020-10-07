import {Coords} from './utils';
import {TechnologyId} from './technologies';
import {CivicId} from './civics';
import {EraId} from './era';

export interface TechnologyIdWithEraCoords {
  id: TechnologyId;
  eraCoords: Coords;
}

export interface TechnologyTreeEra {
  id: EraId;
  technologies: TechnologyIdWithEraCoords[]
}

export type TechnologyTree = TechnologyTreeEra[];



export interface CivicIdWithEraCoords {
  id: CivicId;
  eraCoords: Coords;
}

export interface CivicTreeEra {
  id: EraId;
  civics: CivicIdWithEraCoords[]
}

export type CivicTree = CivicTreeEra[];
