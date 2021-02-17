import { ChangeDetectorRef, Component, DoCheck, ElementRef, ViewChild } from '@angular/core';

import { PoGaugePadding } from './po-gauge-default-values.constant';

import { PoColorService } from '../../services/po-color/po-color.service';

import { PoGaugeBaseComponent } from './po-gauge-base.component';
import { PoGaugeSvgContainer } from './interfaces/po-gauge-svg-container.interface';

/**
 * @docsExtends PoGaugeBaseComponent
 *
 * @example
 *
 * <example name="po-gauge-basic" title="PO Gauge Basic">
 *  <file name="sample-po-gauge-basic/sample-po-gauge-basic.component.html"> </file>
 *  <file name="sample-po-gauge-basic/sample-po-gauge-basic.component.ts"> </file>
 * </example>
 * <example name="po-gauge-labs" title="PO Gauge Labs">
 *  <file name="sample-po-gauge-labs/sample-po-gauge-labs.component.html"> </file>
 *  <file name="sample-po-gauge-labs/sample-po-gauge-labs.component.ts"> </file>
 * </example>
 * <example name="po-gauge-summary" title="PO Gauge Summary">
 *  <file name="sample-po-gauge-summary/sample-po-gauge-summary.component.html"> </file>
 *  <file name="sample-po-gauge-summary/sample-po-gauge-summary.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-gauge',
  templateUrl: './po-gauge.component.html'
})
export class PoGaugeComponent extends PoGaugeBaseComponent implements DoCheck {
  svgContainer: PoGaugeSvgContainer;

  private isLoaded: boolean = false;

  @ViewChild('descriptionEl', { read: ElementRef }) descriptionEl: ElementRef;
  @ViewChild('legendEl', { read: ElementRef }) legendEl: ElementRef;
  @ViewChild('titleEl', { read: ElementRef }) titleEl: ElementRef;
  @ViewChild('svgEl', { read: ElementRef }) svgEl: ElementRef;

  constructor(protected colorService: PoColorService, private changeDetector: ChangeDetectorRef) {
    super(colorService);
  }

  private get hasElementRef() {
    return !!this.svgEl?.nativeElement.offsetWidth;
  }

  get hasRanges(): boolean {
    return this.ranges.length > 0;
  }

  ngDoCheck() {
    if (!this.isLoaded && this.hasElementRef) {
      this.isLoaded = true;
      this.svgContainerSize();
    }
  }

  protected svgContainerSize(): void {
    if (this.svgEl?.nativeElement.offsetWidth) {
      this.changeDetector.detectChanges();

      const titleHeight = this.titleEl.nativeElement?.offsetHeight ?? 0;
      const legendHeight = this.legendEl.nativeElement?.offsetHeight ?? 0;
      const descriptionHeight = this.descriptionEl.nativeElement?.offsetHeight ?? 0;

      const height = this.height - titleHeight - legendHeight - descriptionHeight - PoGaugePadding * 2;
      const width = this.svgEl.nativeElement.offsetWidth;

      this.svgContainer = { width, height };
    }
  }
}
