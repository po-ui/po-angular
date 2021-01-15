import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

import { PoChartPathCoordinates } from '../../../interfaces/po-chart-path-coordinates.interface';

@Component({
  selector: '[po-chart-circular-path]',
  templateUrl: './po-chart-circular-path.component.svg'
})
export class PoChartCircularPathComponent {
  @Input('p-serie') serie: PoChartPathCoordinates;

  @Output('p-on-click') onClick = new EventEmitter<any>();

  @Output('p-on-hover') onHover = new EventEmitter<any>();

  @ViewChild('svgPath', { read: ElementRef }) svgPath: ElementRef;

  constructor(private renderer: Renderer2) {}

  applyCoordinates(coordinates: string) {
    this.renderer.setAttribute(this.svgPath.nativeElement, 'd', coordinates);
  }

  onMouseClick() {
    const { label, data } = this.serie;

    this.onClick.emit({ label, data });
  }

  onMouseEnter() {
    const { label, data } = this.serie;

    this.onHover.emit({ label, data });
  }
}
