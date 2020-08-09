import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// COMPONENTS
import {AppComponent} from './components/app/app.component';
import {MainMenuComponent} from './components/app/components/main-menu/main-menu.component';
import {MapEditorComponent} from './components/app/components/sidebars/map-editor/map-editor.component';
import {DevToolsComponent} from './components/app/components/sidebars/dev-tools/dev-tools.component';
import {CameraFormComponent} from './components/app/components/sidebars/dev-tools/components/camera-form/camera-form.component';
import {GenerateMapFormComponent} from './components/app/components/sidebars/dev-tools/components/generate-map-form/generate-map-form.component';
import {SaveGameFormComponent} from './components/app/components/sidebars/dev-tools/components/save-game-form/save-game-form.component';
import {StrategicViewComponent} from './components/app/components/game-map/strategic-view/strategic-view.component';
import {TileYieldComponent} from './components/app/components/game-map/tile-yield/tile-yield.component';
import {TileTextComponent} from './components/app/components/game-map/tile-text/tile-text.component';
import {IsometricViewComponent} from './components/app/components/game-map/isometric-view/isometric-view.component';
import {StatusBarComponent} from './components/app/components/hud/status-bar/status-bar.component';
import {MiniMapComponent} from './components/app/components/hud/mini-map/mini-map.component';
import {QuickLinksComponent} from './components/app/components/hud/quick-links/quick-links.component';
import {CivicTreeComponent} from './components/app/components/modals/civic-tree/civic-tree.component';
import {TechnologyTreeComponent} from './components/app/components/modals/technology-tree/technology-tree.component';
import {InGameMenuComponent} from './components/app/components/modals/in-game-menu/in-game-menu.component';
import {SaveGameComponent} from './components/app/components/modals/save-game/save-game.component';
import {LoadGameComponent} from './components/app/components/modals/load-game/load-game.component';
import {GameOptionsMenuComponent} from './components/app/components/modals/game-options-menu/game-options-menu.component';

// SERVICES
import {GameMapGeneratorService} from './services/game-map-generator.service';
import {LocalStorageService} from './services/local-storage.service';
import {YieldCalculatorService} from './services/yield-calculator.service';
import {UtilsService} from './services/utils.service';

// STORES
import {CameraStore} from './stores/camera.store';
import {GameMapStore} from './stores/game-map.store';
import {KeyBindingsStore} from './stores/key-bindings.store';
import {SavesStore} from './stores/saves.store';
import {UiStore} from './stores/ui.store';

// PIPES
import {EraNamePipe} from './pipes/era-name.pipe';
import {TerrainBaseNamePipe} from './pipes/terrain-base-name.pipe';
import {TerrainFeatureNamePipe} from './pipes/terrain-feature-name.pipe';
import {TerrainImprovementNamePipe} from './pipes/terrain-improvement-name.pipe';
import {TerrainResourceNamePipe} from './pipes/terrain-resource-name.pipe';
import {CivicNamePipe} from './pipes/ciciv-name.pipe';
import {TechnologyNamePipe} from './pipes/technology-name.pipe';


const COMPONENTS = [
  AppComponent,
  MainMenuComponent,
  MapEditorComponent,
  DevToolsComponent,
  CameraFormComponent,
  GenerateMapFormComponent,
  SaveGameFormComponent,
  StrategicViewComponent,
  TileYieldComponent,
  TileTextComponent,
  IsometricViewComponent,
  StatusBarComponent,
  MiniMapComponent,
  QuickLinksComponent,
  CivicTreeComponent,
  TechnologyTreeComponent,
  InGameMenuComponent,
  SaveGameComponent,
  LoadGameComponent,
  GameOptionsMenuComponent,
]

const SERVICES = [
  GameMapGeneratorService,
  LocalStorageService,
  YieldCalculatorService,
  UtilsService,
]

const STORES = [
  CameraStore,
  GameMapStore,
  KeyBindingsStore,
  SavesStore,
  UiStore,
]

const PIPES = [
  EraNamePipe,
  TerrainBaseNamePipe,
  TerrainFeatureNamePipe,
  TerrainImprovementNamePipe,
  TerrainResourceNamePipe,
  CivicNamePipe,
  TechnologyNamePipe,
]

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ...SERVICES,
    ...STORES,
    ...PIPES
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
