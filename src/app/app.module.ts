import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

// COMPONENTS
import {AppComponent} from './components/app/app.component';
import {MainMenuComponent} from './components/main-menu/main-menu.component';
import {MapEditorComponent} from './components/game/sidebars/map-editor/map-editor.component';
import {DevToolsComponent} from './components/game/sidebars/dev-tools/dev-tools.component';
import {CameraFormComponent} from './components/game/sidebars/dev-tools/components/camera-form/camera-form.component';
import {GenerateMapFormComponent} from './components/game/sidebars/dev-tools/components/generate-map-form/generate-map-form.component';
import {LoadGameFormComponent} from './components/game/sidebars/dev-tools/components/load-game-form/load-game-form.component';
import {SaveGameFormComponent} from './components/game/sidebars/dev-tools/components/save-game-form/save-game-form.component';
import {GameComponent} from './components/game/game.component';
import {StrategicViewComponent} from './components/game/maps/strategic-view/strategic-view.component';
import {TileYieldComponent} from './components/game/maps/tile-yield/tile-yield.component';
import {TileTextComponent} from './components/game/maps/tile-text/tile-text.component';
import {IsometricViewComponent} from './components/game/maps/isometric-view/isometric-view.component';
import {StatusBarComponent} from './components/game/hud/status-bar/status-bar.component';
import {MiniMapComponent} from './components/game/hud/mini-map/mini-map.component';
import {QuickLinksComponent} from './components/game/hud/quick-links/quick-links.component';
import {CivicsTreeComponent} from './components/game/modals/civics-tree/civics-tree.component';
import {TechTreeComponent} from './components/game/modals/tech-tree/tech-tree.component';
import {GameMenuComponent} from './components/game/modals/game-menu/game-menu.component';

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
import {TechnologyNamePipe} from './pipes/technology-name.pipe';


const COMPONENTS = [
  AppComponent,
  MainMenuComponent,
  MapEditorComponent,
  DevToolsComponent,
  CameraFormComponent,
  GenerateMapFormComponent,
  LoadGameFormComponent,
  SaveGameFormComponent,
  GameComponent,
  StrategicViewComponent,
  TileYieldComponent,
  TileTextComponent,
  IsometricViewComponent,
  StatusBarComponent,
  MiniMapComponent,
  QuickLinksComponent,
  CivicsTreeComponent,
  TechTreeComponent,
  GameMenuComponent,
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
