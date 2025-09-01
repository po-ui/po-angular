import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  ViewChild,
  inject,
  OnInit
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { uuid } from '../../../utils/util';

import { PoInputGeneric } from '../po-input-generic/po-input-generic';

/**
 * @docsExtends PoInputBaseComponent
 *
 * @example
 *
 * <example name="po-input-basic" title="PO Input Basic">
 *  <file name="sample-po-input-basic/sample-po-input-basic.component.html"> </file>
 *  <file name="sample-po-input-basic/sample-po-input-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-input-labs" title="PO Input Labs">
 *  <file name="sample-po-input-labs/sample-po-input-labs.component.html"> </file>
 *  <file name="sample-po-input-labs/sample-po-input-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-input-reactive-form" title="PO Input - Reactive Form">
 *  <file name="sample-po-input-reactive-form/sample-po-input-reactive-form.component.html"> </file>
 *  <file name="sample-po-input-reactive-form/sample-po-input-reactive-form.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-input',
  templateUrl: './po-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoInputComponent extends PoInputGeneric implements OnInit {
  @ViewChild('inp', { static: true }) inp: ElementRef;

  id = `po-input[${uuid()}]`;

  /** Propriedade para controlar a visibilidade do additionalHelp de acordo com a visibilidade do p-label do field.
   * > Caso o p-label esteja visível, o additionalHelp não será exibido.
   **/
  hideAdditionalHelp: boolean = false;

  /* istanbul ignore next */
  constructor() {
    const el = inject(ElementRef);
    const cd = inject(ChangeDetectorRef);

    super(el, cd);
  }

  ngOnInit() {
    this.helperHandler();
  }

  helperHandler() {
    if (this.label && this.additionalHelpTooltip && !this.poHelperComponent()) {
      this.hideAdditionalHelp = true;
      this.helperSettings = {
        content: this.additionalHelpTooltip,
        type: 'info'
      };
    } else if (this.label && this.poHelperComponent()) {
      this.hideAdditionalHelp = true;
      this.helperSettings = this.poHelperComponent();
    } else {
      this.hideAdditionalHelp = false;
    }
    return this.hideAdditionalHelp;
  }

  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }
}
