import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './components/app/app.component';
import {BoardComponent} from './components/board/board.component';
import {DevToolsComponent} from './components/dev-tools/dev-tools.component';
import {YieldComponent} from './components/yiled/yield.component';

import {BoardGeneratorService} from './services/board-generator.service';
import {YieldCalculatorService} from './services/yield-calculator.service';

import {BoardStore} from './stores/board.store';
import {CameraStore} from './stores/camera.store';

const COMPONENTS = [
  AppComponent,
  BoardComponent,
  DevToolsComponent,
  YieldComponent
]

const SERVICES = [
  BoardGeneratorService,
  YieldCalculatorService
]

const STORES = [
  BoardStore,
  CameraStore
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
