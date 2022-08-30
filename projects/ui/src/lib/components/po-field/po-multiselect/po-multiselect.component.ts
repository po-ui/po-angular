import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  forwardRef,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { isMobile } from './../../../utils/util';
import { PoControlPositionService } from './../../../services/po-control-position/po-control-position.service';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';
import { PoLanguageService } from '../../../services/po-language/po-language.service';

import { PoMultiselectBaseComponent } from './po-multiselect-base.component';
import { PoMultiselectOption } from './po-multiselect-option.interface';
import { PoMultiselectFilterService } from './po-multiselect-filter.service';

const poMultiselectContainerOffset = 8;
const poMultiselectContainerPositionDefault = 'bottom';

/* istanbul ignore next */
const providers = [
  PoMultiselectFilterService,
  PoControlPositionService,
  {
    provide: NG_VALUE_ACCESSOR,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoMultiselectComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoMultiselectComponent),
    multi: true
  }
];

/**
 * @docsExtends PoMultiselectBaseComponent
 *
 * @example
 *
 * <example name="po-multiselect-basic" title="PO Multiselect Basic">
 *   <file name="sample-po-multiselect-basic/sample-po-multiselect-basic.component.html"> </file>
 *   <file name="sample-po-multiselect-basic/sample-po-multiselect-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-multiselect-labs" title="PO Multiselect Labs">
 *   <file name="sample-po-multiselect-labs/sample-po-multiselect-labs.component.html"> </file>
 *   <file name="sample-po-multiselect-labs/sample-po-multiselect-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-multiselect-vacation" title="PO Multiselect - Vacation">
 *   <file name="sample-po-multiselect-vacation/sample-po-multiselect-vacation.component.html"> </file>
 *   <file name="sample-po-multiselect-vacation/sample-po-multiselect-vacation.component.ts"> </file>
 * </example>
 *
 * <example name="po-multiselect-vacation-reactive-form" title="PO Multiselect - Vacation Reactive Form">
 *   <file name="sample-po-multiselect-vacation-reactive-form/sample-po-multiselect-vacation-reactive-form.component.html"> </file>
 *   <file name="sample-po-multiselect-vacation-reactive-form/sample-po-multiselect-vacation-reactive-form.component.ts"> </file>
 * </example>
 *
 * <example name="po-multiselect-heroes" title="PO Multiselect - Heroes - using API">
 *   <file name="sample-po-multiselect-heroes/sample-po-multiselect-heroes.component.html"> </file>
 *   <file name="sample-po-multiselect-heroes/sample-po-multiselect-heroes.component.ts"> </file>
 *   <file name="sample-po-multiselect-heroes/sample-po-multiselect-heroes.service.ts"> </file>
 * </example>
 *
 * <example name="po-multiselect-any-array" title="PO Multiselect - Array Any">
 *   <file name="sample-po-multiselect-any-array/sample-po-multiselect-any-array.component.html"> </file>
 *   <file name="sample-po-multiselect-any-array/sample-po-multiselect-any-array.component.ts"> </file>
 * </example>
 *
 */
