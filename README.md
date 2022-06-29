# CivApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).




# Code style

## General rules
1. Use SCSS over HTML and HTML over TS


## Imports

1. Angular, Angular dependencies, external libraries
1. Interfaces, Types, Enums
1. Constants
1. Services
1. Stores

Example:
```javascript
import {Component, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {Modal, SidebarId} from '../../models/ui/ui';
import {KeyBindings} from '../../models/ui/key-bindings';

import {KEY_MODIFIER_ALT, KEY_MODIFIER_CTRL, KEY_MODIFIER_NONE, KEY_MODIFIER_SHIFT} from '../../consts/ui/key-bindings.const';

import {KeyboardHelperService} from '../../services/keyboard-helper.service';

import {KeyBindingsStore} from '../../stores/key-bindings.store';
import {UiStore} from '../../stores/ui.store';
```

## Stores

1. Use BehaviorSubject with default state set
1. Expose value through `public readonly ... = ....asObservable();` pattern
1. Have public `next` method
1. Keep methods simple, avoid logic

Example:
```javascript
  private _camera: BehaviorSubject<Camera> = new BehaviorSubject(DEFAULT_CAMERA);

  public readonly camera: Observable<Camera> = this._camera.asObservable();

  constructor(
    private cameraHelperService: CameraService
  ) {
    this.cameraHelperService.setTileSizeCssVariable(DEFAULT_CAMERA.tileSize);
  }

  private next(camera: Camera) {
    this._camera.next(camera);
    this.cameraHelperService.setTileSizeCssVariable(camera.tileSize);
  }

  public setTileSize(tileSize: number) {
    this.next({...this._camera.value, tileSize});
  }

  public setTranslate(translate: Coords) {
    this.next({...this._camera.value, translate});
  }

  public setZoomLevel(zoomLevel: number) {
    this.next({...this._camera.value, zoomLevel, tileSize: CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[zoomLevel]});
  }

  public resetAll() {
    this.next({...DEFAULT_CAMERA});
  }

```
