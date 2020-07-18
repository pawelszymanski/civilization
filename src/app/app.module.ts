import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './components/app/app.component';
import {DevToolsComponent} from './components/dev-tools/dev-tools.component';
import {GameMapComponent} from './components/game-map/game-map.component';

import {MapGeneratorService} from './services/map-generator.service';
import {GameMapStore} from './stores/game-map.store';
import {CameraStore} from './stores/camera.store';

const COMPONENTS = [
  AppComponent,
  DevToolsComponent,
  GameMapComponent,
]

const SERVICES = [
  MapGeneratorService
]

const STORES = [
  GameMapStore,
  CameraStore
]

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ...SERVICES,
    ...STORES
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
