import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewRef,
  ViewChild
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isMobile, setHelperSettings, uuid } from '../../../utils/util';
import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';

import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoButtonComponent } from '../../po-button/po-button.component';
import { PoTimerComponent } from '../../po-timer/po-timer.component';
import { PoTimepickerBaseComponent } from './po-timepicker-base.component';
import { poTimepickerLiterals } from './po-timepicker.literals';
import { PoHelperComponent } from '../../po-helper';

const poTimerContentOffset = 8;
const poTimerPositionDefault = 'bottom-left';

type PoTimepickerSegment = 'hour' | 'minute' | 'second';

/**
 * @docsExtends PoTimepickerBaseComponent
 *
 * @example
 *
 * <example name="po-timepicker-basic" title="PO Timepicker Basic">
 *  <file name="sample-po-timepicker-basic/sample-po-timepicker-basic.component.html"> </file>
 *  <file name="sample-po-timepicker-basic/sample-po-timepicker-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-timepicker-labs" title="PO Timepicker Labs">
 *  <file name="sample-po-timepicker-labs/sample-po-timepicker-labs.component.html"> </file>
 *  <file name="sample-po-timepicker-labs/sample-po-timepicker-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-timepicker-scheduling" title="PO Timepicker - Scheduling">
 *  <file name="sample-po-timepicker-scheduling/sample-po-timepicker-scheduling.component.html"> </file>
 *  <file name="sample-po-timepicker-scheduling/sample-po-timepicker-scheduling.component.ts"> </file>
 * </example>
 *
 * <example name="po-timepicker-business-hours" title="PO Timepicker - Business Hours">
 *  <file name="sample-po-timepicker-business-hours/sample-po-timepicker-business-hours.component.html"> </file>
 *  <file name="sample-po-timepicker-business-hours/sample-po-timepicker-business-hours.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-timepicker',
  templateUrl: './po-timepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoTimepickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoTimepickerComponent),
      multi: true
    },
    PoControlPositionService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoTimepickerComponent extends PoTimepickerBaseComponent implements AfterViewInit, OnDestroy, OnChanges {
  private readonly controlPosition = inject(PoControlPositionService);
  private readonly renderer = inject(Renderer2);

  @ViewChild('dialogPicker', { read: ElementRef, static: false }) dialogPicker: ElementRef;
  @ViewChild('iconTimepicker') iconTimepicker: PoButtonComponent;
  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;
  @ViewChild('minuteInput', { read: ElementRef }) minuteInputEl: ElementRef;
  @ViewChild('secondInput', { read: ElementRef }) secondInputEl: ElementRef;
  @ViewChild('timepickerField', { read: ElementRef }) timepickerFieldEl: ElementRef;
  @ViewChild('iconClean', { read: ElementRef }) iconClean!: ElementRef<HTMLElement>;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;
  @ViewChild('timer', { static: false }) timerComponent?: PoTimerComponent;
  @ViewChild('periodInput', { read: ElementRef }) periodInputEl: ElementRef;

  /** Rótulo do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  displayAdditionalHelp: boolean = false;
  el: ElementRef;
  id = `po-timepicker[${uuid()}]`;
  visible: boolean = false;
  literals: any;

  // Valores de exibicao para os inputs de segmento individuais.
  hourDisplay: string = '';
  minuteDisplay: string = '';
  secondDisplay: string = '';
  periodDisplay: string = '';
  isSegmentFocused: boolean = false;

  eventListenerFunction: () => void;
  eventResizeListener: () => void;

  private clickListener: () => void;
  private timeoutChange: any;
  private valueBeforeChange: string;

  constructor() {
    const languageService = inject(PoLanguageService);
    const cd = inject(ChangeDetectorRef);
    const el = inject(ElementRef);

    super(languageService, cd);
    this.languageService = languageService;
    this.cd = cd;

    this.shortLanguage = this.languageService.getShortLanguage();
    this.el = el;
    const language = languageService.getShortLanguage();
    this.literals = {
      ...poTimepickerLiterals[language]
    };
  }

  get hourPlaceholder(): string {
    return this.getCustomPlaceholderSegment(0) ?? '';
  }

  get minutePlaceholder(): string {
    return this.getCustomPlaceholderSegment(1) ?? '';
  }

  get secondPlaceholder(): string {
    return this.getCustomPlaceholderSegment(2) ?? '';
  }

  private get customPlaceholderSegments(): Array<string> {
    if (!this.placeholder?.trim()) {
      return [];
    }

    return this.placeholder.split(':').map(segment => segment.trim());
  }

  private getCustomPlaceholderSegment(index: number): string | undefined {
    return this.customPlaceholderSegments[index];
  }

  @HostListener('keydown', ['$event'])
  onKeydown($event?: any) {
    if (this.readonly) {
      return;
    }

    if ($event.key === 'Escape' && this.visible) {
      this.togglePicker(false);
      $event.preventDefault();
      $event.stopPropagation();
    }

    if (
      $event.key === 'Tab' &&
      $event.shiftKey &&
      $event.target instanceof HTMLInputElement &&
      this.visible &&
      !$event.target.classList?.contains('po-timepicker-segment-input')
    ) {
      this.togglePicker();
    }
  }

  ngAfterViewInit() {
    this.setDialogPickerStyleDisplay('none');
    if (this.autoFocus) {
      this.focus();
    }
    if (this.iconTimepicker?.buttonElement?.nativeElement) {
      this.renderer.setAttribute(this.iconTimepicker.buttonElement.nativeElement, 'aria-label', this.literals.open);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.label) {
      this.displayAdditionalHelp = false;
    }
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  emitAdditionalHelp() {
    // deprecated - kept for backward compatibility
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoTimepickerComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoTimepickerComponent, { static: true }) timepicker: PoTimepickerComponent;
   *
   * focusTimepicker() {
   *   this.timepicker.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.isDisabled && this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.focus();
    }
  }

  getAdditionalHelpTooltip() {
    return null;
  }

  togglePicker(focusInput = true) {
    if (this.isDisabled || this.readonly || !this.iconTimepicker?.buttonElement?.nativeElement) {
      return;
    }

    if (!this.visible) {
      this.visible = true;
      this.setTimerPosition();
      this.initializeListeners();

      this.renderer.setAttribute(this.inputEl.nativeElement, 'aria-expanded', 'true');
      this.renderer.setAttribute(this.iconTimepicker.buttonElement.nativeElement, 'aria-expanded', 'true');

      requestAnimationFrame(() => {
        this.timerComponent.initAllColumnOffsets();
      });
    } else {
      this.inputEl.nativeElement.disabled = false;
      this.closeTimer(focusInput);

      this.renderer.removeAttribute(this.inputEl.nativeElement, 'aria-expanded');
      this.renderer.removeAttribute(this.iconTimepicker.buttonElement.nativeElement, 'aria-expanded');
    }
  }

  closeTimer(focusInput = true, skipRefocus = false) {
    this.completeSecondsOnClose();

    this.visible = false;
    this.removeListeners();
    this.setDialogPickerStyleDisplay('none');

    if (!this.verifyMobile() && focusInput) {
      this.focus();
    }

    if (!focusInput && !skipRefocus && this.clean && this.hasValue()) {
      setTimeout(() => {
        this.iconTimepicker.focus();
      });
    }
  }

  // Chamado quando o po-timer emite p-change com o horario selecionado.
  timerSelected(time: string) {
    if (!time) {
      this.clear();
      setTimeout(() => this.closeTimer(), 200);
      this.onchange.emit();
      return;
    }

    this.onTouchedModel?.();

    this.timeValue = time;
    this.updateInputDisplay(time);

    const output = this.formatOutput(time);
    this.callOnChange(output);
    this.controlChangeEmitter();
  }

  wasClickedOnPicker(event: any): void {
    if (!this.dialogPicker || !this.iconTimepicker) {
      return;
    }
    if (
      !this.dialogPicker.nativeElement.contains(event.target) &&
      !this.iconTimepicker.buttonElement.nativeElement.contains(event.target)
    ) {
      this.closeTimer();
    }
  }

  hasInvalidClass() {
    return (
      (this.el.nativeElement.classList.contains('ng-invalid') &&
        this.el.nativeElement.classList.contains('ng-dirty') &&
        (this.hasValue() || (this.showErrorMessageRequired && (this.required || this.hasValidatorRequired)))) ||
      this.hasValidationValue()
    );
  }

  // Retorna true se algum segmento possui valor.
  hasValue(): boolean {
    return this.hourDisplay !== '' || this.minuteDisplay !== '' || this.secondDisplay !== '';
  }

  getErrorPattern() {
    return this.errorPattern !== '' && this.hasInvalidClass() ? this.errorPattern : '';
  }

  clear() {
    this.valueBeforeChange = this.timeValue;
    this.timeValue = '';
    this.clearValidationValue();
    this.hourDisplay = '';
    this.minuteDisplay = '';
    this.secondDisplay = '';
    this.periodDisplay = this.getDefaultPeriodDisplay();
    if (this.isGeneratedErrorPattern(this.errorPattern)) {
      this.errorPattern = '';
    }
    if (this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.value = '';
    }
    if (this.minuteInputEl?.nativeElement) {
      this.minuteInputEl.nativeElement.value = '';
    }
    if (this.secondInputEl?.nativeElement) {
      this.secondInputEl.nativeElement.value = '';
    }
    this.callOnChange('');
    this.validateModel('');
    this.controlChangeEmitter();
  }

  clearAndFocus() {
    this.clear();
    setTimeout(() => {
      this.focus();
    }, 200);
  }

  eventOnBlur($event: any) {
    // Mantido para compatibilidade. O blur de segmento e tratado por onSegmentBlur.
    this.onTouchedModel?.();
    this.onblur.emit();
    this.validateAndUpdateModel();
    this.controlChangeEmitter();
  }

  eventOnClick($event: any) {
    if (this.verifyMobile()) {
      $event.target.blur();
      setTimeout(() => this.togglePicker(), 0);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const isFieldFocused = this.el.nativeElement.contains(document.activeElement);
    if (isFieldFocused) {
      this.keydown.emit(event);
    }
  }

  onKeyPress(event: any) {
    if (event.key === 'Tab' && event.shiftKey && !this.visible && this.clean && this.hasValue()) {
      this.iconClean.nativeElement?.focus();
      event.preventDefault();
      return;
    }

    if (event.key === 'Tab' && event.shiftKey && !this.visible) {
      this.focusLastSegment();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // Trata o input em um campo de segmento (hora, minuto, segundo).
  onSegmentInput(event: Event, segment: PoTimepickerSegment): void {
    const input = event.target as HTMLInputElement;
    // Permitir apenas digitos
    input.value = input.value.replace(/\D/g, '');

    switch (segment) {
      case 'hour':
        this.hourDisplay = input.value;
        break;
      case 'minute':
        this.minuteDisplay = input.value;
        break;
      case 'second':
        this.secondDisplay = input.value;
        break;
    }

    // Avancar automaticamente ao digitar 2 digitos
    if (input.value.length >= 2) {
      this.advanceToNextSegment(segment);
    }

    this.updateCombinedValue();
  }

  // Trata keydown em um campo de segmento para navegacao.
  onSegmentKeydown(event: KeyboardEvent, segment: PoTimepickerSegment): void {
    if (this.handleSegmentNavigation(event, segment)) {
      return;
    }

    if (this.handleSegmentArrowKeys(event, segment)) {
      return;
    }

    if (this.handleSegmentNonNumericBlock(event)) {
      return;
    }

    // Se Tab no ultimo segmento com picker aberto, focar o timer popup.
    if (event.key === 'Tab' && !event.shiftKey && this.visible && this.isLastSegment(segment)) {
      this.focusTimer(event);
    }

    this.keydown.emit(event);
  }

  private handleSegmentNavigation(event: KeyboardEvent, segment: PoTimepickerSegment): boolean {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Tab' && event.shiftKey && this.visible && segment !== 'hour') {
      this.advanceToPreviousSegment(segment);
      event.preventDefault();
      return true;
    }

    if (event.key === 'Backspace' && input.value === '' && input.selectionStart === 0) {
      this.advanceToPreviousSegment(segment);
      event.preventDefault();
      return true;
    }

    if (event.key === 'ArrowLeft' && input.selectionStart === 0) {
      this.advanceToPreviousSegment(segment);
      event.preventDefault();
      return true;
    }

    if (event.key === 'ArrowRight' && input.selectionStart === input.value.length) {
      this.advanceToNextSegment(segment);
      event.preventDefault();
      return true;
    }

    return false;
  }

  private handleSegmentArrowKeys(event: KeyboardEvent, segment: PoTimepickerSegment): boolean {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      return false;
    }

    event.preventDefault();
    if (!this.readonly) {
      this.incrementSegment(segment, event.key === 'ArrowUp' ? 1 : -1);
    }
    return true;
  }

  private handleSegmentNonNumericBlock(event: KeyboardEvent): boolean {
    if (event.key.length === 1 && !/\d/.test(event.key) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      return true;
    }
    return false;
  }

  // Trata blur em um campo de segmento.
  onSegmentBlur(event: FocusEvent): void {
    this.isSegmentFocused = false;

    const sourceInput = event.target as HTMLInputElement;
    const normalizedSegmentOnBlur = this.normalizeSingleDigitSegment(sourceInput);

    // Verificar se o foco moveu para outro elemento dentro do timepicker
    const relatedTarget = event.relatedTarget as HTMLElement;
    const isInternalFocus = relatedTarget && this.el.nativeElement.contains(relatedTarget);

    if (normalizedSegmentOnBlur) {
      this.updateCombinedValue();
    }

    if (isInternalFocus && this.shouldCommitForInternalFocusTarget(relatedTarget)) {
      this.onTouchedModel?.();
      this.validateAndUpdateModel();
      this.controlChangeEmitter();
      return;
    }

    if (!isInternalFocus) {
      this.onTouchedModel?.();
      this.onblur.emit();
      this.validateAndUpdateModel();
      this.controlChangeEmitter();

      if (this.visible) {
        this.closeTimer(false, true);
      }
    }
  }

  // Trata clique no wrapper do campo para focar o primeiro input de segmento.
  onFieldClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Focar apenas se clicou no wrapper do campo, nao em um input de segmento ou icone do botao do timer, e se nao estiver desabilitado ou readonly
    if (
      !target.classList.contains('po-timepicker-segment-input') &&
      target !== this.iconTimepicker.buttonElement?.nativeElement &&
      target !== this.iconTimepicker.buttonElement?.nativeElement.querySelector('i') &&
      !this.isDisabled &&
      !this.readonly
    ) {
      this.focus();
    }
  }

  // Trata foco em um campo de segmento.
  onSegmentFocus(): void {
    this.isSegmentFocused = true;
  }

  // Trata keydown no toggle de periodo AM/PM.
  onPeriodSegmentKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.readonly && !this.isDisabled) {
        this.togglePeriod();
      }
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      return;
    }

    if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault();
      if (this.showSeconds && this.secondInputEl?.nativeElement) {
        this.secondInputEl.nativeElement.focus();
      } else if (this.minuteInputEl?.nativeElement) {
        this.minuteInputEl.nativeElement.focus();
      }
      return;
    }

    if (event.key === 'Tab' && !event.shiftKey && this.visible) {
      this.focusTimer(event);
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
    }
  }

  // Trata clique no toggle de periodo AM/PM.
  onPeriodSegmentClick(event: MouseEvent): void {
    if (!this.readonly && !this.isDisabled) {
      this.togglePeriod();
    }
  }

  refreshValue(value: string) {
    if (value && this.inputEl) {
      this.updateInputDisplay(value);
    }
  }

  /**
   * Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
   */
  showAdditionalHelp(): boolean {
    this.displayAdditionalHelp = !this.displayAdditionalHelp;
    const helper = this.poHelperComponent();
    const isHelpEvt = this.isAdditionalHelpEventTriggered();
    if (!this.label && (helper || isHelpEvt)) {
      if (typeof helper !== 'string' && typeof helper?.eventOnClick === 'function') {
        helper.eventOnClick();
        return;
      }
      if (this.helperEl?.helperIsVisible()) {
        this.helperEl?.closeHelperPopover();
        return;
      }
      this.helperEl?.openHelperPopover();
      return;
    }
    return this.displayAdditionalHelp;
  }

  writeValue(value: any) {
    if (this.inputEl && value) {
      if (typeof value === 'string' && this.isValidTimeString(value)) {
        this.timeValue = value;
        this.clearValidationValue();
        this.updateInputDisplay(value);
      } else {
        this.clearSegmentDisplays();
        this.clearValidationValue();
        this.timeValue = '';
      }
    } else if (this.inputEl) {
      if (this.hasValidationValue() && this.hasValue()) {
        this.timeValue = '';
        this.valueBeforeChange = this.timeValue;
        return;
      }

      this.clearSegmentDisplays();
      this.clearValidationValue();
      this.timeValue = '';
    }

    this.valueBeforeChange = this.timeValue;
  }

  verifyMobile() {
    return isMobile();
  }

  handleCleanKeyboardTab(event: KeyboardEvent) {
    if (this.shouldHandleTab(event)) {
      this.focusTimer(event);
    }
  }

  onTimerKeyDown(event: KeyboardEvent): void {
    if (!this.visible) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.iconTimepicker.buttonElement?.nativeElement.focus();
      this.closeTimer(false);
    }
  }

  onTimerBoundaryTab(payload: { direction: 'forward' | 'backward'; event: KeyboardEvent }): void {
    if (!this.visible) {
      return;
    }

    payload.event.preventDefault();
    payload.event.stopPropagation();
    this.iconTimepicker.buttonElement?.nativeElement.focus();
    this.closeTimer(false);
  }

  // Trata focusout no popup do timer para fechar quando o foco sai completamente.
  onTimerFocusOut(event: FocusEvent): void {
    if (!this.visible) {
      return;
    }

    const relatedTarget = event.relatedTarget as HTMLElement;
    const dialogEl = this.dialogPicker?.nativeElement;

    // Se o novo alvo de foco esta fora do popup do timer E fora do campo do timepicker, fechar o timer.
    if (relatedTarget && dialogEl && !dialogEl.contains(relatedTarget)) {
      // Permitir que o foco mova para elementos dentro do componente timepicker (botao, clean, segmentos)
      if (!this.el.nativeElement.contains(relatedTarget)) {
        this.closeTimer(false);
      }
    } else if (!relatedTarget && dialogEl) {
      // relatedTarget is null when focus goes outside the document
      setTimeout(() => {
        if (
          this.visible &&
          !this.el.nativeElement.contains(document.activeElement) &&
          !dialogEl.contains(document.activeElement)
        ) {
          this.closeTimer(false);
        }
      });
    }
  }

  setHelper(label?: string) {
    return setHelperSettings(label, null, this.poHelperComponent(), this.size);
  }

  /**
   * Atualiza os valores exibidos nos inputs de segmento, convertendo para formato 12h com AM/PM quando necessário.
   * O timeValue interno sempre armazena em formato 24h (ISO), mas a exibição pode ser 12h.
   */
  private updateInputDisplay(time: string): void {
    if (!time) {
      this.clearSegmentDisplays();
      return;
    }

    const parts = time.split(':');

    if (this.is12HourFormat && this.isValidTimeString(time)) {
      let hours = parseInt(parts[0], 10);
      const period = hours >= 12 ? 'PM' : 'AM';

      if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours = hours - 12;
      }

      this.hourDisplay = hours.toString().padStart(2, '0');
      this.minuteDisplay = parts[1] || '';
      this.secondDisplay = parts[2] || '';
      this.periodDisplay = period;
    } else {
      this.hourDisplay = parts[0] || '';
      this.minuteDisplay = parts[1] || '';
      this.secondDisplay = parts[2] || '';
      this.periodDisplay = '';
    }

    this.syncSegmentInputElements();
  }

  /** Limpa todos os valores de exibicao dos segmentos e seus respectivos elementos input. */
  private clearSegmentDisplays(): void {
    this.hourDisplay = '';
    this.minuteDisplay = '';
    this.secondDisplay = '';
    this.periodDisplay = this.getDefaultPeriodDisplay();
    this.syncSegmentInputElements();
  }

  private getDefaultPeriodDisplay(): string {
    return this.is12HourFormat ? 'AM' : '';
  }

  /** Sincroniza os valores dos elementos input nativos com as propriedades de exibicao. */
  private syncSegmentInputElements(): void {
    requestAnimationFrame(() => {
      if (this.inputEl?.nativeElement) {
        this.inputEl.nativeElement.value = this.hourDisplay;
      }
      if (this.minuteInputEl?.nativeElement) {
        this.minuteInputEl.nativeElement.value = this.minuteDisplay;
      }
      if (this.secondInputEl?.nativeElement) {
        this.secondInputEl.nativeElement.value = this.secondDisplay;
      }

      const viewRef = this.cd as ViewRef;
      if (!viewRef.destroyed) {
        this.cd.markForCheck();
      }
    });
  }

  /** Avanca o foco para o proximo input de segmento. */
  private advanceToNextSegment(current: PoTimepickerSegment): void {
    if (current === 'hour' && this.minuteInputEl?.nativeElement) {
      this.minuteInputEl.nativeElement.focus();
      this.minuteInputEl.nativeElement.select();
    } else if (current === 'minute' && this.showSeconds && this.secondInputEl?.nativeElement) {
      this.secondInputEl.nativeElement.focus();
      this.secondInputEl.nativeElement.select();
    } else if (
      this.is12HourFormat &&
      this.periodInputEl?.nativeElement &&
      ((current === 'minute' && !this.showSeconds) || current === 'second')
    ) {
      this.periodInputEl.nativeElement.focus();
    }
  }

  /** Avanca o foco para o input de segmento anterior. */
  private advanceToPreviousSegment(current: PoTimepickerSegment): void {
    if (current === 'minute' && this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.focus();
    } else if (current === 'second' && this.minuteInputEl?.nativeElement) {
      this.minuteInputEl.nativeElement.focus();
    }
  }

  /** Foca o ultimo input de segmento visivel. */
  private focusLastSegment(): void {
    if (this.is12HourFormat && this.periodInputEl?.nativeElement) {
      this.periodInputEl.nativeElement.focus();
    } else if (this.showSeconds && this.secondInputEl?.nativeElement) {
      this.secondInputEl.nativeElement.focus();
    } else if (this.minuteInputEl?.nativeElement) {
      this.minuteInputEl.nativeElement.focus();
    } else {
      this.focus();
    }
  }

  /** Verifica se o segmento informado e o ultimo visivel. */
  private isLastSegment(segment: PoTimepickerSegment): boolean {
    if (this.is12HourFormat) {
      return false;
    }
    if (this.showSeconds) {
      return segment === 'second';
    }
    return segment === 'minute';
  }

  /** Alterna entre AM e PM no display de periodo e atualiza o modelo. */
  private togglePeriod(): void {
    const currentPeriod = this.periodDisplay || this.getDefaultPeriodDisplay();
    this.periodDisplay = currentPeriod === 'AM' ? 'PM' : 'AM';
    this.updateCombinedValue();
  }

  /** Incrementa ou decrementa o valor de um segmento na direcao indicada (+1 ou -1), respeitando limites e intervalos. */
  private incrementSegment(segment: PoTimepickerSegment, direction: number): void {
    switch (segment) {
      case 'hour':
        this.incrementHourSegment(direction);
        break;
      case 'minute':
        this.incrementIntervalSegment(direction, this.minuteInterval || 1, 'minuteDisplay', this.minuteInputEl);
        break;
      case 'second':
        this.incrementIntervalSegment(direction, this.secondInterval || 1, 'secondDisplay', this.secondInputEl);
        break;
    }

    this.updateCombinedValue();
  }

  private incrementHourSegment(direction: number): void {
    const max = this.is12HourFormat ? 12 : 23;
    const min = this.is12HourFormat ? 1 : 0;
    let current = this.hourDisplay ? parseInt(this.hourDisplay, 10) : min - direction;

    current += direction;

    if (current > max || current < min) {
      current = current > max ? min : max;
      if (this.is12HourFormat) {
        this.periodDisplay = (this.periodDisplay || this.getDefaultPeriodDisplay()) === 'AM' ? 'PM' : 'AM';
      }
    }

    this.hourDisplay = current.toString().padStart(2, '0');
    if (this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.value = this.hourDisplay;
    }
  }

  private incrementIntervalSegment(
    direction: number,
    interval: number,
    displayProp: 'minuteDisplay' | 'secondDisplay',
    inputRef: ElementRef
  ): void {
    let current = this[displayProp] ? parseInt(this[displayProp], 10) : -interval * direction;

    current += interval * direction;
    if (current >= 60) {
      current = 0;
    } else if (current < 0) {
      current = 60 - interval;
    }

    this[displayProp] = current.toString().padStart(2, '0');
    if (inputRef?.nativeElement) {
      inputRef.nativeElement.value = this[displayProp];
    }
  }

  private normalizeSingleDigitSegment(input: HTMLInputElement | null): boolean {
    if (!input || !input.classList.contains('po-timepicker-segment-input') || input.value.length !== 1) {
      return false;
    }

    const normalizedValue = input.value.padStart(2, '0');
    input.value = normalizedValue;

    if (input === this.inputEl?.nativeElement) {
      this.hourDisplay = normalizedValue;
    } else if (input === this.minuteInputEl?.nativeElement) {
      this.minuteDisplay = normalizedValue;
    } else if (input === this.secondInputEl?.nativeElement) {
      this.secondDisplay = normalizedValue;
    }

    return true;
  }

  private shouldCommitForInternalFocusTarget(target: HTMLElement | null): boolean {
    if (!target) {
      return false;
    }

    return (
      this.iconTimepicker?.buttonElement?.nativeElement?.contains(target) ||
      this.iconClean?.nativeElement?.contains(target) ||
      !!target.closest('.po-field-helper-button')
    );
  }

  /** Combina os valores dos segmentos em uma string de horario e atualiza o modelo. */
  private updateCombinedValue(): void {
    if (!this.areSegmentsComplete()) {
      this.clearValidationValue();
      this.timeValue = '';
      this.callOnChange('');
      this.validateModel(this.timeValue);
      return;
    }

    const displayCombined = this.buildDisplayCombined();

    if (this.is12HourFormat && !this.isValidTimeString(displayCombined, 1, 12)) {
      this.applyInputValidationError(displayCombined, false, { minHour: 1, maxHour: 12 });
      return;
    }

    const combined = this.is12HourFormat ? this.convertDisplayTo24h(displayCombined) : displayCombined;
    this.updateTimeFromInput(combined);
  }

  private areSegmentsComplete(): boolean {
    if (this.hourDisplay.length < 2 || this.minuteDisplay.length < 2) {
      return false;
    }
    return !(this.showSeconds && this.secondDisplay.length < 2);
  }

  private buildDisplayCombined(): string {
    const displayHour = this.hourDisplay.padStart(2, '0');
    const minute = this.minuteDisplay.padStart(2, '0');
    let combined = `${displayHour}:${minute}`;

    if (this.showSeconds) {
      const second = this.secondDisplay.padStart(2, '0');
      combined += `:${second}`;
    }

    return combined;
  }

  private convertDisplayTo24h(displayCombined: string): string {
    let hourValue = parseInt(this.hourDisplay, 10);
    const currentPeriod = this.periodDisplay || this.getDefaultPeriodDisplay();
    this.periodDisplay = currentPeriod;

    if (currentPeriod === 'AM' && hourValue === 12) {
      hourValue = 0;
    } else if (currentPeriod === 'PM' && hourValue !== 12) {
      hourValue = hourValue + 12;
    }

    const hour = hourValue.toString().padStart(2, '0');
    const minuteAndSecond = displayCombined.substring(3);
    return `${hour}:${minuteAndSecond}`;
  }

  /** Completa valores de segmento incompletos e atualiza o modelo no blur. */
  private validateAndUpdateModel(): void {
    if (this.hourDisplay && this.hourDisplay.length === 1) {
      this.hourDisplay = this.hourDisplay.padStart(2, '0');
      if (this.inputEl?.nativeElement) {
        this.inputEl.nativeElement.value = this.hourDisplay;
      }
    }
    if (this.minuteDisplay && this.minuteDisplay.length === 1) {
      this.minuteDisplay = this.minuteDisplay.padStart(2, '0');
      if (this.minuteInputEl?.nativeElement) {
        this.minuteInputEl.nativeElement.value = this.minuteDisplay;
      }
    }
    if (this.secondDisplay && this.secondDisplay.length === 1) {
      this.secondDisplay = this.secondDisplay.padStart(2, '0');
      if (this.secondInputEl?.nativeElement) {
        this.secondInputEl.nativeElement.value = this.secondDisplay;
      }
    }

    this.updateCombinedValue();
  }

  private updateTimeFromInput(rawValue: string): void {
    if (!this.isValidTimeString(rawValue)) {
      this.applyInputValidationError(rawValue, false);
      return;
    }

    if (!this.isTimeInRange(rawValue)) {
      this.applyInputValidationError(rawValue, true);
      return;
    }

    this.clearValidationValue();
    if (this.isGeneratedErrorPattern(this.errorPattern)) {
      this.errorPattern = '';
    }

    this.timeValue = rawValue;
    const output = this.formatOutput(rawValue);
    this.callOnChange(output);
    this.validateModel(output);
  }

  private applyInputValidationError(
    rawValue: string,
    isOutOfRange: boolean,
    hourRange?: { minHour: number; maxHour: number }
  ): void {
    this.timeValue = '';
    this.setValidationValue(rawValue, hourRange?.minHour, hourRange?.maxHour);
    this.errorPattern = isOutOfRange ? this.getDefaultOutOfRangeTimeMessage() : this.getDefaultInvalidTimeMessage();
    this.callOnChange('');
    this.validateModel(rawValue);
  }

  private controlChangeEmitter() {
    const currentValue = this.timeValue;

    if (currentValue !== this.valueBeforeChange) {
      this.valueBeforeChange = currentValue;

      clearTimeout(this.timeoutChange);
      this.timeoutChange = setTimeout(() => {
        this.onchange.emit(currentValue);
      }, 200);
    }
  }

  /**
   * Completa automaticamente os segundos com `:00` ao fechar o timer
   * quando `showSeconds=true` e o usuario preencheu apenas hora e minuto (HH:mm).
   *
   * Esse comportamento emite `callOnChange` e `controlChangeEmitter`, o que
   * significa que formularios reativos observando `valueChanges` receberao
   * uma emissao adicional no momento do fechamento do timer.
   */
  private completeSecondsOnClose(): void {
    if (
      !this.showSeconds ||
      !this.timeValue ||
      this.timeValue.length !== 5 ||
      !this.isValidTimeString(this.timeValue)
    ) {
      return;
    }

    const committedTime = `${this.timeValue}:00`;
    this.timeValue = committedTime;
    this.updateInputDisplay(committedTime);

    const output = this.formatOutput(committedTime);
    this.callOnChange(output);
    this.controlChangeEmitter();
  }

  private initializeListeners() {
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.wasClickedOnPicker(event);
    });

    this.eventResizeListener = this.renderer.listen('window', 'resize', () => {
      this.closeTimer();
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  private isAdditionalHelpEventTriggered(): boolean {
    return this.additionalHelpEventTrigger === 'event';
  }

  private readonly onScroll = (): void => {
    this.controlPosition.adjustPosition(poTimerPositionDefault);
  };

  private removeListeners() {
    if (this.clickListener) {
      this.clickListener();
    }

    if (this.eventResizeListener) {
      this.eventResizeListener();
    }

    window.removeEventListener('scroll', this.onScroll, true);
  }

  private setDialogPickerStyleDisplay(value: string): void {
    if (this.dialogPicker?.nativeElement) {
      this.dialogPicker.nativeElement.style.display = value;
    }
  }

  private setTimerPosition(): void {
    this.setDialogPickerStyleDisplay('block');
    this.adjustTimerPosition();
  }

  protected adjustTimerPosition(): void {
    if (this?.dialogPicker?.nativeElement && this.visible) {
      requestAnimationFrame(() => {
        const scrollHeight =
          this.dialogPicker.nativeElement.querySelector('po-timer')?.scrollHeight ??
          this.dialogPicker.nativeElement.scrollHeight;
        const scrollWidth =
          this.dialogPicker.nativeElement.querySelector('po-timer')?.scrollWidth ??
          this.dialogPicker.nativeElement.scrollWidth;

        this.dialogPicker.nativeElement.style.height = scrollHeight + 'px';
        this.dialogPicker.nativeElement.style.width = scrollWidth + 'px';

        this.controlPosition.setElements(
          this.dialogPicker.nativeElement,
          poTimerContentOffset,
          this.timepickerFieldEl || this.inputEl,
          ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          false,
          true
        );
        this.controlPosition.adjustPosition(poTimerPositionDefault);
      });
    }
  }

  private shouldHandleTab(event: KeyboardEvent): boolean {
    return this.visible && !event.shiftKey;
  }

  private focusTimer(event: KeyboardEvent): void {
    if (!this.timerComponent) {
      return;
    }

    event.preventDefault();
    this.timerComponent.focusFirstVisibleCell();
  }
}
