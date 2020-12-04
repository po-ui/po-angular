import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'po-gauge-description',
  templateUrl: './po-gauge-description.component.html'
})
export class PoGaugeDescriptionComponent {
  tooltip: string;

  @Input('p-description') description: string;

  @Input('p-has-ranges') hasRanges: boolean;

  @Input('p-description-width') descriptionWidth: number;

  @Input('p-value') value: number;

  @ViewChild('descriptionText') descriptionText: ElementRef;

  get isValidValue() {
    return this.value || this.value === 0;
  }

  verifyIfHasEllipsis() {
    const { offsetWidth, scrollWidth } = this.descriptionText.nativeElement;

    // O tooltip só exibe se adicionado dentro de setTimeout.
    setTimeout(() => {
      this.tooltip = offsetWidth < scrollWidth ? this.description : undefined;
    });
  }
}
