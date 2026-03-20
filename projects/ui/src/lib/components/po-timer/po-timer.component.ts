import {
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
  inject
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoTimerBaseComponent } from './po-timer-base.component';
import { PoTimerScrollHelper } from './po-timer-scroll.helper';

/** Quantidade de itens visiveis por coluna. */
const VISIBLE_ITEMS_PER_COLUMN = 6;

/** Tipo dos eixos das colunas. */
type PoTimerColumnType = 'hour' | 'minute' | 'second' | 'period';

/**
 * @docsPrivate
 *
 * @docsExtends PoTimerBaseComponent
 *
 * @example
 *
 * <example name="po-timer-basic" title="PO Timer Basic">
 *  <file name="sample-po-timer-basic/sample-po-timer-basic.component.html"> </file>
 *  <file name="sample-po-timer-basic/sample-po-timer-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-timer-labs" title="PO Timer Labs">
 *  <file name="sample-po-timer-labs/sample-po-timer-labs.component.html"> </file>
 *  <file name="sample-po-timer-labs/sample-po-timer-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-timer-alarm" title="PO Timer - Alarm">
 *  <file name="sample-po-timer-alarm/sample-po-timer-alarm.component.html"> </file>
 *  <file name="sample-po-timer-alarm/sample-po-timer-alarm.component.ts"> </file>
 * </example>
 *
 * <example name="po-timer-shift" title="PO Timer - Shift">
 *  <file name="sample-po-timer-shift/sample-po-timer-shift.component.html"> </file>
 *  <file name="sample-po-timer-shift/sample-po-timer-shift.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-timer',
  templateUrl: './po-timer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoTimerComponent),
      multi: true
    }
  ],
  standalone: false
})
export class PoTimerComponent
  extends PoTimerBaseComponent
  implements OnInit, OnChanges, AfterViewInit, AfterViewChecked, OnDestroy
{
  // Refs dos botoes de cada coluna para gerenciamento de foco programatico.
  @ViewChildren('hourCell', { read: ElementRef }) hourCells: QueryList<ElementRef>;
  @ViewChildren('minuteCell', { read: ElementRef }) minuteCells: QueryList<ElementRef>;
  @ViewChildren('secondCell', { read: ElementRef }) secondCells: QueryList<ElementRef>;
  @ViewChildren('periodCell', { read: ElementRef }) periodCells: QueryList<ElementRef>;

  // Containers de recorte (clipping) de cada coluna.
  @ViewChildren('hourItems', { read: ElementRef }) hourItemsRefs: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('minuteItems', { read: ElementRef }) minuteItemsRefs: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('secondItems', { read: ElementRef }) secondItemsRefs: QueryList<ElementRef<HTMLElement>>;

  // Arrays repetidos para o infinity scroll.
  displayHours: Array<number> = [];
  displayMinutes: Array<number> = [];
  displaySeconds: Array<number> = [];

  // Emite quando Tab/Shift+Tab atinge a borda do componente.
  @Output('p-boundary-tab') boundaryTab = new EventEmitter<{
    direction: 'forward' | 'backward';
    event: KeyboardEvent;
    column: PoTimerColumnType;
  }>();

  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private hasViewInitialized = false;
  private currentRenderedSize: string;

  /** ID do requestAnimationFrame pendente para throttle do wheel. */
  private wheelRafId: number | null = null;

  /**
   * Offset atual (em px) de cada coluna, mantido em JS.
   * O container de itens e posicionado via translateY(-offset).
   * O offset e mantido sempre no intervalo [sectionHeight, 2*sectionHeight)
   * para que o salto de reposicionamento seja sempre invisivel (as secoes
   * sao identicas por serem copias do mesmo array fonte).
   */
  private columnOffsets: Record<PoTimerColumnType, number> = { hour: 0, minute: 0, second: 0, period: 0 };

  /**
   * Indice no displayArray do item focado em cada coluna.
   * Usado para redirecionar o foco ao botao correto ao entrar na coluna via Tab.
   */
  private focusedDisplayIndex: Record<PoTimerColumnType, number> = { hour: 0, minute: 0, second: 0, period: 0 };

  // IDs dos itens ativos em cada coluna para aria-activedescendant.
  // Aponta para o item focado no displayArray.
  activeDescendantIds: Record<PoTimerColumnType, string> = { hour: '', minute: '', second: '', period: '' };

  // Cache de minutos desabilitados para evitar recalculo a cada ciclo de change detection.
  disabledMinuteCache: Set<number> = new Set();

  // Cache de segundos desabilitados para evitar recalculo a cada ciclo de change detection.
  disabledSecondCache: Set<number> = new Set();

  constructor() {
    const languageService = inject(PoLanguageService);
    super(languageService);
  }

  ngOnInit(): void {
    this.generateHours();
    this.generateMinutes();
    this.generateSeconds();
    this.buildDisplayArrays();
    this.rebuildDisabledCaches();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const rebuildKeys = ['format', 'showSeconds', 'minuteInterval', 'secondInterval'];
    const needsRebuild = rebuildKeys.some(key => key in changes && !changes[key].firstChange);

    if (needsRebuild) {
      this.buildDisplayArrays();
      this.rebuildDisabledCaches();
      this.changeDetector.markForCheck();

      if (this.hasViewInitialized) {
        this.realignColumnsToSelection();
      }
    }

    if ('minTime' in changes || 'maxTime' in changes) {
      this.rebuildDisabledCaches();
      this.changeDetector.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    this.hasViewInitialized = true;
    this.currentRenderedSize = this.size;

    // requestAnimationFrame garante que o layout ja foi calculado
    // e scrollHeight dos containers esta disponivel.
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.initAllColumnOffsets();
      });
    });
  }

  ngAfterViewChecked(): void {
    if (!this.hasViewInitialized) {
      return;
    }

    const nextSize = this.size;

    if (nextSize !== this.currentRenderedSize) {
      this.currentRenderedSize = nextSize;

      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.initAllColumnOffsets();
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.wheelRafId != null) {
      cancelAnimationFrame(this.wheelRafId);
    }
  }

  // Seleciona uma hora.
  onSelectHour(hour: number): void {
    if (this.isHourDisabled(hour)) {
      return;
    }

    this.selectedHour = hour;
    this.rebuildDisabledCaches();

    if (this.selectedMinute != null && this.disabledMinuteCache.has(this.selectedMinute)) {
      this.selectedMinute = this.getFirstAvailableMinuteForCurrentHour();
      this.rebuildDisabledCaches();
    }

    if (
      this.showSeconds &&
      this.selectedMinute != null &&
      this.selectedSecond != null &&
      this.disabledSecondCache.has(this.selectedSecond)
    ) {
      this.selectedSecond = this.getFirstAvailableSecondForCurrentHourAndMinute();
    }

    this.emitChange();
    this.callOnTouched();
    this.changeDetector.markForCheck();
  }

  // Seleciona um minuto.
  onSelectMinute(minute: number): void {
    if (this.isMinuteDisabled(minute)) {
      return;
    }

    this.selectedMinute = minute;
    this.rebuildDisabledCaches();

    if (this.showSeconds && this.selectedSecond != null && this.disabledSecondCache.has(this.selectedSecond)) {
      this.selectedSecond = this.getFirstAvailableSecondForCurrentHourAndMinute();
    }

    this.emitChange();
    this.callOnTouched();
    this.changeDetector.markForCheck();
  }

  // Seleciona um segundo.
  onSelectSecond(second: number): void {
    if (this.disabledSecondCache.has(second)) {
      return;
    }

    this.selectedSecond = second;
    this.emitChange();
    this.callOnTouched();
    this.changeDetector.markForCheck();
  }

  // Alterna o periodo AM/PM.
  onSelectPeriod(newPeriod: string): void {
    this.period = newPeriod;
    this.rebuildDisabledCaches();
    this.focusedDisplayIndex['period'] = newPeriod === 'AM' ? 0 : 1;
    this.focusButtonAt('period', this.focusedDisplayIndex['period']);
    this.emitChange();
    this.callOnTouched();
    this.changeDetector.markForCheck();
  }

  onCellFocus(type: PoTimerColumnType, displayIndex: number): void {
    this.focusedDisplayIndex[type] = displayIndex;
    this.normalizeFocusedIndex(type);
    this.updateActiveDescendant(type, this.focusedDisplayIndex[type]);
  }

  getCellTabIndex(type: PoTimerColumnType, displayIndex: number): number {
    const domFocusedIndex = this.getDomFocusedDisplayIndex(type);
    const normalizedIndex = domFocusedIndex ?? this.getCurrentFocusedDisplayIndex(type);
    return normalizedIndex === displayIndex ? 0 : -1;
  }

  // Trata navegacao via teclado na coluna focada.
  // ArrowUp/Down movem o foco para o proximo/anterior item habilitado e so
  // traduzem a lista quando o item focado sai da viewport.
  // Enter/Space selecionam o item focado.
  // Tab/Shift+Tab movem o foco para a proxima/anterior coluna visivel,
  // ou deixam o browser mover o foco naturalmente ao sair do componente.
  onCellKeydown(event: KeyboardEvent, type: PoTimerColumnType): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocusByStep(type, -1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocusByStep(type, 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectFocusedItem(type);
        break;
      case 'Tab':
        if (event.shiftKey) {
          this.focusPreviousColumn(event, type);
        } else {
          this.focusNextColumn(event, type);
        }
        break;
      default:
        break;
    }
  }

  // Trata navegacao via teclado na coluna AM/PM.
  onPeriodKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.movePeriodFocusByStep(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.movePeriodFocusByStep(1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectFocusedPeriod();
        break;
      case 'Tab':
        if (event.shiftKey) {
          this.focusPreviousColumn(event, 'period');
        } else {
          this.focusNextColumn(event, 'period');
        }
        break;
      default:
        break;
    }
  }

  // Trata o scroll da roda do mouse nas colunas.
  //
  // A posicao e controlada por JS via translateY, sem qualquer interacao
  // com o scrollTop do browser. Usa throttle via requestAnimationFrame
  // para agrupar multiplos ticks do wheel em um unico step por frame,
  // evitando acumulo em trackpads de alta resolucao.
  onColumnWheel(event: WheelEvent, type: PoTimerColumnType): void {
    event.preventDefault();

    if (this.wheelRafId != null) {
      return;
    }

    const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1;

    this.ngZone.runOutsideAngular(() => {
      this.wheelRafId = requestAnimationFrame(() => {
        this.wheelRafId = null;
        this.scrollColumnByStep(type, direction);
      });
    });
  }

  // Define o horario a partir de um valor externo.
  writeValue(time: string): void {
    if (this.hasViewInitialized && time === this.buildTimeValue()) {
      return;
    }

    super.writeValue(time);
    this.rebuildDisabledCaches();
    this.changeDetector.markForCheck();

    // Reposicionar as colunas para o valor selecionado apos a proxima renderizacao.
    if (this.hasViewInitialized) {
      requestAnimationFrame(() => {
        this.ngZone.runOutsideAngular(() => {
          this.initAllColumnOffsets();
        });
      });
    }
  }

  // Track function para o @for do infinity scroll.
  trackByIndex(index: number, _item: number): number {
    return index;
  }

  focusFirstVisibleCell(): void {
    const firstType = this.getVisibleColumnTypes()[0];
    if (firstType) {
      this.focusActiveButton(firstType);
    }
  }

  focusLastVisibleCell(): void {
    const columns = this.getVisibleColumnTypes();
    const lastType = columns[columns.length - 1];
    if (lastType) {
      this.focusActiveButton(lastType);
    }
  }

  initAllColumnOffsets(): void {
    this.initColumnOffset('hour');
    this.initColumnOffset('minute');
    this.initColumnOffset('second');
    this.refreshRovingTabIndex();
  }

  /**
   * Posiciona o container de itens na secao do meio do array repetido,
   * alinhando o item selecionado ao topo da janela visivel.
   *
   * Estrutura do array repetido (exemplo sourceLength = 24, repeats = 3):
   *   [secao 0: itens 0-23] [secao 1: itens 0-23] [secao 2: itens 0-23]
   *                         ^--- usuario fica aqui (offset em [sH, 2*sH))
   *
   * Usar a secao do meio garante que qualquer deslize para cima ou para baixo
   * tem espaco antes de precisar fazer o wrap.
   */
  private initColumnOffset(type: PoTimerColumnType): void {
    const itemsEl = this.getItemsElement(type);
    if (!itemsEl) {
      return;
    }

    const sourceArray = this.getSourceArray(type);
    const displayArray = this.getDisplayArray(type);

    if (!sourceArray.length || !displayArray.length) {
      return;
    }

    const step = this.getCellStep(itemsEl, displayArray.length);
    const sectionHeight = sourceArray.length * step;
    const useInfinityScroll = sourceArray.length >= 6;

    // Determinar o indice do valor selecionado no array fonte para alinhar a visao.
    const selectedValue = this.getSelectedValue(type);
    const selectedIndex = sourceArray.indexOf(selectedValue);
    const selectedValueIsValid =
      selectedIndex >= 0 && selectedValue != null && !this.isValueDisabledByType(type, sourceArray[selectedIndex]);
    const alignIndex = selectedValueIsValid ? selectedIndex : this.getFirstAvailableIndexByType(type, sourceArray);

    // Quando nao usa infinity scroll (< 6 itens), nao aplicar translateY.
    const offset = useInfinityScroll ? sectionHeight + alignIndex * step : 0;
    this.columnOffsets[type] = offset;
    itemsEl.style.transform = useInfinityScroll ? `translateY(${-offset}px)` : '';
    this.focusedDisplayIndex[type] = useInfinityScroll
      ? this.computeTopDisplayIndex(offset, step, displayArray.length)
      : alignIndex;
    this.normalizeFocusedIndex(type);
    this.updateActiveDescendant(type, this.focusedDisplayIndex[type]);
  }

  private getFirstAvailableIndexByType(type: PoTimerColumnType, sourceArray: Array<number>): number {
    if (!sourceArray?.length) {
      return 0;
    }

    switch (type) {
      case 'hour': {
        const index = sourceArray.findIndex(hour => !this.isHourDisabled(hour));
        return index >= 0 ? index : 0;
      }

      case 'minute': {
        const referenceHour = this.getReferenceHourForConstraints();
        if (referenceHour == null) {
          return 0;
        }

        const index = sourceArray.findIndex(minute => this.isMinuteAllowedForHour(referenceHour, minute));
        return index >= 0 ? index : 0;
      }

      case 'second': {
        const referenceHour = this.getReferenceHourForConstraints();
        if (referenceHour == null) {
          return 0;
        }

        const referenceMinute = this.getReferenceMinuteForConstraints(referenceHour);
        if (referenceMinute == null) {
          return 0;
        }

        const index = sourceArray.findIndex(second => this.isSecondAllowed(referenceHour, referenceMinute, second));
        return index >= 0 ? index : 0;
      }

      default:
        return 0;
    }
  }

  private getReferenceHourForConstraints(): number | null {
    if (this.selectedHour != null && !this.isHourDisabled(this.selectedHour)) {
      return this.selectedHour;
    }

    const index = this.hours.findIndex(hour => !this.isHourDisabled(hour));
    return index >= 0 ? this.hours[index] : null;
  }

  private getReferenceMinuteForConstraints(referenceHour: number): number | null {
    if (this.selectedMinute != null && this.isMinuteAllowedForHour(referenceHour, this.selectedMinute)) {
      return this.selectedMinute;
    }

    const index = this.minutes.findIndex(minute => this.isMinuteAllowedForHour(referenceHour, minute));
    return index >= 0 ? this.minutes[index] : null;
  }

  private isValueDisabledByType(type: PoTimerColumnType, value: number): boolean {
    switch (type) {
      case 'hour':
        return this.isHourDisabled(value);
      case 'minute': {
        if (this.selectedHour == null) {
          return false;
        }
        return this.isMinuteDisabled(value);
      }
      case 'second': {
        if (this.selectedHour == null || this.selectedMinute == null) {
          return false;
        }
        return this.isSecondDisabled(value);
      }
      default:
        return false;
    }
  }

  /**
   * Desloca a coluna pelo numero de passos indicado e aplica o wrap modular.
   *
   * O wrap mantem o offset em [sectionHeight, 2*sectionHeight), aproveitando
   * o fato de que as secoes sao identicas — o salto e impercetivel visualmente.
   */
  private scrollColumnByStep(type: PoTimerColumnType, steps: number, syncFocusToTop = true): void {
    const itemsEl = this.getItemsElement(type);
    if (!itemsEl) {
      return;
    }

    const sourceArray = this.getSourceArray(type);
    const displayArray = this.getDisplayArray(type);

    if (!sourceArray.length || !displayArray.length) {
      return;
    }

    const step = this.getCellStep(itemsEl, displayArray.length);
    const sectionHeight = sourceArray.length * step;
    const useInfinityScroll = sourceArray.length >= 6;

    if (!useInfinityScroll) {
      // Sem infinity scroll: apenas atualizar o indice focado sem translateY.
      const newIndex =
        (((this.focusedDisplayIndex[type] + steps) % sourceArray.length) + sourceArray.length) % sourceArray.length;

      if (syncFocusToTop) {
        this.focusedDisplayIndex[type] = newIndex;
        this.normalizeFocusedIndex(type);
        this.updateActiveDescendant(type, this.focusedDisplayIndex[type]);
      }

      return;
    }

    const rawOffset = this.columnOffsets[type] + steps * step;
    const wrappedOffset = this.wrapOffset(rawOffset, sectionHeight);

    this.columnOffsets[type] = wrappedOffset;
    itemsEl.style.transform = `translateY(${-wrappedOffset}px)`;

    if (syncFocusToTop) {
      this.focusedDisplayIndex[type] = this.computeTopDisplayIndex(wrappedOffset, step, displayArray.length);
      this.normalizeFocusedIndex(type);
      this.updateActiveDescendant(type, this.focusedDisplayIndex[type]);
    }
  }

  private wrapOffset(offset: number, sectionHeight: number): number {
    return PoTimerScrollHelper.wrapOffset(offset, sectionHeight);
  }

  private getCellStep(itemsEl: HTMLElement, displayCount: number): number {
    return PoTimerScrollHelper.getCellStep(itemsEl, displayCount);
  }

  /**
   * Foca o botao nativo (<button> interno ao po-button) no indice indicado
   * do displayArray da coluna. O po-button tem tabindex=-1 para nao aparecer
   * no fluxo natural do Tab, mas pode receber foco programatico.
   */
  private focusButtonAt(type: PoTimerColumnType, displayIndex: number): void {
    const cells = this.getCellsForType(type);
    if (!cells) {
      return;
    }

    const arr = cells.toArray();
    if (!arr.length) {
      return;
    }

    const startIndex = this.getFocusableDisplayIndex(type, displayIndex, arr.length);

    for (let offset = 0; offset < arr.length; offset++) {
      const index = (startIndex + offset) % arr.length;
      const nativeButton = arr[index]?.nativeElement?.querySelector('button') as HTMLButtonElement | null;

      if (!nativeButton || nativeButton.disabled || nativeButton.getAttribute('aria-disabled') === 'true') {
        continue;
      }

      this.focusedDisplayIndex[type] = index;
      nativeButton.focus({ preventScroll: true });
      this.refreshRovingTabIndex();
      return;
    }
  }

  private focusActiveButton(type: PoTimerColumnType): void {
    this.normalizeFocusedIndex(type);
    this.focusButtonAt(type, this.focusedDisplayIndex[type]);
    this.updateActiveDescendant(type, this.focusedDisplayIndex[type]);
  }

  private computeTopDisplayIndex(offset: number, step: number, displayLength: number): number {
    return PoTimerScrollHelper.computeTopDisplayIndex(offset, step, displayLength);
  }

  /**
   * Foca a proxima coluna visivel do componente.
   * Se a coluna atual for a ultima, nao cancela o evento e deixa o browser
   * mover o foco para o proximo elemento focavel apos o componente.
   */
  private focusNextColumn(event: KeyboardEvent, type: PoTimerColumnType): void {
    const columns = this.getVisibleColumnTypes();
    const currentIdx = columns.indexOf(type);

    if (currentIdx < 0) {
      return;
    }

    const nextType = columns[currentIdx + 1];

    if (nextType) {
      event.preventDefault();
      this.focusActiveButton(nextType);
      return;
    }

    this.boundaryTab.emit({ direction: 'forward', event, column: type });
  }

  /**
   * Foca a coluna anterior visivel do componente.
   * Se a coluna atual for a primeira, nao cancela o evento e deixa o browser
   * mover o foco para o elemento focavel antes do componente.
   */
  private focusPreviousColumn(event: KeyboardEvent, type: PoTimerColumnType): void {
    const columns = this.getVisibleColumnTypes();
    const currentIdx = columns.indexOf(type);

    if (currentIdx < 0) {
      return;
    }

    const prevType = columns[currentIdx - 1];

    if (prevType) {
      event.preventDefault();
      this.focusActiveButton(prevType);
      return;
    }

    this.boundaryTab.emit({ direction: 'backward', event, column: type });
  }

  /**
   * Retorna, em ordem DOM, os elementos focaveis de todas as colunas visiveis.
   * Inclui o div da coluna AM/PM (se visivel), cujos botoes internos recebem
   * o foco diretamente pois nao usam o padrao de roving focus.
   */
  private getVisibleColumnTypes(): Array<PoTimerColumnType> {
    const columns: Array<PoTimerColumnType> = ['hour', 'minute'];

    if (this.showSeconds) {
      columns.push('second');
    }

    if (this.is12HourFormat) {
      columns.push('period');
    }

    return columns;
  }

  private getCellsForType(type: PoTimerColumnType): QueryList<ElementRef> | null {
    switch (type) {
      case 'hour':
        return this.hourCells;
      case 'minute':
        return this.minuteCells;
      case 'second':
        return this.secondCells;
      case 'period':
        return this.periodCells;
      default:
        return null;
    }
  }

  /** Atualiza aria-activedescendant para o indice focado no displayArray. */
  private updateActiveDescendant(type: PoTimerColumnType, displayIndex: number): void {
    const normalizedIndex = this.getNormalizedDisplayIndex(type, displayIndex);

    if (normalizedIndex < 0) {
      return;
    }

    this.activeDescendantIds[type] = `po-timer-${type}-${normalizedIndex}`;
  }

  /**
   * Move o foco para o proximo item habilitado na direcao indicada.
   * So aplica translate quando o item focado fica parcial ou totalmente fora da viewport.
   */
  private moveFocusByStep(type: PoTimerColumnType, stepDirection: -1 | 1): void {
    const displayArray = this.getDisplayArray(type);
    if (!displayArray.length) {
      return;
    }

    const nextIndex = this.getNextEnabledDisplayIndex(type, this.focusedDisplayIndex[type], stepDirection);
    this.focusedDisplayIndex[type] = nextIndex;
    this.normalizeFocusedIndex(type);

    const normalizedFocusedIndex = this.focusedDisplayIndex[type];

    if (this.shouldTranslateToRevealFocusedItem(type, normalizedFocusedIndex)) {
      const stepsToReveal = this.getStepsToRevealFocusedItem(type, normalizedFocusedIndex, stepDirection);

      if (stepsToReveal !== 0) {
        this.scrollColumnByStep(type, stepsToReveal, false);
        this.focusedDisplayIndex[type] = normalizedFocusedIndex;
      }
    }

    this.focusButtonAt(type, this.focusedDisplayIndex[type]);
    this.updateActiveDescendant(type, this.focusedDisplayIndex[type]);
  }

  private movePeriodFocusByStep(stepDirection: -1 | 1): void {
    const nextIndex = (((this.getCurrentFocusedDisplayIndex('period') + stepDirection) % 2) + 2) % 2;
    this.focusedDisplayIndex['period'] = nextIndex;
    this.focusButtonAt('period', nextIndex);
    this.updateActiveDescendant('period', nextIndex);
  }

  private selectFocusedPeriod(): void {
    const focusedPeriodIndex = this.getCurrentFocusedDisplayIndex('period');
    this.onSelectPeriod(focusedPeriodIndex === 0 ? 'AM' : 'PM');
  }

  private getFocusableDisplayIndex(type: PoTimerColumnType, displayIndex: number, displayLength: number): number {
    const normalizedIndex = ((displayIndex % displayLength) + displayLength) % displayLength;
    const sourceArray = this.getSourceArray(type);
    const sourceLength = sourceArray.length;

    if (sourceLength < VISIBLE_ITEMS_PER_COLUMN) {
      return normalizedIndex;
    }

    const itemsEl = this.getItemsElement(type);
    if (!itemsEl) {
      return normalizedIndex;
    }

    const step = this.getCellStep(itemsEl, displayLength);
    if (step <= 0) {
      return normalizedIndex;
    }

    const viewportHeight = this.getColumnViewportHeight(itemsEl, step);
    const sourceIndex = ((normalizedIndex % sourceLength) + sourceLength) % sourceLength;
    const tolerance = 0.5;
    let bestIndex = normalizedIndex;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let candidate = sourceIndex; candidate < displayLength; candidate += sourceLength) {
      const itemTop = candidate * step - this.columnOffsets[type];
      const itemBottom = itemTop + step;
      const isFullyVisible = itemTop >= -tolerance && itemBottom <= viewportHeight + tolerance;
      let clippedPixels = 0;
      if (itemTop < 0) {
        clippedPixels = -itemTop;
      } else if (itemBottom > viewportHeight) {
        clippedPixels = itemBottom - viewportHeight;
      }
      const sectionDistance = Math.abs(candidate - normalizedIndex) / sourceLength;
      const score = (isFullyVisible ? 0 : 1000) + clippedPixels + sectionDistance;

      if (score < bestScore) {
        bestScore = score;
        bestIndex = candidate;
      }
    }

    return bestIndex;
  }

  /** Seleciona o item atualmente focado na coluna. */
  private selectFocusedItem(type: PoTimerColumnType): void {
    const displayArray = this.getDisplayArray(type);

    if (!displayArray.length) {
      return;
    }

    const displayIndex = this.getNormalizedDisplayIndex(type, this.focusedDisplayIndex[type]);
    if (displayIndex < 0 || this.isDisplayIndexDisabled(type, displayIndex, displayArray)) {
      return;
    }

    const value = displayArray[displayIndex];

    switch (type) {
      case 'hour':
        this.onSelectHour(value);
        break;
      case 'minute':
        this.onSelectMinute(value);
        break;
      case 'second':
        this.onSelectSecond(value);
        break;
      default:
        break;
    }
  }

  private shouldTranslateToRevealFocusedItem(type: PoTimerColumnType, focusedIndex: number): boolean {
    const itemsEl = this.getItemsElement(type);
    const sourceArray = this.getSourceArray(type);
    const displayArray = this.getDisplayArray(type);

    if (!itemsEl || !sourceArray.length || sourceArray.length < VISIBLE_ITEMS_PER_COLUMN || !displayArray.length) {
      return false;
    }

    const step = this.getCellStep(itemsEl, displayArray.length);
    if (step <= 0) {
      return false;
    }

    const viewportHeight = this.getColumnViewportHeight(itemsEl, step);
    const normalizedIndex = this.getNormalizedDisplayIndex(type, focusedIndex);
    const itemTop = normalizedIndex * step - this.columnOffsets[type];
    const itemBottom = itemTop + step;
    const tolerance = 0.5;

    return itemTop < -tolerance || itemBottom > viewportHeight + tolerance;
  }

  private getStepsToRevealFocusedItem(type: PoTimerColumnType, focusedIndex: number, stepDirection: -1 | 1): number {
    const itemsEl = this.getItemsElement(type);
    const displayArray = this.getDisplayArray(type);

    if (!itemsEl || !displayArray.length) {
      return 0;
    }

    const step = this.getCellStep(itemsEl, displayArray.length);
    if (step <= 0) {
      return 0;
    }

    const viewportHeight = this.getColumnViewportHeight(itemsEl, step);
    const normalizedIndex = this.getNormalizedDisplayIndex(type, focusedIndex);
    const itemTop = normalizedIndex * step - this.columnOffsets[type];
    const itemBottom = itemTop + step;
    const tolerance = 0.5;

    if (stepDirection > 0) {
      if (itemBottom <= viewportHeight + tolerance) {
        return 0;
      }

      return Math.max(1, Math.ceil((itemBottom - viewportHeight) / step));
    }

    if (itemTop >= -tolerance) {
      return 0;
    }

    return -Math.max(1, Math.ceil(-itemTop / step));
  }

  private getColumnViewportHeight(itemsEl: HTMLElement, step: number): number {
    const viewportEl = itemsEl.parentElement;
    if (viewportEl?.clientHeight) {
      return viewportEl.clientHeight;
    }

    return step * VISIBLE_ITEMS_PER_COLUMN;
  }

  private getNextEnabledDisplayIndex(type: PoTimerColumnType, currentIndex: number, stepDirection: -1 | 1): number {
    const displayArray = this.getDisplayArray(type);
    const sourceArray = this.getSourceArray(type);
    const sourceLength = sourceArray.length;

    if (!displayArray.length) {
      return 0;
    }

    const startIndex = this.getNormalizedDisplayIndex(type, currentIndex);
    const maxIterations = sourceLength >= VISIBLE_ITEMS_PER_COLUMN ? sourceLength : displayArray.length;

    for (let offset = 1; offset <= maxIterations; offset++) {
      const candidateIndex = this.getNormalizedDisplayIndex(type, startIndex + offset * stepDirection);

      if (!this.isDisplayIndexDisabled(type, candidateIndex, displayArray)) {
        const sourceIndex = sourceLength > 0 ? candidateIndex % sourceLength : candidateIndex;
        return this.getDisplayIndexForSourceNearViewport(type, sourceIndex, stepDirection);
      }
    }

    return startIndex;
  }

  private getForwardDistance(fromIndex: number, toIndex: number, length: number): number {
    if (length <= 0) {
      return 0;
    }

    return (((toIndex - fromIndex) % length) + length) % length;
  }

  private getNormalizedDisplayIndex(type: PoTimerColumnType, displayIndex: number): number {
    const displayArray = this.getDisplayArray(type);

    if (!displayArray.length) {
      return -1;
    }

    return ((displayIndex % displayArray.length) + displayArray.length) % displayArray.length;
  }

  private getDisplayIndexForSourceNearViewport(
    type: PoTimerColumnType,
    sourceIndex: number,
    stepDirection: -1 | 1
  ): number {
    const displayArray = this.getDisplayArray(type);
    const sourceArray = this.getSourceArray(type);
    const sourceLength = sourceArray.length;

    if (!displayArray.length || sourceLength === 0) {
      return this.getNormalizedDisplayIndex(type, sourceIndex);
    }

    if (sourceLength < VISIBLE_ITEMS_PER_COLUMN) {
      return this.getNormalizedDisplayIndex(type, sourceIndex);
    }

    const normalizedSourceIndex = ((sourceIndex % sourceLength) + sourceLength) % sourceLength;
    const itemsEl = this.getItemsElement(type);
    const visibleCount = Math.min(VISIBLE_ITEMS_PER_COLUMN, displayArray.length);

    if (!itemsEl) {
      return this.getNormalizedDisplayIndex(type, sourceLength + normalizedSourceIndex);
    }

    const step = this.getCellStep(itemsEl, displayArray.length);
    if (step <= 0) {
      return this.getNormalizedDisplayIndex(type, sourceLength + normalizedSourceIndex);
    }

    const topIndex = this.computeTopDisplayIndex(this.columnOffsets[type], step, displayArray.length);
    let bestIndex = this.getNormalizedDisplayIndex(type, sourceLength + normalizedSourceIndex);
    let bestScore = Number.POSITIVE_INFINITY;

    for (let candidate = normalizedSourceIndex; candidate < displayArray.length; candidate += sourceLength) {
      const isVisible = this.getForwardDistance(topIndex, candidate, displayArray.length) < visibleCount;
      const directionalDistance =
        stepDirection > 0
          ? this.getForwardDistance(topIndex, candidate, displayArray.length)
          : this.getForwardDistance(candidate, topIndex, displayArray.length);

      const score = (isVisible ? 0 : displayArray.length) + directionalDistance;

      if (score < bestScore) {
        bestScore = score;
        bestIndex = candidate;
      }
    }

    return bestIndex;
  }

  private getItemsElement(type: PoTimerColumnType): HTMLElement {
    switch (type) {
      case 'hour':
        return this.hourItemsRefs?.first?.nativeElement;
      case 'minute':
        return this.minuteItemsRefs?.first?.nativeElement;
      case 'second':
        return this.secondItemsRefs?.first?.nativeElement;
      default:
        return null;
    }
  }

  private normalizeFocusedIndex(type: PoTimerColumnType): void {
    this.focusedDisplayIndex[type] = this.getNormalizedFocusedIndex(type);
  }

  private getNormalizedFocusedIndex(type: PoTimerColumnType): number {
    const displayArray = this.getDisplayArray(type);

    if (!displayArray.length) {
      return 0;
    }

    if (type === 'period') {
      return ((this.focusedDisplayIndex.period % 2) + 2) % 2;
    }

    const startIndex =
      ((this.focusedDisplayIndex[type] % displayArray.length) + displayArray.length) % displayArray.length;

    for (let offset = 0; offset < displayArray.length; offset++) {
      const index = (startIndex + offset) % displayArray.length;
      if (!this.isDisplayIndexDisabled(type, index, displayArray)) {
        return index;
      }
    }

    return startIndex;
  }

  private getCurrentFocusedDisplayIndex(type: PoTimerColumnType): number {
    if (type === 'period') {
      return ((this.focusedDisplayIndex.period % 2) + 2) % 2;
    }

    return this.getNormalizedDisplayIndex(type, this.focusedDisplayIndex[type]);
  }

  private getDomFocusedDisplayIndex(type: PoTimerColumnType): number | null {
    /* istanbul ignore next */
    if (typeof document === 'undefined') {
      return null;
    }

    const activeElement = document.activeElement as HTMLElement | null;
    const hostButton = activeElement?.closest('po-button.po-timer-display');
    const hostId = hostButton?.id;

    if (!hostId?.startsWith(`po-timer-${type}-`)) {
      return null;
    }

    const rawIndex = Number.parseInt(hostId.replace(`po-timer-${type}-`, ''), 10);
    return Number.isNaN(rawIndex) ? null : rawIndex;
  }

  private isDisplayIndexDisabled(type: PoTimerColumnType, displayIndex: number, displayArray: Array<number>): boolean {
    const value = displayArray[displayIndex];

    switch (type) {
      case 'hour':
        return this.isHourDisabled(value);
      case 'minute':
        return this.isMinuteDisabled(value);
      case 'second':
        return this.isSecondDisabled(value);
      default:
        return false;
    }
  }

  private getSelectedValue(type: PoTimerColumnType): number {
    switch (type) {
      case 'hour':
        return this.selectedHour;
      case 'minute':
        return this.selectedMinute;
      case 'second':
        return this.selectedSecond;
      default:
        return 0;
    }
  }

  private buildDisplayArrays(): void {
    this.displayHours = this.repeatArray(this.hours);
    this.displayMinutes = this.repeatArray(this.minutes);
    this.displaySeconds = this.repeatArray(this.seconds);
  }

  /** Reconstroi os caches de minutos e segundos desabilitados. */
  private rebuildDisabledCaches(): void {
    this.disabledMinuteCache = new Set(this.minutes.filter(m => this.isMinuteDisabled(m)));
    this.disabledSecondCache = new Set(this.seconds.filter(s => this.isSecondDisabled(s)));
  }

  private getFirstAvailableMinuteForCurrentHour(): number | null {
    const firstAvailableMinute = this.minutes.find(minute => !this.isMinuteDisabled(minute));
    return firstAvailableMinute ?? null;
  }

  private getFirstAvailableSecondForCurrentHourAndMinute(): number | null {
    const firstAvailableSecond = this.seconds.find(second => !this.isSecondDisabled(second));
    return firstAvailableSecond ?? null;
  }

  private realignColumnsToSelection(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.initAllColumnOffsets();
        });
      });
    });
  }

  private refreshRovingTabIndex(): void {
    this.changeDetector.markForCheck();
  }

  private repeatArray(source: Array<number>): Array<number> {
    return PoTimerScrollHelper.repeatArray(source);
  }

  private getSourceArray(type: PoTimerColumnType): Array<number> {
    switch (type) {
      case 'hour':
        return this.hours;
      case 'minute':
        return this.minutes;
      case 'second':
        return this.seconds;
      default:
        return this.hours;
    }
  }

  private getDisplayArray(type: PoTimerColumnType): Array<number> {
    switch (type) {
      case 'hour':
        return this.displayHours;
      case 'minute':
        return this.displayMinutes;
      case 'second':
        return this.displaySeconds;
      default:
        return [];
    }
  }
}
