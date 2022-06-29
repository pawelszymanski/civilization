import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {TerrainBaseId, TerrainFeatureId, TerrainImprovementId, TerrainResourceId} from '../models/terrain';
import {WorldBuilderBrushSizeId, WorldBuilderUi, WorldBuilderToolId} from '../models/world-builder';

import {DEFAULT_WORLD_BUILDER_UI} from '../consts/world-builder.const';

@Injectable()
export class WorldBuilderUiStore {

  // tslint:disable-next-line:variable-name
  private _worldBuilderUi: BehaviorSubject<WorldBuilderUi> = new BehaviorSubject(DEFAULT_WORLD_BUILDER_UI);

  public readonly worldBuilderUi: Observable<WorldBuilderUi> = this._worldBuilderUi.asObservable();

  private next(worldBuilderUi: WorldBuilderUi): void {
    this._worldBuilderUi.next(worldBuilderUi);
  }

  public setTool(tool: WorldBuilderToolId): void {
    this.next({...this._worldBuilderUi.value, tool});
  }

  public setBrushSize(brushSize: WorldBuilderBrushSizeId): void {
    this.next({...this._worldBuilderUi.value, brushSize});
  }

  public setTerrainBase(terrainBase: TerrainBaseId): void {
    this.next({...this._worldBuilderUi.value, terrainBase});
  }

  public setTerrainFeature(terrainFeature: TerrainFeatureId): void {
    this.next({...this._worldBuilderUi.value, terrainFeature});
  }

  public setTerrainResource(terrainResource: TerrainResourceId): void {
    this.next({...this._worldBuilderUi.value, terrainResource});
  }

  public setTerrainImprovement(terrainImprovement: TerrainImprovementId): void {
    this.next({...this._worldBuilderUi.value, terrainImprovement});
  }

}
