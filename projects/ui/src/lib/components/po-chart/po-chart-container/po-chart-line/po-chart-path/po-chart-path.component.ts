import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { convertToBoolean, isIE } from '../../../../../utils/util';

const pathDashoffsetDefaultWidth = 0;

@Component({
  selector: '[po-chart-path]',
  templateUrl: './po-chart-path.component.svg'
})
export class PoChartPathComponent implements AfterViewInit {
  @Input({ alias: 'p-is-active', transform: convertToBoolean }) isActive: boolean = true;

  @Input({ alias: 'p-chart-line', transform: convertToBoolean }) chartLine: boolean = false;

  @Input('p-coordinates') coordinates: string;

  @ViewChild('chartPath', { static: true }) chartPath: ElementRef;

  pathWidth: number;

  private _animate: boolean;
  private _color: string;

  @Input('p-color') set color(value: string) {
    this._color = value.includes('po-color') && this.chartLine ? value.replace('po-color', 'po-border-color') : value;
  }

  get color() {
    return this._color;
  }

  @Input('p-animate') set animate(value: boolean) {
    this._animate = value;

    if (!this.animate) {
      this.pathWidth = pathDashoffsetDefaultWidth;
    }
  }

  get animate() {
    return this._animate;
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (!isIE()) {
      this.pathAnimation();
    }
  }

  private pathAnimation() {
    this.pathWidth = this.chartPath.nativeElement.getTotalLength();
    this.changeDetector.detectChanges();
    setTimeout(this.preventsAnimatingAgain.bind(this), 700);
  }

  // Redefine pathWidth para zero após o período da animação para que a linha se expanda normalmente on resize.
  private preventsAnimatingAgain() {
    this.pathWidth = pathDashoffsetDefaultWidth;
  }
}
