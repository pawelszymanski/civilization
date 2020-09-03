import {Millisecond} from '../utils/millisecond';

interface AnimationFrameTimeStats {
  recent: Millisecond;
  quickest: Millisecond;
  slowest: Millisecond;
  average: Millisecond;
}

interface AnimationFrameFpsStats {
  recent: number;
  highest: number;
  average: number;
}

export interface AnimationFrameStats {
  frame: AnimationFrameTimeStats;
  fps: AnimationFrameFpsStats;
}
