import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// COMPONENTS
// general
import {AppComponent} from './components/app/app.component';
import {MainMenuComponent} from './components/main-menu/main-menu.component';

// map
import {MapComponent} from './components/map/map.component';

// hud
import {StatusBarComponent} from './components/hud/status-bar/status-bar.component';
import {QuickLinksComponent} from './components/hud/quick-links/quick-links.component';
import {MiniMapComponent} from './components/hud/mini-map/mini-map.component';
import {ScreenCenterMarkerComponent} from './components/hud/screen-center-marker/screen-center-marker.component';

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
import {GenerateMapFormComponent} from './components/sidebars/dev-tools/components/generate-map-form/generate-map-form.component';

// DIRECTIVES

// SERVICES
import {CameraService} from './services/camera.service';
import {SizeService} from './services/size.service';
import {GeneratorService} from './services/generator.service';
import {KeyboardService} from './services/keyboard.service';
import {LocalStorageService} from './services/local-storage.service';
import {MapGeneratorService} from './services/map-generator.service';
import {SaveService} from './services/save.service';
import {TileTerrainService} from './services/tile-terrain.service';
import {TileUiService} from './services/tile-ui.service';
import {TileYieldService} from './services/tile-yield.service';
import {ZipService} from './services/zip.service';
import {MapCanvasService} from './services/map-canvas.service';
import {MapZoomService} from './services/map-zoom.service';
import {WorldBuilderService} from './services/world-builder.service';

// STORES
import {CameraStore} from './stores/camera.store';
import {SizeStore} from './stores/size.store';
import {KeyBindingsStore} from './stores/key-bindings.store';
import {MapStore} from './stores/map.store';
import {GameplayUiStore} from './stores/gameplay-ui.store';
import {SaveHeadersStore} from './stores/save-headers.store';
import {UiStore} from './stores/ui.store';
import {WorldBuilderUiStore} from './stores/world-builder-ui.store';
import {WorldBuilderHoveredTilesStore} from './stores/world-builder-hovered-tiles.store';

// PIPES
import {TerrainBaseNamePipe} from './pipes/terrain-base-name.pipe';
import {TerrainFeatureNamePipe} from './pipes/terrain-feature-name.pipe';
import {TerrainImprovementNamePipe} from './pipes/terrain-improvement-name.pipe';
import {TerrainResourceNamePipe} from './pipes/terrain-resource-name.pipe';
import {EraNamePipe} from './pipes/era-name.pipe';
import {CivicNamePipe} from './pipes/ciciv-name.pipe';
import {TechnologyNamePipe} from './pipes/technology-name.pipe';
import {TileCssClassesPipe} from './pipes/tile-css-classes.pipe';
import {EraElemClassPipe} from './pipes/era-elem-class.pipe';
import {ResearchItemElemClassPipe} from './pipes/research-item-elem-class.pipe';


const COMPONENTS = [
  // general
  AppComponent,
  MainMenuComponent,
  // map
  MapComponent,
  // hud
  StatusBarComponent,
  QuickLinksComponent,
  MiniMapComponent,
  ScreenCenterMarkerComponent,
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
  GenerateMapFormComponent,
]

const DIRECTIVES = [
]

const SERVICES = [
  CameraService,
  SizeService,
  GeneratorService,
  KeyboardService,
  LocalStorageService,
  MapGeneratorService,
  SaveService,
  TileTerrainService,
  TileUiService,
  TileYieldService,
  ZipService,
  MapCanvasService,
  MapZoomService,
  WorldBuilderService,
]

const STORES = [
  CameraStore,
  SizeStore,
  KeyBindingsStore,
  MapStore,
  GameplayUiStore,
  SaveHeadersStore,
  UiStore,
  WorldBuilderUiStore,
  WorldBuilderHoveredTilesStore,
]

const PIPES = [
  TerrainBaseNamePipe,
  TerrainFeatureNamePipe,
  TerrainImprovementNamePipe,
  TerrainResourceNamePipe,
  EraNamePipe,
  CivicNamePipe,
  TechnologyNamePipe,
  TileCssClassesPipe,
  EraElemClassPipe,
  ResearchItemElemClassPipe,
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
