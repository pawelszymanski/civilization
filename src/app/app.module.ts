import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './components/app/app.component';

import {MainMenuComponent} from './components/main-menu/main-menu.component';

import {
  StrategicViewComponent,
  TileYieldComponent
} from './components/strategic-view';

import {
  DevToolsComponent,
  LoadGameFormComponent,
  SaveGameFormComponent,
  GenerateMapFormComponent,
  CameraFormComponent
} from './components/dev-tools';

import {
  MapEditorComponent
} from './components/map-editor';

import {
  TechTreeComponent
} from './components/tech-tree';

import {GameMapGeneratorService} from './services/game-map-generator.service';
import {YieldCalculatorService} from './services/yield-calculator.service';
import {LocalStorageService} from './services/local-storage.service';
import {UtilsService} from './services/utils.service';

import {CameraStore} from './stores/camera.store';
import {GameMapStore} from './stores/game-map.store';
import {SavesStore} from './stores/saves.store';
import {UiStore} from './stores/ui.store';

import {EraNamePipe} from './pipes/era-name.pipe';
import {TerrainBaseNamePipe} from './pipes/terrain-base-name.pipe';
import {TerrainFeatureNamePipe} from './pipes/terrain-feature-name.pipe';
import {TerrainImprovementNamePipe} from './pipes/terrain-improvement-name.pipe';
import {TerrainResourceNamePipe} from './pipes/terrain-resource-name.pipe';
import {TechnologyNamePipe} from './pipes/technology-name.pipe';

const COMPONENTS = [
  // APP
  AppComponent,
  // MAIN MENU
  MainMenuComponent,
  // STRATEGIC VIEW
  StrategicViewComponent,
  TileYieldComponent,
  // TECH TREE
  TechTreeComponent,
  // MAP EDITOR
  MapEditorComponent,
  // DEV TOOLS
  DevToolsComponent,
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
  EraNamePipe,
  TerrainBaseNamePipe,
  TerrainFeatureNamePipe,
  TerrainImprovementNamePipe,
  TerrainResourceNamePipe,
  TechnologyNamePipe
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
