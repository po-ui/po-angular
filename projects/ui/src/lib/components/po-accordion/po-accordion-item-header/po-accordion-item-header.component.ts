import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PoLanguageService } from '../../../services/po-language';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

@Component({
  selector: 'po-accordion-item-header',
  templateUrl: 'po-accordion-item-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoAccordionItemHeaderComponent {
  private language: string = poLocaleDefault;

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
}
