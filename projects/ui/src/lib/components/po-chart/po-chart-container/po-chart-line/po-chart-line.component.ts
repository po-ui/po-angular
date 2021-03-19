import { Component, ElementRef, Renderer2 } from '@angular/core';

import { PoChartLineBaseComponent } from './po-chart-line-base.component';
import { PoChartMathsService } from '../../services/po-chart-maths.service';

@Component({
  selector: '[po-chart-line]',
  templateUrl: './po-chart-line.component.svg'
})
export class PoChartLineComponent extends PoChartLineBaseComponent {
  constructor(
    protected mathsService: PoChartMathsService,
    protected renderer: Renderer2,
    protected elementRef: ElementRef
  ) {
    super(mathsService, renderer, elementRef);
  }

  onEnter(serieIndex: number) {
    return null;
  }
  onLeave(serieIndex: number) {
    return null;
  }

  onSeriePointHover(selectedItem: any) {
    const { relativeTo, ...item } = selectedItem;

    this.reorderSVGGroup(relativeTo);
    this.pointHover.emit(item);
  }

  // É necessário reordenar os svgs on hover pois eventualmente os elemntos svg ficam por trás de outros. Não há z-index para svgElement.
  private reorderSVGGroup(pathGroup: string) {
    const pathGroupElement = this.elementRef.nativeElement.querySelectorAll(`.${pathGroup}`);

    this.animate = false;
    this.renderer.appendChild(this.chartLine.nativeElement, pathGroupElement[0]);
  }
}
