import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../models/game-map/terrain';
import {WorldBuilderBrushSize, WorldBuilderUi} from '../models/world-builder/world-builder';
import {WorldBuilderToolId} from '../models/world-builder/world-builder-tool.enum';

import {DEFAULT_WORLD_BUILDER_UI} from '../consts/world-builder/world-builder.const';

@Injectable()
export class WorldBuilderUiStore {

  private _worldBuilderUi: BehaviorSubject<WorldBuilderUi> = new BehaviorSubject(DEFAULT_WORLD_BUILDER_UI);

  public readonly worldBuilderUi: Observable<WorldBuilderUi> = this._worldBuilderUi.asObservable();

  private next(worldBuilderUi: WorldBuilderUi) {
    this._worldBuilderUi.next(worldBuilderUi);
  }

  public setTool(tool: WorldBuilderToolId) {
    this.next({...this._worldBuilderUi.value, tool});
  }

  public setBrushSize(brushSize: WorldBuilderBrushSize) {
    this.next({...this._worldBuilderUi.value, brushSize});
  }

  public setTerrainBase(terrainBase: TerrainBaseId) {
    this.next({...this._worldBuilderUi.value, terrainBase});
  }

  public setTerrainFeature(terrainFeature: TerrainFeatureId) {
    this.next({...this._worldBuilderUi.value, terrainFeature});
  }

  public setTerrainResource(terrainResource: TerrainResourceId) {
    this.next({...this._worldBuilderUi.value, terrainResource});
  }

  public setTerrainImprovement(terrainImprovement: TerrainImprovementId) {
    this.next({...this._worldBuilderUi.value, terrainImprovement});
  }

}
