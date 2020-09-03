import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

import {AnimationFrameStats} from '../../../../../../../models/fps-meter/animation-frame-stats';
import {FpsMeterModeId} from '../../../../../../../models/fps-meter/fps-meter-mode.enum';
import {Uuid} from '../../../../../../../models/utils/uuid';

import {AnimationFramesService} from '../../../../../../../services/utils/animation-frames.service';

import {FpsHistoryStore} from '../../../../../../../stores/fps-store.service';

@Component({
  selector: '.fps-chart-component',
  templateUrl: './fps-chart.component.html',
  styleUrls: ['./fps-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FpsChartComponent {

  MAX_SINGLE_FRAME_TIME = 1000;
  MAX_AVERAGE_FRAME_TIME = 100;
  MAX_SINGLE_FPS = 100;
  MAX_AVERAGE_FPS = 100;

  @Input() isEnabled: boolean = false;

  animationFrameStats: AnimationFrameStats[];
  animationFrameStatsSub: Subscription;

  fpsServiceId: Uuid;

  fpsMeterMode = FpsMeterModeId.FRAME_TIME;
  FpsMeterModeId = FpsMeterModeId;

  constructor(
    private animationFramesService: AnimationFramesService,
    private animationFramesStore: FpsHistoryStore
  ) {}

  ngOnInit() {
    this.subscribeToData();
    this.registerToFpsService();
  }

  ngOnDestroy() {
    this.unsubscribeFromData();
    this.unregisterFromFpsService();
  }

  subscribeToData() {
    this.animationFrameStatsSub = this.animationFramesStore.animationFrameStats.subscribe(AnimationFrameStats => this.animationFrameStats = AnimationFrameStats);
  }

  registerToFpsService() {
    this.fpsServiceId = this.animationFramesService.addListener();
  }

  unsubscribeFromData() {
    this.animationFrameStatsSub.unsubscribe();
  }

  unregisterFromFpsService() {
    this.animationFramesService.removeListener(this.fpsServiceId);
  }

  frameElemHeightPc(animationFrameStats: AnimationFrameStats) {
    switch (this.fpsMeterMode) {
      case FpsMeterModeId.FRAME_TIME:
        return (animationFrameStats.frame.recent / this.MAX_SINGLE_FRAME_TIME) * 100;
      case FpsMeterModeId.AVERAGE_FRAME_TIME:
        return (animationFrameStats.frame.average / this.MAX_AVERAGE_FRAME_TIME) * 100;
      case FpsMeterModeId.FPS:
        return (animationFrameStats.fps.recent / this.MAX_SINGLE_FPS) * 100;
      case FpsMeterModeId.AVERAGE_FPS:
        return (animationFrameStats.fps.average / this.MAX_AVERAGE_FPS) * 100;
    }

  }

}
