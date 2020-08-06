import {Coords} from '../utils/coords';
import {EraId} from '../era';
import {TechnologyId} from './technology';

export interface TechnologyIdWithEraCoords {
  id: TechnologyId;
  eraCoords: Coords;
}

export interface TechnologyTreeEra {
  id: EraId;
  technologies: TechnologyIdWithEraCoords[]
}

export type TechnologyTree = TechnologyTreeEra[];
