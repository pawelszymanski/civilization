import {Injectable} from '@angular/core';

import {Tile} from '../models/map';
import {SuitableTerrain, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../models/terrain';

import {TERRAIN_FEATURE_SET, TERRAIN_IMPROVEMENT_SET, TERRAIN_RESOURCE_SET} from '../consts/terrain.const';

@Injectable({providedIn: 'root'})
export class TileTerrainService {

  private isTileTerrainSuitableForItem(tile: Tile, suitableTerrainList: SuitableTerrain[]): boolean {
    for (const suitableTerrain of suitableTerrainList) {
      const isBaseSuitable =     (suitableTerrain.baseId === undefined)     || (suitableTerrain.baseId === tile.terrain.base.id);
      const isFeatureSuitable =  (suitableTerrain.featureId === undefined)  || (suitableTerrain.featureId === tile.terrain.feature.id);
      const isResourceSuitable = (suitableTerrain.resourceId === undefined) || (suitableTerrain.resourceId === tile.terrain.resourceId);
      if (isBaseSuitable && isFeatureSuitable && isResourceSuitable) {
        return true;
      }
    }
    return false;
  }

  public canFeatureBePutOnTile(featureId: TerrainFeatureId, tile: Tile): boolean {
    if (featureId === TerrainFeatureId.NONE) { return true; }
    const suitableTerrainList = TERRAIN_FEATURE_SET[featureId].suitableTerrain;
    return this.isTileTerrainSuitableForItem(tile, suitableTerrainList);
  }

  public canResourceBePutOnTile(resourceId: TerrainResourceId, tile: Tile): boolean {
    if (resourceId === TerrainResourceId.NONE) { return true; }
    const suitableTerrainList = TERRAIN_RESOURCE_SET[resourceId].suitableTerrain;
    return this.isTileTerrainSuitableForItem(tile, suitableTerrainList);
  }

  public canImprovementBePutOnTile(improvementId: TerrainImprovementId, tile: Tile): boolean {
    if (improvementId === TerrainImprovementId.NONE) { return true; }
    const suitableTerrainList = TERRAIN_IMPROVEMENT_SET[improvementId].suitableTerrain;
    return this.isTileTerrainSuitableForItem(tile, suitableTerrainList);
  }

}
