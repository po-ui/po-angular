import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

import { PoChartLabelCoordinates } from '../../../interfaces/po-chart-label-coordinates.interface';

@Component({
  selector: '[po-chart-circular-label]',
  templateUrl: './po-chart-circular-label.component.svg'
})
export class PoChartCircularLabelComponent {
  @Input('p-serie') serie: PoChartLabelCoordinates;

  @Input('p-show-label') showLabel: boolean;

  @ViewChild('svgLabel', { read: ElementRef }) svgLabel: ElementRef;

  constructor(private changeDetection: ChangeDetectorRef, private renderer: Renderer2) {}

  applyCoordinates(coordinates: PoChartLabelCoordinates) {
    this.renderer.setAttribute(this.svgLabel.nativeElement, 'x', coordinates.xCoordinate.toString());
    this.renderer.setAttribute(this.svgLabel.nativeElement, 'y', coordinates.yCoordinate.toString());
    this.showLabel = true;
    this.changeDetection.detectChanges();
  }
}
