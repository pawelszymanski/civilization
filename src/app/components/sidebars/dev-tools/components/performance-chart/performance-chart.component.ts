import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy, OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {interval, Subscription} from 'rxjs';

import {PerformanceMeterModeId} from '../../../../../models/performance-meter';
import {Millisecond} from '../../../../../models/utils';

import {CANVAS, CHART, MAX_VALUES, PERFORMANCE_MODE_TO_RANGE_MAP} from '../../../../../consts/performance-meter.const';

import {GeneratorService} from '../../../../../services/generator.service';

@Component({
  selector: '.performance-chart-component',
  templateUrl: './performance-chart.component.html',
  styleUrls: ['./performance-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceChartComponent implements OnInit, OnDestroy {

  readonly AVERAGE_VALUE_INTERVAL = 500;

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  then: Millisecond;
  now: Millisecond;

  performanceMeterMode: PerformanceMeterModeId;
  PerformanceMeterModeId = PerformanceMeterModeId;

  recordedValues: number[] = [];
  averageFrame: string;
  averageFps: string;

  animationFrameId: number;

  subscriptions: Subscription[] = [];

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private generatorService: GeneratorService,
  ) {}

  ngOnInit(): void {
    this.initContext();
    this.setMeterMode(PerformanceMeterModeId.FRAME);
    this.initRequestAnimationFrame();
    this.initAverageValuesCalculations();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromData();
    this.cancelAnimationFrame();
  }

  initContext(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  initRequestAnimationFrame(): void {
    this.ngZone.runOutsideAngular(() => {
      this.then = this.generatorService.nowMilliseconds();
      this.requestAnimationFrame();
    });
  }

  initAverageValuesCalculations(): void {
    this.subscriptions.push(
      interval(this.AVERAGE_VALUE_INTERVAL).subscribe(() => this.updateAverageValues())
    );
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancelAnimationFrame(): void {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  setMeterMode(meterMode: PerformanceMeterModeId): void {
    if (meterMode !== this.performanceMeterMode) {
      this.performanceMeterMode = meterMode;
      this.recordedValues = [];
    }
  }

  requestAnimationFrame(): void {
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.requestAnimationFrame();
      this.now = this.generatorService.nowMilliseconds();
      const frameTime = this.now - this.then;
      this.addMeterData(frameTime);
      this.trimMeterData();
      this.then = this.now;
      this.cdr.detectChanges();
      this.drawChart();
    });
  }

  addMeterData(frameTime: Millisecond): void {
    switch (this.performanceMeterMode) {
      case PerformanceMeterModeId.FRAME:
        this.recordedValues.push(frameTime);
        break;
      case PerformanceMeterModeId.FPS:
        this.recordedValues.push(Math.floor(1000 / frameTime));
        break;
    }
  }

  trimMeterData(): void {
    if (this.recordedValues.length > MAX_VALUES) { this.recordedValues.shift(); }
  }

  drawChart(): void {
    this.clearCanvas();
    this.drawLegend();
    this.drawData();
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
  }

  drawLegend(): void {
    const range = PERFORMANCE_MODE_TO_RANGE_MAP[this.performanceMeterMode];

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = CANVAS.LEGEND_STROKE_STYLE;

    this.ctx.beginPath();
    this.ctx.moveTo(0, CANVAS.HEIGHT * 0.25 + .5);
    this.ctx.lineTo(CANVAS.WIDTH, CANVAS.HEIGHT * 0.25 + .5);
    this.ctx.moveTo(0, CANVAS.HEIGHT * 0.50 + .5);
    this.ctx.lineTo(CANVAS.WIDTH, CANVAS.HEIGHT * 0.50 + .5);
    this.ctx.moveTo(0, CANVAS.HEIGHT * 0.75 + .5);
    this.ctx.lineTo(CANVAS.WIDTH, CANVAS.HEIGHT * 0.75 + .5);
    this.ctx.stroke();

    this.ctx.font = CANVAS.LEGEND_FONT;
    this.ctx.fillStyle = CANVAS.LEGEND_FILL_STYLE;

    this.ctx.fillText(range.toString(), 3, 12);
    this.ctx.fillText((range * 0.75).toString(), 3, CANVAS.HEIGHT * 0.25 + 12);
    this.ctx.fillText((range * 0.50).toString(), 3, CANVAS.HEIGHT * 0.50 + 12);
    this.ctx.fillText((range * 0.25).toString(), 3, CANVAS.HEIGHT * 0.75 + 12);
  }

  drawData(): void {
    const dataDeficitCount = MAX_VALUES - this.recordedValues.length;
    const dataDeficitHorizontalCompensation = dataDeficitCount * CHART.WIDTH_TO_RESULTS_RATIO;
    const range = PERFORMANCE_MODE_TO_RANGE_MAP[this.performanceMeterMode];

    this.ctx.fillStyle = CANVAS.DATA_FILL_STYLE;

    this.recordedValues.forEach((value, i) => {
      const barHeight = value / range * CANVAS.HEIGHT;
      const x1 = i * CHART.WIDTH_TO_RESULTS_RATIO + dataDeficitHorizontalCompensation;
      const y1 = CANVAS.HEIGHT - barHeight;
      this.ctx.fillRect(x1, y1, CHART.WIDTH_TO_RESULTS_RATIO - 1, barHeight);
    });
  }

  updateAverageValues(): void {
    const sum = this.recordedValues.reduce((a, b) => a + b, 0);
    const average = (sum / this.recordedValues.length).toFixed(2);

    switch (this.performanceMeterMode) {
      case PerformanceMeterModeId.FRAME:
        this.averageFrame = average;
        this.averageFps = null;
        break;
      case PerformanceMeterModeId.FPS:
        this.averageFrame = null;
        this.averageFps = average;
        break;
    }
  }

}
