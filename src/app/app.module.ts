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
import {StrategicViewComponent} from './components/app/components/game-map/strategic-view/strategic-view.component';
import {TileYieldComponent} from './components/app/components/game-map/tile-yield/tile-yield.component';
import {TileTextComponent} from './components/app/components/game-map/tile-text/tile-text.component';
import {IsometricViewComponent} from './components/app/components/game-map/isometric-view/isometric-view.component';
import {StatusBarComponent} from './components/app/components/hud/status-bar/status-bar.component';
import {MiniMapComponent} from './components/app/components/hud/mini-map/mini-map.component';
import {QuickLinksComponent} from './components/app/components/hud/quick-links/quick-links.component';
import {CivicTreeComponent} from './components/app/components/modals/research/civic-tree/civic-tree.component';
import {TechnologyTreeComponent} from './components/app/components/modals/research/technology-tree/technology-tree.component';
import {InGameMenuComponent} from './components/app/components/modals/menus/in-game-menu/in-game-menu.component';
import {SaveGameComponent} from './components/app/components/modals/save-and-load/save-game/save-game.component';
import {LoadGameComponent} from './components/app/components/modals/save-and-load/load-game/load-game.component';
import {SaveDetailsComponent} from './components/app/components/modals/save-and-load/save-details/save-details.component';
import {GameOptionsMenuComponent} from './components/app/components/modals/menus/game-options-menu/game-options-menu.component';
import {ExitGameConfirmationComponent} from './components/app/components/modals/menus/exit-game-confirmation/exit-game-confirmation.component';

// DIRECTIVES

// SERVICES
import {GameMapGeneratorService} from './services/game-map-generator.service';
import {GeneratorService} from './services/generator.service';
import {LocalStorageService} from './services/local-storage.service';
import {SaveSorterService} from './services/save-sorter.service';
import {YieldCalculatorService} from './services/yield-calculator.service';

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
  SaveDetailsComponent,
  GameOptionsMenuComponent,
  ExitGameConfirmationComponent
]

const DIRECTIVES = [
]

const SERVICES = [
  GameMapGeneratorService,
  GeneratorService,
  LocalStorageService,
  SaveSorterService,
  YieldCalculatorService
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
    ...DIRECTIVES,
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
