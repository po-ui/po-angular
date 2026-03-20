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
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  inject
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoTimerBaseComponent } from './po-timer-base.component';

/** Numero minimo de repeticoes do array para o infinity scroll. */
const INFINITY_SCROLL_MIN_REPEAT = 3;

/** Numero minimo de itens totais para o infinity scroll funcionar corretamente. */
const INFINITY_SCROLL_MIN_ITEMS = 30;

/** Tipo dos eixos das colunas. */
type PoTimerColumnType = 'hour' | 'minute' | 'second' | 'period';

/**
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
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  /** Refs dos botoes de cada coluna para gerenciamento de foco programatico. */
  @ViewChildren('hourCell', { read: ElementRef }) hourCells: QueryList<ElementRef>;
  @ViewChildren('minuteCell', { read: ElementRef }) minuteCells: QueryList<ElementRef>;
  @ViewChildren('secondCell', { read: ElementRef }) secondCells: QueryList<ElementRef>;
  @ViewChildren('periodCell', { read: ElementRef }) periodCells: QueryList<ElementRef>;

  /** Containers de recorte (clipping) de cada coluna. */
  @ViewChildren('hourItems', { read: ElementRef }) hourItemsRefs: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('minuteItems', { read: ElementRef }) minuteItemsRefs: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('secondItems', { read: ElementRef }) secondItemsRefs: QueryList<ElementRef<HTMLElement>>;

  /** Arrays repetidos para o infinity scroll. */
  displayHours: Array<number> = [];
  displayMinutes: Array<number> = [];
  displaySeconds: Array<number> = [];

  /** Emite quando Tab/Shift+Tab atinge a borda do componente. */
  @Output('p-boundary-tab') boundaryTab = new EventEmitter<{
    direction: 'forward' | 'backward';
    event: KeyboardEvent;
    column: PoTimerColumnType;
  }>();

  private changeDetector = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private hasViewInitialized = false;
  private currentRenderedSize: string;

  /**
   * Offset atual (em px) de cada coluna, mantido em JS.
   * O container de itens e posicionado via translateY(-offset).
   * O offset e mantido sempre no intervalo [sectionHeight, 2*sectionHeight)
   * para que o salto de reposicionamento seja sempre invisivel (as secoes
   * sao identicas por serem copias do mesmo array fonte).
   */
  private columnOffsets: Record<PoTimerColumnType, number> = { hour: 0, minute: 0, second: 0, period: 0 };

  /**
   * Indice no displayArray do item visivel no topo de cada coluna.
   * Usado para redirecionar o foco ao botao correto ao entrar na coluna via Tab.
   */
  private focusedDisplayIndex: Record<PoTimerColumnType, number> = { hour: 0, minute: 0, second: 0, period: 0 };

  /**
   * IDs dos itens ativos em cada coluna para aria-activedescendant.
   * Aponta para o item do displayArray que esta no topo da janela visivel
   * (indice calculado a partir do offset atual).
   */
  activeDescendantIds: Record<PoTimerColumnType, string> = { hour: '', minute: '', second: '', period: '' };

  constructor() {
    const languageService = inject(PoLanguageService);
    super(languageService);
  }

  ngOnInit(): void {
    this.generateHours();
    this.generateMinutes();
    this.generateSeconds();
    this.buildDisplayArrays();
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
      this.realignColumnsToSelection();
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // Required by OnDestroy interface - cleanup handled by base class.
  }

  /** Seleciona uma hora. */
  onSelectHour(hour: number): void {
    if (this.isHourDisabled(hour)) {
      return;
    }

    this.selectedHour = hour;

    if (this.selectedMinute != null && this.isMinuteDisabled(this.selectedMinute)) {
      this.selectedMinute = this.getFirstAvailableMinuteForCurrentHour();
    }

    if (
      this.showSeconds &&
      this.selectedMinute != null &&
      this.selectedSecond != null &&
      this.isSecondDisabled(this.selectedSecond)
    ) {
      this.selectedSecond = this.getFirstAvailableSecondForCurrentHourAndMinute();
    }

    this.emitChange();
    this.callOnTouched();
    this.changeDetector.markForCheck();
  }

  /** Seleciona um minuto. */
  onSelectMinute(minute: number): void {
    if (this.isMinuteDisabled(minute)) {
      return;
    }

    this.selectedMinute = minute;

    if (this.showSeconds && this.selectedSecond != null && this.isSecondDisabled(this.selectedSecond)) {
      this.selectedSecond = this.getFirstAvailableSecondForCurrentHourAndMinute();
    }

    this.emitChange();
    this.callOnTouched();
    this.changeDetector.markForCheck();
  }

  /** Seleciona um segundo. */
  onSelectSecond(second: number): void {
    if (this.isSecondDisabled(second)) {
      return;
    }

    this.selectedSecond = second;
    this.emitChange();
    this.callOnTouched();
    this.changeDetector.markForCheck();
  }

  /** Alterna o periodo AM/PM. */
  onSelectPeriod(newPeriod: string): void {
    this.period = newPeriod;
    this.focusedDisplayIndex['period'] = newPeriod === 'AM' ? 0 : 1;
    this.focusButtonAt('period', this.focusedDisplayIndex['period']);
    this.emitChange();
    this.callOnTouched();
    this.changeDetector.markForCheck();
  }

  onCellFocus(type: PoTimerColumnType, displayIndex: number): void {
    this.focusedDisplayIndex[type] = displayIndex;
    this.normalizeFocusedIndex(type);
  }

  onCellClick(type: PoTimerColumnType, displayIndex: number): void {
    this.focusedDisplayIndex[type] = displayIndex;
    this.normalizeFocusedIndex(type);
  }

  getCellTabIndex(type: PoTimerColumnType, displayIndex: number): number {
    const normalizedIndex = this.getNormalizedFocusedIndex(type);
    return normalizedIndex === displayIndex ? 0 : -1;
  }

  /**
   * Trata navegacao via teclado na coluna focada.
   * ArrowUp/Down rolam a coluna um item e movem o foco; Enter/Space selecionam o item visivel no topo.
   * Tab/Shift+Tab movem o foco para a proxima/anterior coluna visivel,
   * ou deixam o browser mover o foco naturalmente ao sair do componente.
   */
  onCellKeydown(event: KeyboardEvent, type: PoTimerColumnType): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.scrollColumnByStep(type, -1);
        this.focusActiveButton(type);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.scrollColumnByStep(type, 1);
        this.focusActiveButton(type);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTopVisibleItem(type);
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

  /** Trata navegacao via teclado na coluna AM/PM. */
  onPeriodKeydown(event: KeyboardEvent, currentPeriod: string): void {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        this.onSelectPeriod(currentPeriod === 'AM' ? 'PM' : 'AM');
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.onSelectPeriod(currentPeriod);
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

  /**
   * Trata o scroll da roda do mouse nas colunas.
   *
   * A posicao e controlada por JS via translateY, sem qualquer interacao
   * com o scrollTop do browser. Isso garante que cada evento wheel avanca
   * exatamente um passo e que o wrap e aplicado de forma sincrona e atomica,
   * sem risco de acumulo de eventos asincronos.
   */
  onColumnWheel(event: WheelEvent, type: PoTimerColumnType): void {
    event.preventDefault();

    this.ngZone.runOutsideAngular(() => {
      this.scrollColumnByStep(type, event.deltaY > 0 ? 1 : -1);
    });
  }

  /** Define o horario a partir de um valor externo. */
  writeValue(time: string): void {
    super.writeValue(time);
    this.changeDetector.markForCheck();

    // Reposicionar as colunas para o valor selecionado apos a proxima renderizacao.
    requestAnimationFrame(() => {
      this.ngZone.runOutsideAngular(() => {
        this.initAllColumnOffsets();
      });
    });
  }

  /** Track function para o @for do infinity scroll. */
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

  // ---------------------------------------------------------------------------
  // Inicializacao e logica central do infinity scroll
  // ---------------------------------------------------------------------------

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

    // Determinar o indice do valor selecionado no array fonte para alinhar a visao.
    const selectedValue = this.getSelectedValue(type);
    const selectedIndex = sourceArray.indexOf(selectedValue);
    const selectedValueIsValid =
      selectedIndex >= 0 && selectedValue != null && !this.isValueDisabledByType(type, sourceArray[selectedIndex]);
    const alignIndex = selectedValueIsValid ? selectedIndex : this.getFirstAvailableIndexByType(type, sourceArray);

    // offset = inicio da secao do meio + posicao do item selecionado.
    const offset = sectionHeight + alignIndex * step;
    this.columnOffsets[type] = offset;
    itemsEl.style.transform = `translateY(${-offset}px)`;
    this.updateActiveDescendant(type, offset, step, sourceArray.length);
    this.focusedDisplayIndex[type] = this.computeTopDisplayIndex(offset, step, displayArray.length);
    this.normalizeFocusedIndex(type);
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
        const originalSelectedHour = this.selectedHour;
        const referenceHour = this.getReferenceHourForConstraints();

        if (referenceHour != null) {
          this.selectedHour = referenceHour;
        }

        const index = sourceArray.findIndex(minute => !this.isMinuteDisabled(minute));

        this.selectedHour = originalSelectedHour;

        return index >= 0 ? index : 0;
      }

      case 'second': {
        const originalSelectedHour = this.selectedHour;
        const originalSelectedMinute = this.selectedMinute;
        const referenceHour = this.getReferenceHourForConstraints();

        if (referenceHour != null) {
          this.selectedHour = referenceHour;
        }

        const referenceMinute = this.getReferenceMinuteForConstraints();
        if (referenceMinute != null) {
          this.selectedMinute = referenceMinute;
        }

        const index = sourceArray.findIndex(second => !this.isSecondDisabled(second));

        this.selectedHour = originalSelectedHour;
        this.selectedMinute = originalSelectedMinute;

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

  private getReferenceMinuteForConstraints(): number | null {
    if (this.selectedMinute != null && !this.isMinuteDisabled(this.selectedMinute)) {
      return this.selectedMinute;
    }

    const index = this.minutes.findIndex(minute => !this.isMinuteDisabled(minute));
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
  private scrollColumnByStep(type: PoTimerColumnType, steps: number): void {
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

    const rawOffset = this.columnOffsets[type] + steps * step;
    const wrappedOffset = this.wrapOffset(rawOffset, sectionHeight);

    this.columnOffsets[type] = wrappedOffset;
    itemsEl.style.transform = `translateY(${-wrappedOffset}px)`;
    this.updateActiveDescendant(type, wrappedOffset, step, sourceArray.length);
    this.focusedDisplayIndex[type] = this.computeTopDisplayIndex(wrappedOffset, step, displayArray.length);
    this.normalizeFocusedIndex(type);
  }

  /**
   * Normaliza o offset para o intervalo [sectionHeight, 2 * sectionHeight).
   *
   * Matematica:
   *   mod = ((offset - sH) % sH + sH) % sH  →  resultado em [0, sH)
   *   retorno = mod + sH                     →  resultado em [sH, 2*sH)
   *
   * Funciona para qualquer valor de offset (positivo, negativo, multiplos).
   */
  private wrapOffset(offset: number, sectionHeight: number): number {
    if (sectionHeight <= 0) {
      return offset;
    }
    const mod = (((offset - sectionHeight) % sectionHeight) + sectionHeight) % sectionHeight;
    return mod + sectionHeight;
  }

  /**
   * Calcula o passo (em px) por item, incluindo o gap entre itens.
   *
   * Para N itens num flex-column com altura H, gap G e padding P:
   *   scrollHeight = N*H + (N-1)*G + 2*P
   *   passo = H + G = (scrollHeight - 2*P + G) / N
   */
  private getCellStep(itemsEl: HTMLElement, displayCount: number): number {
    if (!itemsEl || displayCount === 0) {
      return 40;
    }
    const style = getComputedStyle(itemsEl);
    const gap = parseFloat(style.rowGap) || 0;
    const paddingTop = parseFloat(style.paddingTop) || 0;
    const paddingBottom = parseFloat(style.paddingBottom) || 0;
    return (itemsEl.scrollHeight - paddingTop - paddingBottom + gap) / displayCount;
  }

  // ---------------------------------------------------------------------------
  // Helpers de acesso a elementos e arrays
  // ---------------------------------------------------------------------------

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

    const startIndex = ((displayIndex % arr.length) + arr.length) % arr.length;

    for (let offset = 0; offset < arr.length; offset++) {
      const index = (startIndex + offset) % arr.length;
      const nativeButton = arr[index]?.nativeElement?.querySelector('button') as HTMLButtonElement | null;

      if (!nativeButton || nativeButton.disabled || nativeButton.getAttribute('aria-disabled') === 'true') {
        continue;
      }

      this.focusedDisplayIndex[type] = index;
      nativeButton.focus();
      return;
    }
  }

  private focusActiveButton(type: PoTimerColumnType): void {
    this.normalizeFocusedIndex(type);
    this.focusButtonAt(type, this.focusedDisplayIndex[type]);
  }

  /**
   * Calcula o indice no displayArray do item visivel no topo a partir do offset.
   * Usa Math.round para snap ao item mais proximo.
   */
  private computeTopDisplayIndex(offset: number, step: number, displayLength: number): number {
    if (step <= 0 || displayLength === 0) {
      return 0;
    }
    const raw = Math.round(offset / step);
    return ((raw % displayLength) + displayLength) % displayLength;
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

  /**
   * Atualiza aria-activedescendant para o item visivel no topo.
   * O indice no displayArray e: floor(offset / step) % sourceLength,
   * pois as secoes sao repetidas e o id e baseado no indice do displayArray.
   */
  private updateActiveDescendant(type: PoTimerColumnType, offset: number, step: number, sourceLength: number): void {
    if (step <= 0 || sourceLength <= 0) {
      return;
    }
    const displayIndex = Math.round(offset / step) % (sourceLength * this.getRepeatMultiplier(type));
    this.activeDescendantIds[type] = `po-timer-${type}-${displayIndex}`;
  }

  /**
   * Seleciona o item que esta no topo da janela visivel (posicao do offset atual).
   * "Topo" aqui significa o primeiro item da secao do meio apontado pelo offset.
   */
  private selectTopVisibleItem(type: PoTimerColumnType): void {
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
    if (step <= 0) {
      return;
    }

    const displayIndex = Math.round(this.columnOffsets[type] / step) % displayArray.length;
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
    }
  }

  private getRepeatMultiplier(type: PoTimerColumnType): number {
    const sourceArray = this.getSourceArray(type);
    if (!sourceArray || sourceArray.length === 0) {
      return INFINITY_SCROLL_MIN_REPEAT;
    }
    return Math.max(INFINITY_SCROLL_MIN_REPEAT, Math.ceil(INFINITY_SCROLL_MIN_ITEMS / sourceArray.length));
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
        this.initAllColumnOffsets();
      });
    });
  }

  private refreshRovingTabIndex(): void {
    this.ngZone.run(() => {
      this.changeDetector.detectChanges();
    });
  }

  private repeatArray(source: Array<number>): Array<number> {
    if (!source || source.length === 0) {
      return [];
    }

    const repeats = Math.max(INFINITY_SCROLL_MIN_REPEAT, Math.ceil(INFINITY_SCROLL_MIN_ITEMS / source.length));

    const result: Array<number> = [];
    for (let i = 0; i < repeats; i++) {
      result.push(...source);
    }
    return result;
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
        return this.displayHours;
    }
  }
}
