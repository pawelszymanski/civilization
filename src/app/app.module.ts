import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// COMPONENTS
// general
import {AppComponent} from './components/app/app.component';
import {MainMenuComponent} from './components/main-menu/main-menu.component';

// maps
import {StrategicMapOnCanvasComponent} from './components/maps/strategic-map-on-canvas/strategic-map-on-canvas.component';
import {StrategicMapInHtmlComponent} from './components/maps/strategic-map-in-html/strategic-map-in-html.component';
import {TileTextComponent} from './components/maps/strategic-map-in-html/tile-text/tile-text.component';
import {TileYieldComponent} from './components/maps/strategic-map-in-html/tile-yield/tile-yield.component';

// hud
import {StatusBarComponent} from './components/hud/status-bar/status-bar.component';
import {QuickLinksComponent} from './components/hud/quick-links/quick-links.component';
import {MiniMapComponent} from './components/hud/mini-map/mini-map.component';
import {ViewportCenterMarkerComponent} from './components/hud/viewport-center-marker/viewport-center-marker.component';

// gameplay modals
import {CivicTreeComponent} from './components/modals/research/civic-tree/civic-tree.component';
import {TechnologyTreeComponent} from './components/modals/research/technology-tree/technology-tree.component';

// menu modals
import {InGameMenuComponent} from './components/modals/menus/in-game-menu/in-game-menu.component';
import {SaveGameComponent} from './components/modals/save-and-load/save-game/save-game.component';
import {LoadGameComponent} from './components/modals/save-and-load/load-game/load-game.component';
import {SaveDetailsComponent} from './components/modals/save-and-load/save-details/save-details.component';
import {GameOptionsMenuComponent} from './components/modals/menus/game-options-menu/game-options-menu.component';
import {ExitGameConfirmationComponent} from './components/modals/menus/exit-game-confirmation/exit-game-confirmation.component';

// world builder
import {WorldBuilderComponent} from './components/sidebars/world-builder/world-builder.component';

// dev-tools
import {DevToolsComponent} from './components/sidebars/dev-tools/dev-tools.component';
import {PerformanceChartComponent} from './components/sidebars/dev-tools/components/performance-chart/performance-chart.component';
import {CameraFormComponent} from './components/sidebars/dev-tools/components/camera-form/camera-form.component';
import {MapSelectionFormComponent} from './components/sidebars/dev-tools/components/map-selection-form/map-selection-form.component';
import {GenerateMapFormComponent} from './components/sidebars/dev-tools/components/generate-map-form/generate-map-form.component';

// DIRECTIVES

// SERVICES
import {CameraService} from './services/camera.service';
import {StrategicMapInHtmlCameraService} from './services/strategic-map-in-html-camera.service';
import {GeneratorService} from './services/generator.service';
import {KeyboardService} from './services/keyboard.service';
import {LocalStorageService} from './services/local-storage.service';
import {MapGeneratorService} from './services/map-generator.service';
import {MouseService} from './services/mouse.service';
import {SaveService} from './services/save.service';
import {TileService} from './services/tile.service';
import {YieldService} from './services/yield.service';

// STORES
import {CameraStore} from './stores/camera.store';
import {KeyBindingsStore} from './stores/key-bindings.store';
import {MapStore} from './stores/map.store';
import {MapUiStore} from './stores/map-ui.store';
import {SavesStore} from './stores/saves.store';
import {UiStore} from './stores/ui.store';
import {WorldBuilderUiStore} from './stores/world-builder-ui.store';

// PIPES
import {TerrainBaseNamePipe} from './pipes/terrain-base-name.pipe';
import {TerrainFeatureNamePipe} from './pipes/terrain-feature-name.pipe';
import {TerrainImprovementNamePipe} from './pipes/terrain-improvement-name.pipe';
import {TerrainResourceNamePipe} from './pipes/terrain-resource-name.pipe';
import {EraNamePipe} from './pipes/era-name.pipe';
import {CivicNamePipe} from './pipes/ciciv-name.pipe';
import {TechnologyNamePipe} from './pipes/technology-name.pipe';
import {TilesInColumnPipe} from './pipes/tiles-in-column.pipe';
import {TileCssClassesPipe} from './pipes/tile-css-classes.pipe';


const COMPONENTS = [
  // general
  AppComponent,
  MainMenuComponent,
  // maps
  StrategicMapOnCanvasComponent,
  StrategicMapInHtmlComponent,
  TileTextComponent,
  TileYieldComponent,
  // hud
  StatusBarComponent,
  QuickLinksComponent,
  MiniMapComponent,
  ViewportCenterMarkerComponent,
  // gameplay modals
  CivicTreeComponent,
  TechnologyTreeComponent,
  // menu modals
  InGameMenuComponent,
  SaveGameComponent,
  LoadGameComponent,
  SaveDetailsComponent,
  GameOptionsMenuComponent,
  ExitGameConfirmationComponent,
  // world builder
  WorldBuilderComponent,
  // dev-tools
  DevToolsComponent,
  PerformanceChartComponent,
  CameraFormComponent,
  MapSelectionFormComponent,
  GenerateMapFormComponent,
]

const DIRECTIVES = [
]

const SERVICES = [
  CameraService,
  StrategicMapInHtmlCameraService,
  GeneratorService,
  KeyboardService,
  LocalStorageService,
  MapGeneratorService,
  MouseService,
  SaveService,
  TileService,
  YieldService,
]

const STORES = [
  CameraStore,
  KeyBindingsStore,
  MapStore,
  MapUiStore,
  SavesStore,
  UiStore,
  WorldBuilderUiStore,
]

const PIPES = [
  TerrainBaseNamePipe,
  TerrainFeatureNamePipe,
  TerrainImprovementNamePipe,
  TerrainResourceNamePipe,
  EraNamePipe,
  CivicNamePipe,
  TechnologyNamePipe,
  TilesInColumnPipe,
  TileCssClassesPipe,
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
