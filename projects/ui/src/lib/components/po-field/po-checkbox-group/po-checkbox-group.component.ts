import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoCheckboxGroupBaseComponent } from './po-checkbox-group-base.component';
import { PoCheckboxGroupOption } from './interfaces/po-checkbox-group-option.interface';

/**
 * @docsExtends PoCheckboxGroupBaseComponent
 *
 * @example
 *
 * <example name="po-checkbox-group-basic" title="PO Checkbox Group Basic">
 *  <file name="sample-po-checkbox-group-basic/sample-po-checkbox-group-basic.component.html"> </file>
 *  <file name="sample-po-checkbox-group-basic/sample-po-checkbox-group-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-checkbox-group-labs" title="PO Checkbox Group Labs">
 *  <file name="sample-po-checkbox-group-labs/sample-po-checkbox-group-labs.component.html"> </file>
 *  <file name="sample-po-checkbox-group-labs/sample-po-checkbox-group-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-checkbox-group-password-policy" title="PO Checkbox Group – Security policy">
 *  <file name="sample-po-checkbox-group-password-policy/sample-po-checkbox-group-password-policy.component.html"> </file>
 *  <file name="sample-po-checkbox-group-password-policy/sample-po-checkbox-group-password-policy.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-checkbox-group',
  templateUrl: './po-checkbox-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoCheckboxGroupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoCheckboxGroupComponent),
      multi: true
    }
  ]
})
export class PoCheckboxGroupComponent extends PoCheckboxGroupBaseComponent implements AfterViewChecked, AfterViewInit {
  @ViewChildren('checkboxLabel') checkboxLabels: QueryList<ElementRef>;

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
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
   * import { PoCheckboxGroupComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoCheckboxGroupComponent, { static: true }) checkbox: PoCheckboxGroupComponent;
   *
   * focusCheckbox() {
   *   this.checkbox.focus();
   * }
   * ```
   */
  focus(): void {
    if (this.checkboxLabels && !this.disabled) {
      const checkboxLabel = this.checkboxLabels.find((_, index) => !this.options[index].disabled);

      if (checkboxLabel) {
        checkboxLabel.nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, option: PoCheckboxGroupOption) {
    const spaceBar = 32;

    if (event.which === spaceBar || event.keyCode === spaceBar) {
      this.checkOption(option);

      event.preventDefault();
    }
  }

  trackByFn(index) {
    return index;
  }
}
