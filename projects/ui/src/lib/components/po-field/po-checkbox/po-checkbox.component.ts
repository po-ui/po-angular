import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  forwardRef,
  inject
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { AnimaliaIconDictionary, ICONS_DICTIONARY } from '../../po-icon';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';

import { PoCheckboxBaseComponent } from './po-checkbox-base.component';
import { setHelperSettings, updateTooltip } from '../../../utils/util';
import { PoHelperComponent, PoHelperOptions } from '../../po-helper';

/**
 * @docsExtends PoCheckboxBaseComponent
 *
 * @example
 *
 * <example name="po-checkbox-basic" title="PO Checkbox Basic">
 *   <file name="sample-po-checkbox-basic/sample-po-checkbox-basic.component.html"> </file>
 *   <file name="sample-po-checkbox-basic/sample-po-checkbox-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-checkbox-labs" title="PO Checkbox Labs">
 *   <file name="sample-po-checkbox-labs/sample-po-checkbox-labs.component.html"> </file>
 *   <file name="sample-po-checkbox-labs/sample-po-checkbox-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-checkbox-acceptance-term" title="PO Checkbox - Acceptance Term">
 *   <file name="sample-po-checkbox-acceptance-term/sample-po-checkbox-acceptance-term.component.html"> </file>
 *   <file name="sample-po-checkbox-acceptance-term/sample-po-checkbox-acceptance-term.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-checkbox',
  templateUrl: './po-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoCheckboxComponent),
      multi: true
    }
  ],
  standalone: false
})
export class PoCheckboxComponent extends PoCheckboxBaseComponent implements AfterViewInit, OnChanges, OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);

  private _iconToken: { [key: string]: string };

  helperSettings: PoHelperOptions;
  showTip = false;

  @ViewChild('checkboxLabel', { static: false }) checkboxLabel: ElementRef;
  @ViewChild('labelEl', { read: ElementRef }) labelEl!: ElementRef<HTMLElement>;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;
  constructor() {
    const value = inject<{
      [key: string]: string;
    }>(ICONS_DICTIONARY, { optional: true });

    const changeDetector = inject(ChangeDetectorRef);
    super(changeDetector);
    this.changeDetector = changeDetector;

    this._iconToken = value ?? AnimaliaIconDictionary;
  }

  /**
   * Função que atribui foco ao *checkbox*.
   *
   * Para utilizá-la é necessário capturar a referência do componente no DOM através do `ViewChild`, como por exemplo:
   *
   * ```
   * ...
   * import { ViewChild } from '@angular/core';
   * import { PoCheckboxComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoCheckboxComponent, { static: true }) checkbox: PoCheckboxComponent;
   *
   * focusCheckbox() {
   *   this.checkbox.focus();
   * }
   * ```
   */
  focus(): void {
    if (this.checkboxLabel && !this.disabled) {
      this.checkboxLabel.nativeElement.focus();
    }
  }

  onBlur() {
    this.onTouched?.();
    if (this.getAdditionalHelpTooltip() && this.displayAdditionalHelp) {
      this.showAdditionalHelp();
    }
    this.blur.emit();
  }

  ngAfterViewInit() {
    this.helperSettings = this.setHelper(this.label, this.additionalHelpTooltip).helperSettings;
    this.handleLabelTooltip();
    if (this.autoFocus) {
      this.focus();
    }

    setTimeout(() => {
      if (this.checkboxLabel?.nativeElement?.classList?.contains('enable-append-box')) {
        this.appendBox = true;
      }
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.label || changes.additionalHelpTooltip || changes.helper || changes.size) {
      queueMicrotask(() => this.handleLabelTooltip());
      this.helperSettings = this.setHelper(this.label, this.additionalHelpTooltip).helperSettings;
      this.changeDetector.detectChanges();
    }
  }

  ngOnInit(): void {
    this.handleLabelTooltip();
  }

  emitAdditionalHelp() {
    if (this.isAdditionalHelpEventTriggered()) {
      this.additionalHelp.emit();
    }
  }

  getAdditionalHelpTooltip() {
    return this.isAdditionalHelpEventTriggered() ? null : this.additionalHelpTooltip;
  }

  onKeyDown(event: KeyboardEvent, value: boolean | string) {
    const isFieldFocused = document.activeElement === this.checkboxLabel.nativeElement;

    if (event.which === PoKeyCodeEnum.space || event.keyCode === PoKeyCodeEnum.space) {
      this.checkOption(event, value);

      event.preventDefault();
    }

    if (isFieldFocused) {
      this.keydown.emit(event);
    }
  }

  /**
   * Método que exibe `p-additionalHelpTooltip` ou executa a ação definida em `p-additionalHelp`.
   * Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.
   *
   * > Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco e com label visível.
   *
   * ```
   * <po-checkbox
   *  #checkbox
   *  ...
   *  p-additional-help-tooltip="Mensagem de ajuda complementar"
   *  (p-keydown)="onKeyDown($event, checkbox)"
   * ></po-checkbox>
   * ```
   * ```
   * //Exemplo com label e p-helper
   * <po-checkbox
   *  #checkbox
   *  ...
   *  p-label="Label do checkbox"
   *  [p-helper]="helperOptions"
   *  (p-keydown)="onKeyDown($event, checkbox)"
   * ></po-checkbox>
   * ```
   * ```
   * ...
   * onKeyDown(event: KeyboardEvent, inp: PoCheckboxComponent): void {
   *  if (event.code === 'F9') {
   *    inp.showAdditionalHelp();
   *  }
   * }
   * ```
   */
  showAdditionalHelp(): boolean {
    this.displayAdditionalHelp = !this.displayAdditionalHelp;

    if (this.displayAdditionalHelp && this.helperEl) {
      const helper = this.poHelperComponent();
      if (helper && typeof helper !== 'string' && helper.eventOnClick) {
        helper.eventOnClick();
        return;
      }
      this.helperEl?.openHelperPopover();
    } else if (!this.displayAdditionalHelp && this.helperEl) {
      this.helperEl?.closeHelperPopover();
    }
    return this.displayAdditionalHelp;
  }

  showAdditionalHelpIcon() {
    return !!this.additionalHelpTooltip || this.isAdditionalHelpEventTriggered();
  }

  setHelper(label?: string, additionalHelpTooltip?: string) {
    return setHelperSettings(
      label,
      additionalHelpTooltip,
      this.poHelperComponent(),
      this.size,
      this.isAdditionalHelpEventTriggered() ? this.additionalHelp : undefined
    );
  }

  protected changeModelValue(value: boolean | null | string) {
    if (value === null) {
      this.checkboxValue = 'mixed';
    } else {
      this.checkboxValue = typeof value === 'boolean' || value === null ? value : false;
    }
    this.changeDetector.detectChanges();
  }

  private isAdditionalHelpEventTriggered(): boolean {
    return (
      this.additionalHelpEventTrigger === 'event' ||
      (this.additionalHelpEventTrigger === undefined && this.additionalHelp.observed)
    );
  }

  public handleLabelTooltip(): void {
    this.showTip = updateTooltip(this.showTip, this.labelEl);
    this.changeDetector.markForCheck();
  }

  get iconNameLib() {
    return this._iconToken.NAME_LIB;
  }
}
