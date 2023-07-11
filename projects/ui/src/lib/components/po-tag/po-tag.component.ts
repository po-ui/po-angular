import { PoLanguageService } from './../../services/po-language/po-language.service';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { PoTagBaseComponent } from './po-tag-base.component';
import { PoTagIcon } from './enums/po-tag-icon.enum';
import { PoTagItem } from './interfaces/po-tag-item.interface';
import { PoTagType } from './enums/po-tag-type.enum';
import { PoTagLiterals } from './po-tag.literals';

const poTagTypeDefault = 'po-tag-' + PoTagType.Info;

/**
 * @docsExtends PoTagBaseComponent
 *
 * @example
 *
 * <example name="po-tag-basic" title="PO Tag Basic">
 *  <file name="sample-po-tag-basic/sample-po-tag-basic.component.html"> </file>
 *  <file name="sample-po-tag-basic/sample-po-tag-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-tag-labs" title="PO Tag Labs">
 *  <file name="sample-po-tag-labs/sample-po-tag-labs.component.html"> </file>
 *  <file name="sample-po-tag-labs/sample-po-tag-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-tag-bank-account" title="PO Tag - Bank Account">
 *  <file name="sample-po-tag-bank-account/sample-po-tag-bank-account.component.html"> </file>
 *  <file name="sample-po-tag-bank-account/sample-po-tag-bank-account.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-tag',
  templateUrl: './po-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoTagComponent extends PoTagBaseComponent implements OnInit {
  @ViewChild('tagContainer', { static: true }) tagContainer: ElementRef;

  isClickable: boolean;
  literals: any;

  constructor(private el: ElementRef, private languageService: PoLanguageService) {
    super();
    const language = this.languageService.getShortLanguage();
    this.literals = {
      ...PoTagLiterals[language]
    };
  }

  ngOnInit() {
    this.isClickable = this.click.observers.length > 0;
  }

  get iconFromType() {
    switch (this.type) {
      case PoTagType.Danger:
        return PoTagIcon.Danger;

      case PoTagType.Info:
        return PoTagIcon.Info;

      case PoTagType.Success:
        return PoTagIcon.Success;

      case PoTagType.Warning:
        return PoTagIcon.Warning;
    }
  }

  get tagColor() {
    if (this.type && !this.removable) {
      return this.inverse ? `po-tag-${this.type}-inverse` : `po-tag-${this.type}`;
    }

    if (this.color && !this.removable) {
      return this.inverse ? `po-text-${this.color}` : `po-${this.color}`;
    }

    if (!this.customColor && !this.removable) {
      return this.inverse ? `${poTagTypeDefault}-inverse` : poTagTypeDefault;
    }
  }

  get tagOrientation() {
    return this.orientation === this.poTagOrientation.Horizontal;
  }

  onClick() {
    if (!this.removable && !this.disabled) {
      const submittedTagItem: PoTagItem = { value: this.value, type: this.type };
      this.click.emit(submittedTagItem);
    }
  }

  onClose() {
    if (!this.disabled) {
      this.click.emit(null);
      this.onRemove();
    }
  }

  onKeyPressed(event) {
    event.preventDefault();
    event.stopPropagation();
    this.onClick();
  }

  styleTag() {
    if (!this.tagColor && !this.inverse && !this.removable) {
      return { 'background-color': this.customColor, 'color': 'white' };
    } else if (!this.tagColor && this.inverse && !this.customTextColor) {
      return { 'border': '1px solid ' + this.customColor };
    } else if (!this.tagColor && this.inverse && this.customTextColor) {
      return { 'border': '1px solid ' + this.customTextColor, 'background-color': this.customColor };
    } else {
      return {};
    }
  }

  getWidthTag() {
    return this.tagContainer.nativeElement.offsetWidth > 155;
  }

  setAriaLabel() {
    return this.label ? this.label + ' ' + this.literals.remove : this.value + ' ' + this.literals.remove;
  }

  private onRemove() {
    if (!this.disabled) {
      this.el.nativeElement.remove();
    }
  }
}