@Component({
  selector: 'po-multiselect',
  templateUrl: './po-multiselect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers
})
export class PoMultiselectComponent
  extends PoMultiselectBaseComponent
  implements AfterViewInit, DoCheck, OnDestroy, OnChanges {
  @ViewChild('dropdownElement', { read: ElementRef, static: true }) dropdownElement: ElementRef;
  @ViewChild('dropdownElement', { static: true }) dropdown;
  @ViewChild('iconElement', { read: ElementRef, static: true }) iconElement: ElementRef;
  @ViewChild('inputElement', { read: ElementRef, static: true }) inputElement: ElementRef;

  disclaimerOffset = 0;
  dropdownIcon: string = 'po-icon-arrow-down';
  dropdownOpen: boolean = false;
  initialized = false;
  positionDisclaimerExtra;
  timeoutResize;
  visibleElement = false;

  private isCalculateVisibleItems: boolean = true;
  private cacheOptions: Array<PoMultiselectOption | any>;

  constructor(
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private el: ElementRef,
    private controlPosition: PoControlPositionService,
    public defaultService: PoMultiselectFilterService,
    languageService: PoLanguageService
  ) {
    super(languageService);
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.filterService && (changes.filterService || changes.fieldValue || changes.fieldLabel)) {
      this.setService(this.filterService);
    }
  }

  ngDoCheck() {
    const inputWidth = this.inputElement.nativeElement.offsetWidth;
    // Permite que os disclaimers sejam calculados na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    if ((inputWidth && !this.visibleElement && this.initialized) || (inputWidth && this.isCalculateVisibleItems)) {
      this.debounceResize();
      this.visibleElement = true;
    }
  }

  ngOnDestroy() {
    this.removeListeners();
    this.getObjectsByValuesSubscription?.unsubscribe();
    this.filterSubject?.unsubscribe();
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoMultiselectComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoMultiselectComponent, { static: true }) multiselect: PoMultiselectComponent;
   *
   * focusMultiselect() {
   *   this.multiselect.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled) {
      this.inputElement.nativeElement.focus();
    }
  }

  getInputWidth() {
    return this.el.nativeElement.querySelector('.po-input').offsetWidth - 40;
  }

  getDisclaimersWidth() {
    const disclaimers = this.el.nativeElement.querySelectorAll('po-disclaimer');
    return Array.from(disclaimers).map(disclaimer => disclaimer['offsetWidth']);
  }

  calculateVisibleItems() {
    const disclaimersWidth = this.getDisclaimersWidth();
    const inputWidth = this.getInputWidth();
    const extraDisclaimerSize = 38;
    const disclaimersVisible = disclaimersWidth[0];

    this.visibleDisclaimers = [];

    if (inputWidth > 0) {
      let sum = 0;
      let i = 0;
      for (i = 0; i < this.selectedOptions.length; i++) {
        sum += disclaimersWidth[i];
        this.visibleDisclaimers.push(this.selectedOptions[i]);

        if (sum > inputWidth) {
          sum -= disclaimersWidth[i];
          this.isCalculateVisibleItems = false;
          break;
        }
      }

      if (disclaimersVisible || !this.selectedOptions.length) {
        if (i === this.selectedOptions.length) {
          this.isCalculateVisibleItems = false;
          return;
        }

        if (sum + extraDisclaimerSize > inputWidth) {
          this.visibleDisclaimers.splice(-2, 2);
          const label = '+' + (this.selectedOptions.length + 1 - i).toString();
          this.visibleDisclaimers.push({ [this.fieldValue]: '', [this.fieldLabel]: label });
        } else {
          this.visibleDisclaimers.splice(-1, 1);
          const label = '+' + (this.selectedOptions.length - i).toString();
          this.visibleDisclaimers.push({ [this.fieldValue]: '', [this.fieldLabel]: label });
        }
      }
    }
    this.changeDetector.markForCheck();
  }

  changeItems(changedItems) {
    this.updateSelectedOptions(changedItems);
    this.callOnChange(this.selectedOptions);

    if (this.autoHeight && this.dropdownOpen) {
      this.changeDetector.detectChanges();
      this.adjustContainerPosition();
    }
  }

  updateVisibleItems() {
    if (this.selectedOptions) {
      this.visibleDisclaimers = [].concat(this.selectedOptions);
    }

    this.debounceResize();

    // quando estiver dentro de modal
    if (!this.inputElement.nativeElement.offsetWidth) {
      this.isCalculateVisibleItems = true;
    }
  }

  debounceResize() {
    if (!this.autoHeight) {
      clearTimeout(this.timeoutResize);
      this.timeoutResize = setTimeout(() => {
        this.calculateVisibleItems();
      }, 200);
    }
    this.changeDetector.markForCheck();
  }

  onBlur() {
    this.onModelTouched?.();
  }

  onKeyDown(event?: any) {
    if (event.keyCode === PoKeyCodeEnum.arrowUp || event.keyCode === PoKeyCodeEnum.arrowDown) {
      event.preventDefault();
      this.controlDropdownVisibility(true);
      return;
    }

    if (event.keyCode === PoKeyCodeEnum.tab) {
      this.controlDropdownVisibility(false);
    }
  }

  toggleDropdownVisibility() {
    if (this.disabled) {
      return;
    }

    if (this.filterService) {
      this.applyFilterInFirstClick();
    }

    this.controlDropdownVisibility(!this.dropdownOpen);
  }

  openDropdown(toOpen) {
    if (toOpen && !this.disabled) {
      this.controlDropdownVisibility(true);
    }
  }

  controlDropdownVisibility(toOpen: boolean) {
    toOpen ? this.open() : this.close();
  }

  scrollToSelectedOptions() {
    if (this.selectedOptions && this.selectedOptions.length) {
      const index = this.options.findIndex(
        option => option[this.fieldValue] === this.selectedOptions[0][this.fieldValue]
      );
      this.dropdown.scrollTo(index);
    }
  }

  setVisibleOptionsDropdown(options) {
    this.visibleOptionsDropdown = options;
    this.changeDetector.markForCheck();
  }

  changeSearch(event) {
    if (event && event[this.fieldValue] !== undefined) {
      if (this.filterService) {
        this.filterSubject.next(event[this.fieldValue]);
      } else {
        this.searchByLabel(event[this.fieldValue], this.options, this.filterMode);
      }
    } else {
      this.setVisibleOptionsDropdown(this.options);
    }

    // timeout necessário para reposicionar corretamente quando dropdown estiver pra cima do input e realizar busca no input
    setTimeout(() => this.adjustContainerPosition());
  }

  closeDisclaimer(value) {
    const index = this.selectedOptions.findIndex(option => option[this.fieldValue] === value);
    this.selectedOptions.splice(index, 1);

    this.updateVisibleItems();
    this.callOnChange(this.selectedOptions);
  }

  wasClickedOnToggle(event: MouseEvent): void {
    if (
      this.dropdownOpen &&
      !this.inputElement.nativeElement.contains(event.target) &&
      !this.iconElement.nativeElement.contains(event.target) &&
      !this.dropdownElement.nativeElement.contains(event.target)
    ) {
      this.controlDropdownVisibility(false);
    }
  }

  applyFilter(value: string = ''): Observable<Array<PoMultiselectOption | any>> {
    const param = { property: this.fieldLabel, value: value };
    return this.service.getFilteredData(param).pipe(
      catchError(err => {
        this.isServerSearching = false;
        return of([]);
      }),
      tap((options: Array<PoMultiselectOption | any>) => {
        this.setOptionsByApplyFilter(options);
      })
    );
  }

  private applyFilterInFirstClick() {
    if (this.isFirstFilter) {
      this.isServerSearching = true;

      // necessario enviar um objeto string vazia para refazer a busca, quando alterar filterService, fieldValue e fieldLabel
      // pois temos o distinctUntilChange no pipe do filterSubject
      /* eslint-disable no-new-wrappers */
      this.filterSubject.next(new String());
    } else {
      this.options = [...this.cacheOptions];
    }
  }

  private setOptionsByApplyFilter(items: Array<PoMultiselectOption | any>) {
    if (this.isFirstFilter) {
      this.cacheOptions = [...items];
      this.isFirstFilter = false;
    }

    this.options = [...items];
    this.setVisibleOptionsDropdown(this.options);
  }

  private adjustContainerPosition(): void {
    this.controlPosition.adjustPosition(poMultiselectContainerPositionDefault);
  }

  private close(): void {
    this.dropdownIcon = 'po-icon-arrow-down';
    this.dropdownOpen = false;

    this.dropdown.controlVisibility(false);
    this.setVisibleOptionsDropdown(this.options);

    this.removeListeners();
  }

  private initializeListeners(): void {
    this.clickOutListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.wasClickedOnToggle(event);
    });

    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.updateVisibleItems();

      isMobile() ? this.adjustContainerPosition() : this.close();
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  private onScroll = (): void => {
    this.adjustContainerPosition();
  };

  private open(): void {
    this.dropdownIcon = 'po-icon-arrow-up';
    this.dropdownOpen = true;

    this.dropdown.controlVisibility(true);
    this.setVisibleOptionsDropdown(this.options);
    this.initializeListeners();
    this.scrollToSelectedOptions();

    this.changeDetector.detectChanges();
    this.setPositionDropdown();
  }

  private removeListeners(): void {
    if (this.clickOutListener) {
      this.clickOutListener();
    }

    if (this.resizeListener) {
      this.resizeListener();
    }

    window.removeEventListener('scroll', this.onScroll, true);
    this.changeDetector.markForCheck();
  }

  private setPositionDropdown(): void {
    this.controlPosition.setElements(
      this.dropdown.container.nativeElement,
      poMultiselectContainerOffset,
      this.inputElement,
      ['top', 'bottom'],
      true
    );

    this.adjustContainerPosition();
  }
}
