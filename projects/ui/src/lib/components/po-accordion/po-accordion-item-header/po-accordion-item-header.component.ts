import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PoLanguageService } from '../../../services/po-language';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

@Component({
  selector: 'po-accordion-item-header',
  templateUrl: 'po-accordion-item-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoAccordionItemHeaderComponent {
  private language: string = poLocaleDefault;

  @ViewChild('accordionElement', { read: ElementRef, static: true }) accordionElement: ElementRef;
  @ViewChild('accordionHeaderElement', { read: ElementRef, static: true }) accordionHeaderElement: ElementRef;

  @Input('p-expanded') expanded: boolean = false;

  @Input('p-label') label: string;

  @Input('p-label-tag') labelTag: string;

  @Input('p-type-tag') typeTag: string;

  @Input('p-disabled') disabledItem: boolean;

  @Output('p-toggle') toggle = new EventEmitter<boolean>();

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  onClick() {
    this.expanded = !this.expanded;

    this.toggle.emit(this.expanded);
  }

  getTooltip() {
    const widthContainer = this.accordionElement.nativeElement.offsetWidth - 56;
    const widthHeaderElement = this.accordionHeaderElement.nativeElement.offsetWidth;

    if (widthHeaderElement >= widthContainer) {
      return this.label;
    }
    return null;
  }
}
