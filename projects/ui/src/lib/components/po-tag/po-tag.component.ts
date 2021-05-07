import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { PoTagBaseComponent } from './po-tag-base.component';
import { PoTagIcon } from './enums/po-tag-icon.enum';
import { PoTagItem } from './interfaces/po-tag-item.interface';
import { PoTagType } from './enums/po-tag-type.enum';

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
  isClickable: boolean;

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
    if (this.type) {
      return this.inverse ? `po-tag-${this.type}-inverse` : `po-tag-${this.type}`;
    }

    if (this.color) {
      return this.inverse ? `po-text-${this.color}` : `po-${this.color}`;
    }

    return this.inverse ? `${poTagTypeDefault}-inverse` : poTagTypeDefault;
  }

  get tagOrientation() {
    return this.orientation === this.poTagOrientation.Horizontal;
  }

  onClick() {
    const submittedTagItem: PoTagItem = { value: this.value, type: this.type };
    this.click.emit(submittedTagItem);
  }

  onKeyPressed(event) {
    event.preventDefault();
    event.stopPropagation();
    this.onClick();
  }
}
