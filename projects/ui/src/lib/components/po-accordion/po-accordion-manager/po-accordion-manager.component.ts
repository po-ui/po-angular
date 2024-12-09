import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { PoAccordionLiterals } from '../interfaces/po-accordion-literals.interface';

@Component({
  selector: 'po-accordion-manager',
  templateUrl: 'po-accordion-manager.component.html',
  standalone: false
})
export class PoAccordionManagerComponent implements OnChanges {
  labelValue: string = '';
  changeDetector = inject(ChangeDetectorRef);

  @ViewChild('accordionHeaderButtonManagerElement', { read: ElementRef, static: true }) accordionElement: ElementRef;
  @ViewChild('accordionHeaderManagerElement', { read: ElementRef, static: true }) accordionHeaderElement: ElementRef;

  @Input('p-expanded-all-items') expandedAllItems: boolean = false;

  @Input('p-literals') literals: PoAccordionLiterals;

  @Output('p-click') clickManager = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
    this.labelValue = changes.expandedAllItems.currentValue
      ? this.literals.closeAllItems
      : this.literals.expandAllItems;
    this.changeDetector.detectChanges();
  }

  onClick() {
    this.clickManager.emit();
  }

  getTooltip() {
    const widthContainer = this.accordionElement.nativeElement.offsetWidth - 69;
    const widthHeaderElement = this.accordionHeaderElement.nativeElement.offsetWidth;

    if (widthHeaderElement >= widthContainer) {
      return this.labelValue;
    }
    return null;
  }
}
