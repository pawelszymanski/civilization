import {TechnologyId} from './technology';
import {Coords} from '../utils/coords';
import {EraId} from '../era';

export interface TechIdWithEraCoords {
  id: TechnologyId;
  eraCoords: Coords;
}

export interface TechTreeEra {
  id: EraId;
  technologies: TechIdWithEraCoords[]
}

export type TechTree = TechTreeEra[];
