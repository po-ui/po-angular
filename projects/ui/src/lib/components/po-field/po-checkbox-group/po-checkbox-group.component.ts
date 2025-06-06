import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoThemeService } from '../../../services';
import { PoCheckboxComponent } from '../po-checkbox/po-checkbox.component';
import { PoCheckboxGroupOption } from './interfaces/po-checkbox-group-option.interface';
import { PoCheckboxGroupBaseComponent } from './po-checkbox-group-base.component';

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
  ],
  standalone: false
})
export class PoCheckboxGroupComponent extends PoCheckboxGroupBaseComponent implements AfterViewChecked, AfterViewInit {
  @ViewChildren('checkboxLabel') checkboxLabels: QueryList<PoCheckboxComponent>;

  private el: ElementRef = inject(ElementRef);
  constructor(
    private changeDetector: ChangeDetectorRef,
    protected poThemeService: PoThemeService
  ) {
    super(poThemeService);
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  onBlur(checkbox: PoCheckboxComponent) {
    if (!this.isCheckboxOptionFocused(checkbox) && this.getAdditionalHelpTooltip() && this.displayAdditionalHelp) {
      this.showAdditionalHelp();
    }
  }

  emitAdditionalHelp() {
    if (this.isAdditionalHelpEventTriggered()) {
      this.additionalHelp.emit();
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
        checkboxLabel.checkboxLabel.nativeElement.focus();
      }
    }
  }

  getAdditionalHelpTooltip() {
    return this.isAdditionalHelpEventTriggered() ? null : this.additionalHelpTooltip;
  }

  getErrorPattern() {
    return this.fieldErrorMessage && this.hasInvalidClass() ? this.fieldErrorMessage : '';
  }

  hasInvalidClass() {
    return (
      this.el.nativeElement.classList.contains('ng-invalid') && this.el.nativeElement.classList.contains('ng-dirty')
    );
  }

  onKeyDown(event: KeyboardEvent, option: PoCheckboxGroupOption, checkbox?: PoCheckboxComponent) {
    const spaceBar = 32;

    if (event.which === spaceBar || event.keyCode === spaceBar) {
      this.checkOption(option);

      event.preventDefault();
    }

    if (this.isCheckboxOptionFocused(checkbox)) {
      this.keydown.emit(event);
    }
  }

  /**
   * Método que exibe `p-additionalHelpTooltip` ou executa a ação definida em `p-additionalHelp`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * ```
   * <po-checkbox-group
   *  #checkboxGroup
   *  ...
   *  p-additional-help-tooltip="Mensagem de ajuda complementar"
   *  (p-keydown)="onKeyDown($event, checkboxGroup)"
   * ></po-checkbox-group>
   * ```
   * ```
   * ...
   * onKeyDown(event: KeyboardEvent, inp: PoCheckboxGroupComponent): void {
   *  if (event.code === 'F9') {
   *    inp.showAdditionalHelp();
   *  }
   * }
   * ```
   */
  showAdditionalHelp(): boolean {
    this.displayAdditionalHelp = !this.displayAdditionalHelp;
    return this.displayAdditionalHelp;
  }

  showAdditionalHelpIcon() {
    return !!this.additionalHelpTooltip || this.isAdditionalHelpEventTriggered();
  }

  trackByFn(index) {
    return index;
  }

  private isAdditionalHelpEventTriggered(): boolean {
    return (
      this.additionalHelpEventTrigger === 'event' ||
      (this.additionalHelpEventTrigger === undefined && this.additionalHelp.observed)
    );
  }

  private isCheckboxOptionFocused(checkbox: PoCheckboxComponent): boolean {
    return document.activeElement === checkbox.checkboxLabel.nativeElement;
  }
}
