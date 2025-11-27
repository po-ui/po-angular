import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { PoLanguageService } from './../../services/po-language/po-language.service';

import { PoTagIcon } from './enums/po-tag-icon.enum';
import { PoTagType } from './enums/po-tag-type.enum';
import { PoTagBaseComponent } from './po-tag-base.component';
import { getTextColorFromBackgroundColor } from '../../utils/util';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoTagComponent extends PoTagBaseComponent implements OnInit {
  private el = inject(ElementRef);

  @ViewChild('tagContainer', { static: true }) tagContainer: ElementRef;
  @ViewChild('tagClose', { static: true }) tagClose: ElementRef;
  @ViewChild('poTag', { static: true }) poTag: ElementRef;

  isClickable: boolean;

  constructor() {
    const languageService = inject(PoLanguageService);

    super(languageService);
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
      return `po-tag-${this.type}`;
    }

    if (this.color && !this.removable) {
      return `po-${this.color}`;
    }

    if (!this.customColor && !this.removable) {
      return poTagTypeDefault;
    }
  }

  get tagOrientation() {
    return this.orientation === this.poTagOrientation.Horizontal;
  }

  onClick(event = 'click') {
    if (!this.removable && !this.disabled) {
      const submittedTagItem = { value: this.value, type: this.type, event: event };
      this.click.emit(submittedTagItem);
      if (this.poTag && this.poTag.nativeElement) {
        this.poTag.nativeElement.focus();
      }
    }
  }

  onClose(event = 'click') {
    if (!this.disabled) {
      this.onRemove();
      this.remove.emit(event);
    }
  }

  onKeyPressed(event) {
    event.preventDefault();
    event.stopPropagation();
    this.onClick('enter');
  }

  styleTag() {
    // Ajusta a cor do texto com base na cor de fundo computada do elemento
    requestAnimationFrame(() => {
      const computedStyle = getComputedStyle(this.poTag.nativeElement);

      if (
        (!this.tagColor || this.tagColor?.startsWith('po-color-')) &&
        !this.removable &&
        !this.textColor &&
        computedStyle?.backgroundColor
      ) {
        const textColor = getTextColorFromBackgroundColor(computedStyle.backgroundColor);
        this.poTag.nativeElement.style.color = textColor;
      } else {
        this.poTag.nativeElement.style.color = '';
      }
    });

    if (!this.tagColor && !this.removable) {
      return { 'background-color': this.customColor };
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
