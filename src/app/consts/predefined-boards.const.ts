import {PredefinedBoard} from '../models/board';
import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../models/terrain';
import {Yield} from '../models/yield';

export const PREDEFINED_BOARDS: PredefinedBoard[] = [
  {
    name: 'Tiny map, no improvements',
    board: {
      rows: [
        {
          tiles: [
            { coords: {x: 0, y: 0}, terrain: {base: TerrainBaseId.OCEAN, feature: TerrainFeatureId.NONE, improvement: TerrainImprovementId.NONE, resource: TerrainResourceId.NONE}, yield: ({} as Yield) }
          ]
        }
      ]
    }
  }
]
