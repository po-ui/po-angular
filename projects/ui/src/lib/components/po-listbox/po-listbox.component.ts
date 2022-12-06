import { AfterViewInit, Component, ElementRef, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

import { PoListBoxBaseComponent } from './po-listbox-base.component';

import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoLanguageService } from '../../services/po-language/po-language.service';

@Component({
  selector: 'po-listbox',
  templateUrl: './po-listbox.component.html'
})
export class PoListBoxComponent extends PoListBoxBaseComponent implements AfterViewInit, OnChanges {
  @ViewChild('listbox', { static: true }) listbox: ElementRef;

  constructor(private renderer: Renderer2, languageService: PoLanguageService) {
    super(languageService);
  }

  ngAfterViewInit(): void {
    this.setListBoxMaxHeight();
  }

  ngOnChanges(changes?: SimpleChanges): void {
    if (changes?.items) {
      this.setListBoxMaxHeight();
    }
  }

  onSelectItem(value: PoItemListOption | PoItemListOptionGroup | any): any {
    this.selectItem.emit(value);
  }

  private setListBoxMaxHeight(): void {
    const itemsLength = this.items.length;
    if (itemsLength > 6) {
      // this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${(2.75 * 6) - (2.75 / 3)}em`);
      this.renderer.setStyle(this.listbox.nativeElement, 'maxHeight', `${44 * 6 - 44 / 3}px`);
    }
  }
}
