import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

import { PoComboBaseComponent } from './po-combo-base.component';
import { PoComboFilterMode } from './po-combo-filter-mode.enum';
import { PoComboFilterService } from './po-combo-filter.service';
import { PoComboGroup } from './interfaces/po-combo-group.interface';
import { PoComboOption } from './interfaces/po-combo-option.interface';
import { PoComboOptionTemplateDirective } from './po-combo-option-template/po-combo-option-template.directive';

const poComboContainerOffset = 8;
const poComboContainerPositionDefault = 'bottom';

/**
 * @docsExtends PoComboBaseComponent
 *
 * @description
 * Utilizando po-combo com serviço, é possivel digitar um valor no campo de entrada e pressionar a tecla 'tab' para que o componente
 * faça uma requisição à URL informada passando o valor digitado no campo. Se encontrado o valor, então o mesmo será selecionado, caso
 * não seja encontrado, então a lista de itens voltará para o estado inicial.
 *
 * @example
 *
 * <example name="po-combo-basic" title="PO Combo Basic">
 *   <file name="sample-po-combo-basic/sample-po-combo-basic.component.html"> </file>
 *   <file name="sample-po-combo-basic/sample-po-combo-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-combo-labs" title="PO Combo Labs">
 *   <file name="sample-po-combo-labs/sample-po-combo-labs.component.html"> </file>
 *   <file name="sample-po-combo-labs/sample-po-combo-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-combo-scheduling" title="PO Combo - Scheduling">
 *   <file name="sample-po-combo-scheduling/sample-po-combo-scheduling.component.html"> </file>
 *   <file name="sample-po-combo-scheduling/sample-po-combo-scheduling.component.ts"> </file>
 *   <file name="sample-po-combo-scheduling/sample-po-combo-scheduling.service.ts"> </file>
 * </example>
 *
 * <example name="po-combo-transfer" title="PO Combo - Banking Transfer">
 *   <file name="sample-po-combo-transfer/sample-po-combo-transfer.component.html"> </file>
 *   <file name="sample-po-combo-transfer/sample-po-combo-transfer.component.ts"> </file>
 * </example>
 *
 * <example name="po-combo-heroes" title="PO Combo - Heroes">
 *   <file name="sample-po-combo-heroes/sample-po-combo-heroes.component.html"> </file>
 *   <file name="sample-po-combo-heroes/sample-po-combo-heroes.component.ts"> </file>
 * </example>
 *
 * <example name="po-combo-heroes-reactive-form" title="PO Combo - Heroes Reactive Form">
 *   <file name="sample-po-combo-heroes-reactive-form/sample-po-combo-heroes-reactive-form.component.html"> </file>
 *   <file name="sample-po-combo-heroes-reactive-form/sample-po-combo-heroes-reactive-form.component.ts"> </file>
 * </example>
 *
 * <example name="po-combo-hotels" title="PO Combo - Booking Hotel">
 *   <file name="sample-po-combo-hotels/sample-po-combo-hotels.component.html"> </file>
 *   <file name="sample-po-combo-hotels/sample-po-combo-hotels.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-combo',
  templateUrl: './po-combo.component.html',
  providers: [
    PoComboFilterService,
    PoControlPositionService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoComboComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoComboComponent),
      multi: true
    }
  ]
})
export class PoComboComponent extends PoComboBaseComponent implements AfterViewInit, OnChanges, OnDestroy {
  private _isServerSearching: boolean = false;

  comboIcon: string = 'po-icon-arrow-down';
  comboOpen: boolean = false;
  differ: any;
  isProcessingGetObjectByValue: boolean = false;
  scrollTop = 0;
  service: PoComboFilterService;
  shouldMarkLetters: boolean = true;

  private clickoutListener: () => void;
  private eventResizeListener: () => void;

  private filterSubscription: Subscription;
  private getSubscription: Subscription;

  @ContentChild(PoComboOptionTemplateDirective, { static: true }) comboOptionTemplate: PoComboOptionTemplateDirective;

  @ViewChild('containerElement', { read: ElementRef }) containerElement: ElementRef;
  @ViewChild('contentElement', { read: ElementRef }) contentElement: ElementRef;
  @ViewChild('iconArrow', { read: ElementRef, static: true }) iconElement: ElementRef;
  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;

  constructor(
    public element: ElementRef,
    public differs: IterableDiffers,
    public defaultService: PoComboFilterService,
    public renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private controlPosition: PoControlPositionService,
    private sanitized: DomSanitizer,
    languageService: PoLanguageService
  ) {
    super(languageService);

    this.differ = differs.find([]).create(null);
  }

  set isServerSearching(value: boolean) {
    if (value) {
      this._isServerSearching = value;

      this.changeDetector.detectChanges();

      this.setContainerPosition();
      this.initializeListeners();
    } else {
      this._isServerSearching = value;
    }
  }

  get isServerSearching() {
    return this._isServerSearching;
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.debounceTime) {
      this.unsubscribeKeyupObservable();
      this.initInputObservable();
    }

    if (changes.filterService) {
      this.configAfterSetFilterService(this.filterService);
    }
  }

  ngOnDestroy() {
    this.removeListeners();

    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }

    if (this.getSubscription) {
      this.getSubscription.unsubscribe();
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoComboComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoComboComponent, { static: true }) combo: PoComboComponent;
   *
   * focusCombo() {
   *   this.combo.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled) {
      this.inputEl.nativeElement.focus();
    }
  }

  onBlur() {
    this.onModelTouched?.();
  }

  onKeyDown(event?: any) {
    const key = event.keyCode;
    const inputValue = event.target.value;

    // busca um registro quando acionar o tab
    if (this.service && key === PoKeyCodeEnum.tab && inputValue) {
      this.controlComboVisibility(false);
      return this.getObjectByValue(inputValue);
    }

    // Teclas "up" e "down"
    if (key === PoKeyCodeEnum.arrowUp || key === PoKeyCodeEnum.arrowDown) {
      event.preventDefault();

      if (this.comboOpen) {
        if (key === PoKeyCodeEnum.arrowUp) {
          this.selectPreviousOption();
        } else {
          this.selectNextOption();
        }
      }

      this.controlComboVisibility(true);
      this.isFiltering = this.changeOnEnter ? this.isFiltering : false;
      this.shouldMarkLetters = this.changeOnEnter ? this.shouldMarkLetters : false;
      return;
    }

    // Teclas "tab" ou "esc"
    if (key === PoKeyCodeEnum.tab || key === PoKeyCodeEnum.esc) {
      if (key === PoKeyCodeEnum.esc && this.comboOpen) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.controlComboVisibility(false);
      this.verifyValidOption();

      if (!this.service) {
        // caso for changeOnEnter e nao ter selectedValue deve limpar o selectedView para reinicia-lo.
        this.selectedView = this.changeOnEnter && !this.selectedValue ? undefined : this.selectedView;

        this.updateComboList();
      }

      return;
    }

    // Tecla "enter"
    if (key === PoKeyCodeEnum.enter && this.selectedView && this.comboOpen) {
      const isUpdateModel = this.selectedView.value !== this.selectedValue || inputValue !== this.selectedView.label;

      this.controlComboVisibility(false);

      this.updateSelectedValue(this.selectedView, isUpdateModel);
      this.isFiltering = false;

      this.updateComboList();
      return;
    }

    if (key === PoKeyCodeEnum.enter) {
      this.controlComboVisibility(true);
    }
  }

  onKeyUp(event?: any) {
    const key = event.keyCode || event.which;
    const inputValue = event.target.value;

    const isValidKey = key !== PoKeyCodeEnum.arrowUp && key !== PoKeyCodeEnum.arrowDown && key !== PoKeyCodeEnum.enter;

    if (isValidKey) {
      if (inputValue) {
        if (!this.service && this.previousSearchValue !== inputValue) {
          this.shouldMarkLetters = true;
          this.isFiltering = true;
          this.searchForLabel(inputValue, this.comboOptionsList, this.filterMode);
        }
      } else {
        // quando apagar rapido o campo e conter serviço, valor, não disparava o keyup observable
        // necessario este tratamento para retornar a lista 'default'.
        const useDefaultOptionsService =
          this.service && this.selectedValue && this.selectedOption.label === this.previousSearchValue;

        this.updateSelectedValue(null);

        if (!this.service) {
          this.updateComboList();
        } else if (useDefaultOptionsService) {
          this.updateComboList([...this.cacheOptions]);
        }

        this.isFiltering = false;
      }

      // caso o valor pesquisado for diferente do anterior deve abrir o combo
      if (this.previousSearchValue !== inputValue) {
        this.changeDetector.detectChanges();

        this.controlComboVisibility(true);
      }
    }

    this.previousSearchValue = inputValue;
  }

  initInputObservable() {
    if (this.service) {
      const keyupObservable = fromEvent(this.inputEl.nativeElement, 'keyup').pipe(
        filter((e: any) => this.isValidCharacterToSearch(e.keyCode)),
        map((e: any) => e.currentTarget.value),
        distinctUntilChanged(),
        tap(() => {
          this.shouldMarkLetters = false;
        }),
        debounceTime(this.debounceTime)
      );

      this.keyupSubscribe = keyupObservable.subscribe(value => {
        if (value.length >= this.filterMinlength || !value) {
          this.controlApplyFilter(value);
        }
      });
    }
  }

  controlApplyFilter(value) {
    if (!this.isProcessingGetObjectByValue && (!this.selectedOption || value !== this.selectedOption.label)) {
      this.applyFilter(value);
    }
  }

  applyFilter(value: string) {
    this.controlComboVisibility(false);
    this.isServerSearching = true;

    const param = { property: this.fieldLabel, value };

    this.filterSubscription = this.service.getFilteredData(param, this.filterParams).subscribe(
      items => this.setOptionsByApplyFilter(value, items),
      error => this.onErrorFilteredData()
    );
  }

  setOptionsByApplyFilter(value, items) {
    this.shouldMarkLetters = true;
    this.isServerSearching = false;
    this.options = items;

    this.searchForLabel(value, items, this.filterMode);

    this.changeDetector.detectChanges();

    this.controlComboVisibility(true);

    if (this.isFirstFilter) {
      this.isFirstFilter = !this.isFirstFilter;

      this.cacheOptions = this.comboOptionsList;
    }
  }

  getObjectByValue(value) {
    if (this.selectedValue !== value && this.selectedOption?.label !== value) {
      this.isProcessingGetObjectByValue = true;

      this.getSubscription = this.service.getObjectByValue(value, this.filterParams).subscribe(
        item => this.updateOptionByFilteredValue(item),
        error => this.onErrorGetObjectByValue()
      );
    }
  }

  updateOptionByFilteredValue(item) {
    if (item) {
      this.options = [item];
      this.onOptionClick(item);
    } else {
      this.updateSelectedValue(null);
    }

    setTimeout(() => {
      this.isProcessingGetObjectByValue = false;
    }, this.debounceTime);
  }

  selectPreviousOption() {
    const currentViewValue = this.selectedView && this.selectedView.value;

    if (currentViewValue) {
      const nextOption = this.getNextOption(currentViewValue, this.visibleOptions, true);

      this.updateSelectedValue(nextOption, nextOption && nextOption.value !== currentViewValue && !this.changeOnEnter);
    } else if (this.visibleOptions.length) {
      const visibleOption = this.visibleOptions[this.visibleOptions.length - 1];

      this.updateSelectedValue(visibleOption, visibleOption.value !== currentViewValue && !this.changeOnEnter);
    }
  }

  selectNextOption() {
    const currentViewValue = this.selectedView && this.selectedView.value;

    if (currentViewValue) {
      const nextOption = this.getNextOption(currentViewValue, this.visibleOptions);

      this.updateSelectedValue(nextOption, nextOption && nextOption.value !== currentViewValue && !this.changeOnEnter);
    } else if (this.visibleOptions.length) {
      const index = this.changeOnEnter ? 1 : 0;

      const visibleOption = this.visibleOptions[index];

      this.updateSelectedValue(visibleOption, visibleOption.value !== currentViewValue && !this.changeOnEnter);
    }
  }

  toggleComboVisibility(): void {
    if (this.disabled) {
      return;
    }

    if (this.service && !this.disabledInitFilter) {
      this.applyFilterInFirstClick();
    }

    this.controlComboVisibility(!this.comboOpen);
  }

  applyFilterInFirstClick() {
    if (this.isFirstFilter && !this.selectedValue) {
      this.applyFilter('');
    }
  }

  controlComboVisibility(toOpen: boolean) {
    toOpen ? this.open() : this.close();
  }

  onOptionClick(option: PoComboOption | PoComboGroup, event?: any) {
    const inputValue = this.getInputValue();
    const isUpdateModel =
      option.value !== this.selectedValue || !!(this.selectedView && inputValue !== this.selectedView.label);

    if (event) {
      event.stopPropagation();
    }

    this.updateSelectedValue(option, isUpdateModel);
    this.controlComboVisibility(false);
    this.updateComboList([{ ...this.selectedView }]);

    this.previousSearchValue = this.selectedView.label;
  }

  scrollTo(index) {
    const selectedItem = this.element.nativeElement.querySelectorAll('.po-combo-item-selected');
    const scrollTop = !selectedItem.length || index <= 1 ? 0 : selectedItem[0].offsetTop - 88;

    this.setScrollTop(scrollTop);
  }

  getInputValue() {
    return this.inputEl.nativeElement.value;
  }

  setInputValue(value: string): void {
    this.inputEl.nativeElement.value = value;
  }

  wasClickedOnToggle(event: MouseEvent): void {
    if (
      this.comboOpen &&
      !this.inputEl.nativeElement.contains(event.target) &&
      !this.iconElement.nativeElement.contains(event.target) &&
      (!this.contentElement || !this.contentElement.nativeElement.contains(event.target))
    ) {
      // Esconde Content do Combo quando for clicado fora
      this.controlComboVisibility(false);

      this.verifyValidOption();

      // caso for changeOnEnter deve limpar o selectedView para reinicia-lo
      this.selectedView = this.changeOnEnter && !this.selectedValue ? undefined : this.selectedView;

      this.updateComboList();
    } else {
      if (this.service && !this.getInputValue() && !this.isFirstFilter) {
        this.applyFilter('');
      }
    }
  }

  getLabelFormatted(label: string): SafeHtml {
    const sanitizedLabel = this.sanitizeTagHTML(label);
    let format: string = sanitizedLabel;

    if (
      this.isFiltering ||
      (this.service &&
        this.getInputValue() &&
        !this.compareObjects(this.cacheOptions, this.visibleOptions) &&
        this.shouldMarkLetters)
    ) {
      const labelInput = this.sanitizeTagHTML(this.getInputValue().toString().toLowerCase());
      const labelLowerCase = sanitizedLabel.toLowerCase();

      const openTagBold = '<span class="po-font-text-large-bold">';
      const closeTagBold = '</span>';

      let startString;
      let middleString;
      let endString;

      switch (this.filterMode) {
        case PoComboFilterMode.startsWith:
        case PoComboFilterMode.contains:
          const indexOfLabelInput = labelLowerCase.indexOf(labelInput);

          if (indexOfLabelInput > -1) {
            startString = sanitizedLabel.substring(0, indexOfLabelInput);

            middleString = sanitizedLabel.substring(indexOfLabelInput, indexOfLabelInput + labelInput.length);
            endString = sanitizedLabel.substring(indexOfLabelInput + labelInput.length);

            format = startString + openTagBold + middleString + closeTagBold + endString;
          }

          break;
        case PoComboFilterMode.endsWith:
          const lastIndexOfLabelInput = labelLowerCase.lastIndexOf(labelInput);

          if (lastIndexOfLabelInput > -1) {
            startString = sanitizedLabel.substring(0, lastIndexOfLabelInput);
            middleString = sanitizedLabel.substring(lastIndexOfLabelInput);

            format = startString + openTagBold + middleString + closeTagBold;
          }
          break;
      }
    }

    return this.safeHtml(format);
  }

  safeHtml(value): SafeHtml {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

  isValidCharacterToSearch(keyCode) {
    return (
      keyCode !== 9 && // tab
      keyCode !== 13 && // entet
      keyCode !== 16 && // shift
      keyCode !== 17 && // ctrl
      keyCode !== 18 && // alt
      keyCode !== 20 && // capslock
      keyCode !== 27 && // esc
      keyCode !== 37 && // seta
      keyCode !== 38 && // seta
      keyCode !== 39 && // seta
      keyCode !== 40 && // seta
      keyCode !== 93
    ); // windows menu
  }

  searchOnEnter(value: string) {
    if (this.service && !this.selectedView && value.length >= this.filterMinlength) {
      this.controlApplyFilter(value);
    }
  }

  private adjustContainerPosition() {
    this.controlPosition.adjustPosition(poComboContainerPositionDefault);
  }

  private close() {
    this.comboOpen = false;

    this.changeDetector.detectChanges();

    this.comboIcon = 'po-icon-arrow-down';

    this.removeListeners();

    this.isFiltering = false;
  }

  private initializeListeners() {
    this.removeListeners();

    this.clickoutListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.wasClickedOnToggle(event);
    });

    this.eventResizeListener = this.renderer.listen('window', 'resize', () => {
      // timeout necessario pois a animação do po-menu impacta no ajuste da posição do container.
      setTimeout(() => this.adjustContainerPosition(), 250);
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  private onErrorGetObjectByValue() {
    this.updateOptionByFilteredValue(null);
  }

  private onErrorFilteredData() {
    this.isServerSearching = false;

    this.updateComboList([]);

    this.controlComboVisibility(true);
  }

  private onScroll = (): void => {
    this.adjustContainerPosition();
  };

  private open() {
    this.comboOpen = true;

    this.changeDetector.detectChanges();

    this.comboIcon = 'po-icon-arrow-up';

    this.initializeListeners();

    this.inputEl.nativeElement.focus();
    this.scrollTo(this.getIndexSelectedView());

    this.setContainerPosition();
  }

  private removeListeners() {
    if (this.clickoutListener) {
      this.clickoutListener();
    }

    if (this.eventResizeListener) {
      this.eventResizeListener();
    }

    window.removeEventListener('scroll', this.onScroll, true);
  }

  private sanitizeTagHTML(value: string = '') {
    return value.replace(/\</gm, '&lt;').replace(/\>/g, '&gt;');
  }

  private setContainerPosition() {
    this.controlPosition.setElements(
      this.containerElement.nativeElement,
      poComboContainerOffset,
      this.inputEl,
      ['top', 'bottom'],
      true
    );

    this.adjustContainerPosition();
  }

  private setScrollTop(scrollTop: number) {
    if (this.contentElement) {
      this.contentElement.nativeElement.scrollTop = scrollTop;
    }
  }
}
