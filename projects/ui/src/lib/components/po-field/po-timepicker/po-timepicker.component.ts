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
  private controlPosition = inject(PoControlPositionService);
  private renderer = inject(Renderer2);

  @ViewChild('dialogPicker', { read: ElementRef, static: false }) dialogPicker: ElementRef;
  @ViewChild('iconTimepicker') iconTimepicker: PoButtonComponent;
  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;
  @ViewChild('minuteInput', { read: ElementRef }) minuteInputEl: ElementRef;
  @ViewChild('secondInput', { read: ElementRef }) secondInputEl: ElementRef;
  @ViewChild('timepickerField', { read: ElementRef }) timepickerFieldEl: ElementRef;
  @ViewChild('iconClean', { read: ElementRef }) iconClean!: ElementRef<HTMLElement>;
  @ViewChild('helperEl', { read: PoHelperComponent, static: false }) helperEl?: PoHelperComponent;
  @ViewChild('timer', { static: false }) timerComponent?: PoTimerComponent;

  /** Rótulo do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help?: string;

  displayAdditionalHelp: boolean = false;
  el: ElementRef;
  id = `po-timepicker[${uuid()}]`;
  visible: boolean = false;
  literals: any;

  /** Display values for individual segment inputs. */
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
    return this.getCustomPlaceholderSegment(0) ?? (this.is12HourFormat ? 'hh' : 'HH');
  }

  get minutePlaceholder(): string {
    return this.getCustomPlaceholderSegment(1) ?? 'mm';
  }

  get secondPlaceholder(): string {
    return this.getCustomPlaceholderSegment(2) ?? 'ss';
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

  @HostListener('keyup', ['$event'])
  onKeyup($event: any) {
    // Input handling is done by segment input handlers (onSegmentInput).
    // This host listener is kept only for backward compatibility.
    if (this.readonly) {
      return;
    }
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

    if ($event.key === 'Tab' && $event.shiftKey && $event.target instanceof HTMLInputElement && this.visible) {
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

  override ngOnDestroy() {
    this.removeListeners();
  }

  emitAdditionalHelp() {
    if (this.label && this.isAdditionalHelpEventTriggered()) {
      this.additionalHelp.emit();
    }
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
    if (!this.disabled && this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.focus();
    }
  }

  getAdditionalHelpTooltip() {
    return this.isAdditionalHelpEventTriggered() ? null : this.additionalHelpTooltip;
  }

  togglePicker(focusInput = true) {
    if (this.disabled || this.readonly || !this.iconTimepicker?.buttonElement?.nativeElement) {
      return;
    }

    if (!this.visible) {
      this.visible = true;
      this.setTimerPosition();
      this.initializeListeners();

      this.renderer.setAttribute(this.inputEl.nativeElement, 'aria-expanded', 'true');
      this.renderer.setAttribute(this.iconTimepicker.buttonElement.nativeElement, 'aria-expanded', 'true');

      this.timerComponent.initAllColumnOffsets();
    } else {
      this.inputEl.nativeElement.disabled = false;
      this.closeTimer(focusInput);

      this.renderer.removeAttribute(this.inputEl.nativeElement, 'aria-expanded');
      this.renderer.removeAttribute(this.iconTimepicker.buttonElement.nativeElement, 'aria-expanded');
    }
  }

  closeTimer(focusInput = true) {
    this.visible = false;
    this.removeListeners();
    this.setDialogPickerStyleDisplay('none');

    if (!this.verifyMobile() && focusInput) {
      this.focus();
    }

    if (!focusInput && this.clean && this.hasValue()) {
      setTimeout(() => {
        this.iconTimepicker.focus();
      });
    }
  }

  /** Chamado quando o po-timer emite p-change com o horário selecionado. */
  timerSelected(time: string) {
    if (!time) {
      this.clear();
      setTimeout(() => this.closeTimer(), 200);
      this.onchange.emit(undefined);
      return;
    }

    this.onTouchedModel?.();

    this.timeValue = time;
    this.updateInputDisplay(time);

    const output = this.formatOutput(time);
    this.callOnChange(output);
    this.controlChangeEmitter();

    // Quando showSeconds está ativo, só fecha o popup após a seleção completa (HH:mm:ss).
    // O po-timer emite p-change a cada coluna selecionada; enquanto o valor for apenas HH:mm,
    // mantemos o popup aberto para permitir a seleção dos segundos.
    const isSelectionComplete = !this.showSeconds || (time && time.split(':').length >= 3);

    if (isSelectionComplete) {
      if (!this.verifyMobile()) {
        this.focus();
      }
      this.togglePicker();
    }
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
      this.el.nativeElement.classList.contains('ng-invalid') &&
      this.el.nativeElement.classList.contains('ng-dirty') &&
      (this.hasValue() || (this.showErrorMessageRequired && (this.required || this.hasValidatorRequired)))
    );
  }

  /** Returns true if any segment has a value. */
  hasValue(): boolean {
    return this.hourDisplay !== '' || this.minuteDisplay !== '' || this.secondDisplay !== '';
  }

  getErrorPattern() {
    return this.errorPattern !== '' && this.hasInvalidClass() ? this.errorPattern : '';
  }

  clear() {
    this.valueBeforeChange = this.timeValue;
    this.timeValue = '';
    this.hourDisplay = '';
    this.minuteDisplay = '';
    this.secondDisplay = '';
    this.periodDisplay = '';
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
    this.controlChangeEmitter();
  }

  clearAndFocus() {
    this.clear();
    setTimeout(() => {
      this.focus();
    }, 200);
  }

  eventOnBlur($event: any) {
    // Kept for backward compatibility. Segment blur is handled by onSegmentBlur.
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

  /** Handles input on a segment field (hour, minute, second). */
  onSegmentInput(event: Event, segment: 'hour' | 'minute' | 'second'): void {
    const input = event.target as HTMLInputElement;
    // Allow only digits
    input.value = input.value.replace(/[^0-9]/g, '');

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

    // Auto-advance when 2 digits are entered
    if (input.value.length >= 2) {
      this.advanceToNextSegment(segment);
    }

    this.updateCombinedValue();
  }

  /** Handles keydown on a segment field for navigation. */
  onSegmentKeydown(event: KeyboardEvent, segment: 'hour' | 'minute' | 'second'): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && input.value === '' && input.selectionStart === 0) {
      this.advanceToPreviousSegment(segment);
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowLeft' && input.selectionStart === 0) {
      this.advanceToPreviousSegment(segment);
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowRight' && input.selectionStart === input.value.length) {
      this.advanceToNextSegment(segment);
      event.preventDefault();
      return;
    }

    // Block non-numeric keys (except navigation and control keys)
    if (event.key.length === 1 && !/[0-9]/.test(event.key) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      return;
    }

    // If Tab from the last segment while picker is open, focus the timer popup.
    if (event.key === 'Tab' && !event.shiftKey && this.visible && this.isLastSegment(segment)) {
      this.focusTimer(event);
    }

    this.keydown.emit(event);
  }

  /** Handles blur on a segment field. */
  onSegmentBlur(event: FocusEvent): void {
    this.isSegmentFocused = false;

    // Check if focus moved to another element within the timepicker
    const relatedTarget = event.relatedTarget as HTMLElement;
    const isInternalFocus = relatedTarget && this.el.nativeElement.contains(relatedTarget);

    if (!isInternalFocus) {
      this.onTouchedModel?.();
      this.onblur.emit();
      this.validateAndUpdateModel();
      this.controlChangeEmitter();
    }
  }

  /** Handles click on the field wrapper to focus the first segment input. */
  onFieldClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Only focus if clicked on the field wrapper itself, not on a segment input or timer button icon and if not disabled or readonly
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

  /** Handles focus on a segment field. */
  onSegmentFocus(): void {
    this.isSegmentFocused = true;
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
    if (!this.label && (helper || this.additionalHelpTooltip || isHelpEvt)) {
      if (isHelpEvt) {
        this.additionalHelp.emit();
      }
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
        this.updateInputDisplay(value);
      } else {
        this.clearSegmentDisplays();
        this.timeValue = '';
      }

      const output = this.formatOutput(this.timeValue);
      this.callOnChange(output, false);
    } else if (this.inputEl) {
      this.clearSegmentDisplays();
      this.timeValue = '';
      this.callOnChange('', false);
    }

    this.valueBeforeChange = this.timeValue;
  }

  /* istanbul ignore next */
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

  /** Handles focusout on the timer popup to close when focus leaves entirely. */
  onTimerFocusOut(event: FocusEvent): void {
    if (!this.visible) {
      return;
    }

    const relatedTarget = event.relatedTarget as HTMLElement;
    const dialogEl = this.dialogPicker?.nativeElement;

    // If the new focus target is outside the timer popup AND outside the timepicker field, close the timer.
    if (relatedTarget && dialogEl && !dialogEl.contains(relatedTarget)) {
      // Allow focus to move to elements within the timepicker component (button, clean, segments)
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

  setHelper(label?: string, additionalHelpTooltip?: string) {
    return setHelperSettings(
      label,
      additionalHelpTooltip,
      this.poHelperComponent(),
      this.size,
      this.isAdditionalHelpEventTriggered() ? this.additionalHelp : undefined
    );
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
      this.secondDisplay = parts.length >= 3 ? parts[2] : '';
      this.periodDisplay = period;
    } else {
      this.hourDisplay = parts[0] || '';
      this.minuteDisplay = parts[1] || '';
      this.secondDisplay = parts.length >= 3 ? parts[2] : '';
      this.periodDisplay = '';
    }

    this.syncSegmentInputElements();
  }

  /** Clears all segment display values and their corresponding input elements. */
  private clearSegmentDisplays(): void {
    this.hourDisplay = '';
    this.minuteDisplay = '';
    this.secondDisplay = '';
    this.periodDisplay = '';
    this.syncSegmentInputElements();
  }

  /** Syncs the native input element values with the display properties. */
  private syncSegmentInputElements(): void {
    console.log('syncSegmentInputElements');
    console.log('this.hourDisplay: ', this.hourDisplay);
    console.log('this.minuteDisplay: ', this.minuteDisplay);
    console.log('this.secondDisplay: ', this.secondDisplay);
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
    });
  }

  /** Advances focus to the next segment input. */
  private advanceToNextSegment(current: 'hour' | 'minute' | 'second'): void {
    if (current === 'hour' && this.minuteInputEl?.nativeElement) {
      this.minuteInputEl.nativeElement.focus();
      this.minuteInputEl.nativeElement.select();
    } else if (current === 'minute' && this.showSeconds && this.secondInputEl?.nativeElement) {
      this.secondInputEl.nativeElement.focus();
      this.secondInputEl.nativeElement.select();
    }
  }

  /** Advances focus to the previous segment input. */
  private advanceToPreviousSegment(current: 'hour' | 'minute' | 'second'): void {
    if (current === 'minute' && this.inputEl?.nativeElement) {
      this.inputEl.nativeElement.focus();
    } else if (current === 'second' && this.minuteInputEl?.nativeElement) {
      this.minuteInputEl.nativeElement.focus();
    }
  }

  /** Focuses the last visible segment input. */
  private focusLastSegment(): void {
    if (this.showSeconds && this.secondInputEl?.nativeElement) {
      this.secondInputEl.nativeElement.focus();
    } else if (this.minuteInputEl?.nativeElement) {
      this.minuteInputEl.nativeElement.focus();
    } else {
      this.focus();
    }
  }

  /** Checks if the given segment is the last visible one. */
  private isLastSegment(segment: 'hour' | 'minute' | 'second'): boolean {
    if (this.showSeconds) {
      return segment === 'second';
    }
    return segment === 'minute';
  }

  /** Combines segment values into a time string and updates the model. */
  private updateCombinedValue(): void {
    if (this.hourDisplay.length < 2 || this.minuteDisplay.length < 2) {
      this.timeValue = '';
      this.callOnChange('');
      return;
    }

    let hourValue = parseInt(this.hourDisplay, 10);
    const minute = this.minuteDisplay.padStart(2, '0');

    // Convert 12h display back to 24h for the internal model
    if (this.is12HourFormat && this.periodDisplay) {
      if (this.periodDisplay === 'AM' && hourValue === 12) {
        hourValue = 0;
      } else if (this.periodDisplay === 'PM' && hourValue !== 12) {
        hourValue = hourValue + 12;
      }
    }

    const hour = hourValue.toString().padStart(2, '0');
    let combined = `${hour}:${minute}`;

    if (this.showSeconds) {
      if (this.secondDisplay.length < 2) {
        this.timeValue = '';
        this.callOnChange('');
        return;
      }
      const second = this.secondDisplay.padStart(2, '0');
      combined += `:${second}`;
    }

    this.updateTimeFromInput(combined);
  }

  /** Pads incomplete segment values and updates the model on blur. */
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

  // ---------------------------------------------------------------------------
  // Private methods
  // ---------------------------------------------------------------------------

  private updateTimeFromInput(rawValue: string): void {
    if (!this.isValidTimeString(rawValue)) {
      this.timeValue = '';
      this.callOnChange('');
      return;
    }

    // Validate hours and minutes are in valid range
    const parts = rawValue.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts.length >= 3 ? parseInt(parts[2], 10) : 0;

    if (hours > 23 || minutes > 59 || seconds > 59) {
      this.timeValue = '';
      this.callOnChange('');
      return;
    }

    this.timeValue = rawValue;
    const output = this.formatOutput(rawValue);
    this.callOnChange(output);
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
    return (
      this.additionalHelpEventTrigger === 'event' ||
      (this.additionalHelpEventTrigger === undefined && this.additionalHelp.observed)
    );
  }

  private onScroll = (): void => {
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
    if (this.dialogPicker && this.dialogPicker.nativeElement) {
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
