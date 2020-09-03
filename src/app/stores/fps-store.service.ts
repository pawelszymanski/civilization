import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {AnimationFrameStats} from '../models/fps-meter/animation-frame-stats';
import {Millisecond} from '../models/utils/millisecond';

@Injectable()
export class FpsHistoryStore {

  readonly FRAME_RESULTS_TO_KEEP = 100;

  private _animationFrameStats: BehaviorSubject<AnimationFrameStats[]> = new BehaviorSubject([]);

  public readonly animationFrameStats: Observable<AnimationFrameStats[]> = this._animationFrameStats.asObservable();

  private next(animationFrameTimes: AnimationFrameStats[]) {
    this._animationFrameStats.next(animationFrameTimes);
  }

  // Based on last frame time (`recentFrameTime`) and previous frame time we create a frame data
  // consisting of stats for this point in time.
  public addFpsFrame(recentFrameTime: Millisecond) {
    const animationFrameStats = this._animationFrameStats.getValue();

    const frameTimes = animationFrameStats.map(stat => stat.frame.recent).concat(recentFrameTime);
    const quickestFrameTime = Math.min(...frameTimes);
    const slowestFrameTime = Math.max(...frameTimes);
    const averageFrameTime = Math.round( frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length);

    animationFrameStats.push({
      frame: {
        recent: recentFrameTime,
        quickest: quickestFrameTime,
        slowest: slowestFrameTime,
        average: averageFrameTime
      },
      fps: {
        recent: Math.ceil(1000 / recentFrameTime),
        highest: Math.ceil(1000 / slowestFrameTime),
        average: Math.ceil(1000 / averageFrameTime)
      }
    });

    if (animationFrameStats.length > this.FRAME_RESULTS_TO_KEEP) { animationFrameStats.shift(); }

    this.next(animationFrameStats);
  }

  public empty() {
    this.next([]);
  }

}
