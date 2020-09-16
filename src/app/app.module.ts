import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// COMPONENTS
import {AppComponent} from './components/app/app.component';
import {MainMenuComponent} from './components/main-menu/main-menu.component';
import {WorldBuilderComponent} from './components/sidebars/world-builder/world-builder.component';
import {DevToolsComponent} from './components/sidebars/dev-tools/dev-tools.component';
import {PerformanceChartComponent} from './components/sidebars/dev-tools/components/performance-chart/performance-chart.component';
import {CameraFormComponent} from './components/sidebars/dev-tools/components/camera-form/camera-form.component';
import {MapSelectionFormComponent} from './components/sidebars/dev-tools/components/map-selection-form/map-selection-form.component';
import {GenerateMapFormComponent} from './components/sidebars/dev-tools/components/generate-map-form/generate-map-form.component';
import {IsometricViewComponent} from './components/game-map/isometric-view/isometric-view.component';
import {StrategicViewComponent} from './components/game-map/strategic-view/strategic-view.component';
import {StatusBarComponent} from './components/hud/status-bar/status-bar.component';
import {MiniMapComponent} from './components/hud/mini-map/mini-map.component';
import {QuickLinksComponent} from './components/hud/quick-links/quick-links.component';
import {ViewportCenterMarkerComponent} from './components/hud/viewport-center-marker/viewport-center-marker.component';
import {CivicTreeComponent} from './components/modals/research/civic-tree/civic-tree.component';
import {TechnologyTreeComponent} from './components/modals/research/technology-tree/technology-tree.component';
import {InGameMenuComponent} from './components/modals/menus/in-game-menu/in-game-menu.component';
import {SaveGameComponent} from './components/modals/save-and-load/save-game/save-game.component';
import {LoadGameComponent} from './components/modals/save-and-load/load-game/load-game.component';
import {SaveDetailsComponent} from './components/modals/save-and-load/save-details/save-details.component';
import {GameOptionsMenuComponent} from './components/modals/menus/game-options-menu/game-options-menu.component';
import {ExitGameConfirmationComponent} from './components/modals/menus/exit-game-confirmation/exit-game-confirmation.component';

// DIRECTIVES

// SERVICES
import {CameraHelperService} from './services/camera/camera-helper.service';
import {GameMapGeneratorService} from './services/game-map/game-map-generator.service';
import {YieldHelperService} from './services/game-map/yield-helper.service';
import {SaveHelperService} from './services/saves/save-helper.service';
import {KeyboardHelperService} from './services/ui/keyboard-helper.service';
import {MouseHelperService} from './services/ui/mouse-helper.service';
import {GeneratorService} from './services/utils/generator.service';
import {LocalStorageService} from './services/utils/local-storage.service';

// STORES
import {CameraStore} from './stores/camera.store';
import {GameMapStore} from './stores/game-map.store';
import {KeyBindingsStore} from './stores/key-bindings.store';
import {SavesStore} from './stores/saves.store';
import {UiStore} from './stores/ui.store';
import {WorldBuilderUiStore} from './stores/world-builder-ui.store';

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
  WorldBuilderComponent,
  DevToolsComponent,
  PerformanceChartComponent,
  CameraFormComponent,
  MapSelectionFormComponent,
  GenerateMapFormComponent,
  IsometricViewComponent,
  StrategicViewComponent,
  StatusBarComponent,
  MiniMapComponent,
  ViewportCenterMarkerComponent,
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
  CameraHelperService,
  GameMapGeneratorService,
  YieldHelperService,
  SaveHelperService,
  KeyboardHelperService,
  MouseHelperService,
  GeneratorService,
  LocalStorageService,
]

const STORES = [
  CameraStore,
  GameMapStore,
  KeyBindingsStore,
  SavesStore,
  UiStore,
  WorldBuilderUiStore,
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
    { provide: Window, useValue: window },
    ...SERVICES,
    ...STORES,
    ...PIPES
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
