import {PerformanceMeterModeId} from '../models/performance-meter';

export const CANVAS = {
  WIDTH: 360,   // make sure same values are set in the HTML
  HEIGHT: 120,  // make sure same values are set in the HTML

  DATA_FILL_STYLE: 'rgba(255, 255, 255, 200)',

  LEGEND_FONT: '12px Calibri',
  LEGEND_FILL_STYLE: 'rgba(255, 255, 255, 10)',    // TODO: BUG: for some reason alpha setting is not respected
  LEGEND_STROKE_STYLE: 'rgba(255, 255, 255, 10)',  // TODO: BUG: for some reason alpha setting is not respected
};

// length of the data table, for sharp picture keep it a divisor of CANVAS_WIDTH
export const MAX_VALUES = 60;

export const CHART = {
  WIDTH_TO_RESULTS_RATIO: CANVAS.WIDTH / MAX_VALUES,  // 360 / 60 = 6
  MAX_SINGLE_FRAME_VALUE: 200,
  MAX_SINGLE_FPS_VALUE: 100,
};

export const PERFORMANCE_MODE_TO_RANGE_MAP = {
  [PerformanceMeterModeId.FRAME]: CHART.MAX_SINGLE_FRAME_VALUE,
  [PerformanceMeterModeId.FPS]: CHART.MAX_SINGLE_FPS_VALUE
};
