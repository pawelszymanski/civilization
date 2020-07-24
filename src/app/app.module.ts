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

const PIPES = []

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
