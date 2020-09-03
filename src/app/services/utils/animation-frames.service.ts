import {Injectable} from '@angular/core';

import {Millisecond} from '../../models/utils/millisecond';
import {Uuid} from '../../models/utils/uuid';

import {GeneratorService} from './generator.service';

import {FpsHistoryStore} from '../../stores/fps-store.service';

@Injectable({providedIn: 'root'})
export class AnimationFramesService {

  listenerIds: Uuid[] = [];

  then: Millisecond;
  now: Millisecond;

  isWindowFocused = true;

  constructor(
    private window: Window,
    private generatorService: GeneratorService,
    private animationFramesStore: FpsHistoryStore
  ) {
    this.initFocusAndBlurEvents();
  }

  initFocusAndBlurEvents() {
    window.addEventListener('focus', () => {
      this.isWindowFocused = true;
      if (this.shallCollectData()) { this.startCollectingData(); }
    });
    window.addEventListener('blur', () => {
      this.isWindowFocused = false;
    });
  }

  addListener() {
    if (this.listenerIds.length === 0) { this.startCollectingData() }
    const listenerId = this.generatorService.uuid();
    this.listenerIds.push(listenerId);
    return listenerId;
  }

  removeListener(listenerId: Uuid) {
    this.listenerIds = this.listenerIds.filter(c => c !== listenerId);
  }

  // If there are active data customers and window is focused
  shallCollectData(): boolean {
    return this.listenerIds.length > 0 && this.isWindowFocused;
  }

  startCollectingData() {
    this.initAnimationFrameLoop();
  }

  initAnimationFrameLoop() {
    this.then = this.generatorService.nowMilliseconds();
    this.requestAnimationFrame();
  }

  requestAnimationFrame() {
    window.requestAnimationFrame(() => {
      if (this.shallCollectData()) {
        this.now = this.generatorService.nowMilliseconds();
        this.animationFramesStore.addFpsFrame(this.now - this.then);
        this.then = this.now;
        this.requestAnimationFrame();
      } else {
        this.animationFramesStore.empty();
      }
    });
  }

}
