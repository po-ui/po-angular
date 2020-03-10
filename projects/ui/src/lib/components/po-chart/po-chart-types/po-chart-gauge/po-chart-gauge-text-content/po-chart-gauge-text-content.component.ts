import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';

import { convertNumberToDecimal } from '../../../../../utils/util';

import { PoChartGaugeSerie } from '../po-chart-gauge-series.interface';
import { poChartGaugeSerieWidth } from '../../po-chart-circular/po-chart-circular.constant';

@Component({
  selector: 'po-chart-gauge-text-content',
  templateUrl: './po-chart-gauge-text-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoChartGaugeTextContentComponent implements AfterViewInit {
  serieValueConverted: string;
  tooltip: string;

  private _gaugeWidth: number;
  private _serie: PoChartGaugeSerie;

  @Input('p-gauge-width') set gaugeWidth(value: number) {
    this._gaugeWidth = value;

    this.checkTextDescriptionSize();
  }

  get gaugeWidth() {
    return this._gaugeWidth;
  }

  @Input('p-serie') set serie(serie: PoChartGaugeSerie) {
    if (serie) {
      this.serieValueConverted = this.convertValueInPercentFormat(serie.value);
      this._serie = { ...serie };
    } else {
      this._serie = undefined;
    }
  }

  get serie() {
    return this._serie;
  }

  @ViewChild('description', { read: ElementRef }) descriptionElement: ElementRef;

  constructor(private changeDetection: ChangeDetectorRef) {}

  get hasSerieDescription() {
    return this.serie && this.serie.description;
  }

  get hasSerieValue() {
    return this.serie && this.serie.value >= 0;
  }

  get maxDescriptionWidth() {
    // Diferença contemplando a largura do path base e padding interno.
    const subtractionArea = this.gaugeWidth * poChartGaugeSerieWidth * 2 * 2;
    const descriptionWidth = this.gaugeWidth - subtractionArea;

    return { 'max-width': `${descriptionWidth}px` };
  }

  ngAfterViewInit() {
    this.checkTextDescriptionSize();
  }

  private checkTextDescriptionSize() {
    if (this.descriptionElement) {
      // tooltip necessário para contornar comportamento inesperado do tooltip.
      setTimeout(() => {
        this.tooltip = this.isEllipsisActive();
      });
      this.changeDetection.detectChanges();
    }
  }

  private convertValueInPercentFormat(value: number): string {
    const decimalValue = String(convertNumberToDecimal(value, 1)).replace('.', ',');
    return `${decimalValue}%`;
  }

  private isEllipsisActive() {
    const isExceededWidth =
      this.descriptionElement.nativeElement.offsetWidth < this.descriptionElement.nativeElement.scrollWidth;

    return isExceededWidth ? this.serie.description : undefined;
  }
}
