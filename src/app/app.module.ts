import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './components/app/app.component';
import {GameMapComponent} from './components/game/game-map/game-map.component';
import {LoadGameFormComponent} from './components/dev-tools/load-game-form/load-game-form.component';
import {SaveGameFormComponent} from './components/dev-tools/save-game-form/save-game-form.component';
import {GenerateMapFormComponent} from './components/dev-tools/generate-map-form/generate-map-form.component';
import {CameraFormComponent} from './components/dev-tools/camera-form/camera-form.component';
import {TileYieldComponent} from './components/game/tile-yield/tile-yield.component';

import {GameMapGeneratorService} from './services/game-map-generator.service';
import {YieldCalculatorService} from './services/yield-calculator.service';
import {LocalStorageService} from './services/local-storage.service';
import {UtilsService} from './services/utils.service';

import {CameraStore} from './stores/camera.store';
import {GameMapStore} from './stores/game-map.store';
import {SavesStore} from './stores/saves.store';
import {UiStore} from './stores/ui.store';

import {TerrainBaseNamePipe} from './pipes/terrain-base-name.pipe';
import {TerrainFeatureNamePipe} from './pipes/terrain-feature-name.pipe';
import {TerrainImprovementNamePipe} from './pipes/terrain-improvement-name.pipe';
import {TerrainResourceNamePipe} from './pipes/terrain-resource-name.pipe';

const COMPONENTS = [
  // APP
  AppComponent,
  // GAME
  GameMapComponent,
  TileYieldComponent,
  // DEV TOOLS
  CameraFormComponent,
  LoadGameFormComponent,
  GenerateMapFormComponent,
  SaveGameFormComponent,
]

const SERVICES = [
  GameMapGeneratorService,
  LocalStorageService,
  YieldCalculatorService,
  UtilsService,
]

const STORES = [
  GameMapStore,
  CameraStore,
  SavesStore,
  UiStore,
]

const PIPES = [
  TerrainBaseNamePipe,
  TerrainFeatureNamePipe,
  TerrainImprovementNamePipe,
  TerrainResourceNamePipe,
]

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ...SERVICES,
    ...STORES,
    ...PIPES
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
