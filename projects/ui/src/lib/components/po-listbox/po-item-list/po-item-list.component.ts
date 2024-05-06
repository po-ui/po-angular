import { Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { PoItemListOptionGroup } from './interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './interfaces/po-item-list-option.interface';
import { PoItemListBaseComponent } from './po-item-list-base.component';
import { PoItemListFilterMode } from '../enums/po-item-list-filter-mode.enum';

@Component({
  selector: 'po-item-list',
  templateUrl: './po-item-list.component.html'
})
export class PoItemListComponent extends PoItemListBaseComponent implements OnChanges {
  @ViewChild('itemList', { static: true }) itemList: ElementRef;

  selectedView: PoItemListOption;

  protected param;
  protected clickListener: () => void;

  constructor(private sanitized: DomSanitizer) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isTabs) {
      if (changes.tabHide?.currentValue || changes.disabled?.currentValue) {
        this.tabsItem.emit(this.item);
      } else if (changes.activeTabs?.currentValue) {
        this.emitActiveTabs(this.item);
      }
    }
  }

  onSelectItem(itemListOption: PoItemListOption | PoItemListOptionGroup | any): void {
    this.selectedView = itemListOption;
    this.selectItem.emit(itemListOption);
  }

  onCheckboxItem() {
    const option = { [this.fieldValue]: this.value, [this.fieldLabel]: this.label };
    const selected = !this.checkboxValue;
    this.checkboxItem.emit({ option, selected });
  }

  onComboItem(options: any, event: any) {
    const option = { [this.fieldValue]: this.value, [this.fieldLabel]: this.label };
    this.selectedView = options;
    this.comboItem.emit({ ...option, event });
  }

  compareObjects(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  onCheckboxItemEmit(event: KeyboardEvent) {
    if ((event && event.code === 'Enter') || event.code === 'Space') {
      this.onCheckboxItem();
    }
  }

  getLabelFormatted(label: string): SafeHtml {
    const sanitizedLabel = this.sanitizeTagHTML(label);
    let format: string = sanitizedLabel;

    if (this.isFiltering || this.validateForOptionsLabel()) {
      const labelInput = this.sanitizeTagHTML(this.searchValue.toString().toLowerCase());
      const labelLowerCase = sanitizedLabel.toLowerCase();

      const openTagBold = '<span class="po-font-text-large-bold">';
      const closeTagBold = '</span>';

      let startString;
      let middleString;
      let endString;

      switch (this.filterMode) {
        case PoItemListFilterMode.startsWith:
        case PoItemListFilterMode.contains:
          const indexOfLabelInput = labelLowerCase.indexOf(labelInput);

          if (indexOfLabelInput > -1) {
            startString = sanitizedLabel.substring(0, indexOfLabelInput);

            middleString = sanitizedLabel.substring(indexOfLabelInput, indexOfLabelInput + labelInput.length);
            endString = sanitizedLabel.substring(indexOfLabelInput + labelInput.length);

            format = startString + openTagBold + middleString + closeTagBold + endString;
          }

          break;
        case PoItemListFilterMode.endsWith:
          const lastIndexOfLabelInput = labelLowerCase.lastIndexOf(labelInput);

          if (lastIndexOfLabelInput > -1) {
            startString = sanitizedLabel.substring(0, lastIndexOfLabelInput);
            middleString = sanitizedLabel.substring(lastIndexOfLabelInput);

            format = startString + openTagBold + middleString + closeTagBold;
          }
          break;
      }
    }

    return this.safeHtml(format);
  }

  validateForOptionsLabel(): boolean {
    return this.comboService && this.searchValue && !this.compareCache && this.shouldMarkLetters;
  }

  safeHtml(value): SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

  private sanitizeTagHTML(value: string = '') {
    return value.replace(/\</gm, '&lt;').replace(/\>/g, '&gt;');
  }
}
