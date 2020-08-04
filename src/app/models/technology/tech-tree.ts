import {Coords} from '../utils/coords';
import {EraId} from '../era';
import {TechnologyId} from './technology';

export interface TechIdWithEraCoords {
  id: TechnologyId;
  eraCoords: Coords;
}

export interface TechTreeEra {
  id: EraId;
  technologies: TechIdWithEraCoords[]
}

export type TechTree = TechTreeEra[];
