import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoSwitchBaseComponent } from './po-switch-base.component';
import { PoSwitchLabelPosition } from './po-switch-label-position.enum';

/**
 * @docsExtends PoSwitchBaseComponent
 *
 * @example
 *
 * <example name="po-switch-basic" title="PO Switch Basic">
 *   <file name="sample-po-switch-basic/sample-po-switch-basic.component.html"> </file>
 *   <file name="sample-po-switch-basic/sample-po-switch-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-switch-labs" title="PO Switch Labs">
 *   <file name="sample-po-switch-labs/sample-po-switch-labs.component.html"> </file>
 *   <file name="sample-po-switch-labs/sample-po-switch-labs.component.ts"> </file>
 *   <file name="sample-po-switch-labs/sample-po-switch-labs.component.e2e-spec.ts"> </file>
 *   <file name="sample-po-switch-labs/sample-po-switch-labs.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-switch-order" title="PO Switch - Order Summary">
 *   <file name="sample-po-switch-order/sample-po-switch-order.component.html"> </file>
 *   <file name="sample-po-switch-order/sample-po-switch-order.component.ts"> </file>
 * </example>
 *
 * <example name="po-switch-order-reactive-form" title="PO Switch - Order Summary Reactive Form">
 *   <file name="sample-po-switch-order-reactive-form/sample-po-switch-order-reactive-form.component.html"> </file>
 *   <file name="sample-po-switch-order-reactive-form/sample-po-switch-order-reactive-form.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-switch',
  templateUrl: './po-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoSwitchComponent),
      multi: true
    }
  ]
})
export class PoSwitchComponent extends PoSwitchBaseComponent implements AfterViewInit {
  @ViewChild('switchContainer', { static: true }) switchContainer: ElementRef;

  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoSwitchComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoSwitchComponent, { static: true }) switch: PoSwitchComponent;
   *
   * focusSwitch() {
   *   this.switch.focus();
   * }
   * ```
   */
  focus() {
    if (!this.disabled) {
      this.switchContainer.nativeElement.focus();
    }
  }

  onBlur() {
    this.onTouched?.();
  }

  getLabelPosition() {
    switch (this.labelPosition) {
      case PoSwitchLabelPosition.Left:
        return 'left';
      case PoSwitchLabelPosition.Right:
        return 'right';
      default:
        return 'right';
    }
  }

  getSwitchPosition() {
    switch (this.labelPosition) {
      case PoSwitchLabelPosition.Left:
        return 'right';
      case PoSwitchLabelPosition.Right:
        return 'left';
      default:
        return 'left';
    }
  }

  onKeyDown(event) {
    if (event.which === 32 || event.keyCode === 32) {
      event.preventDefault();
      this.eventClick();
    }
  }
}
