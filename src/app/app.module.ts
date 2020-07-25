import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './components/app/app.component';
import {BoardComponent} from './components/board/board.component';
import {DevToolsBoardLoaderComponent} from './components/dev-tools/dev-tools-board-loader.component';
import {DevToolsBoardGeneratorComponent} from './components/dev-tools/dev-tools-board-generator.component';
import {DevToolsCameraControllerComponent} from './components/dev-tools/dev-tools-camera-controller.component';
import {YieldComponent} from './components/yield/yield.component';

import {BoardGeneratorService} from './services/board-generator.service';
import {YieldCalculatorService} from './services/yield-calculator.service';

import {BoardStore} from './stores/board.store';
import {CameraStore} from './stores/camera.store';
import {UiStore} from './stores/ui.store';

import {TerrainBaseNamePipe} from './pipes/terrain-base-name.pipe';
import {TerrainFeatureNamePipe} from './pipes/terrain-feature-name.pipe';
import {TerrainImprovementNamePipe} from './pipes/terrain-improvement-name.pipe';
import {TerrainResourceNamePipe} from './pipes/terrain-resource-name.pipe';

const COMPONENTS = [
  AppComponent,
  BoardComponent,
  DevToolsBoardLoaderComponent,
  DevToolsBoardGeneratorComponent,
  DevToolsCameraControllerComponent,
  YieldComponent
]

const SERVICES = [
  BoardGeneratorService,
  YieldCalculatorService
]

const STORES = [
  BoardStore,
  CameraStore,
  UiStore
]

const PIPES = [
  TerrainBaseNamePipe,
  TerrainFeatureNamePipe,
  TerrainImprovementNamePipe,
  TerrainResourceNamePipe
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
