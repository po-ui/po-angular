import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild,
  forwardRef
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable, Subscription, fromEvent, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';
import { PoControlPositionService } from './../../../services/po-control-position/po-control-position.service';
import { isMobile } from './../../../utils/util';

import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
import { PoMultiselectBaseComponent } from './po-multiselect-base.component';
import { PoMultiselectFilterService } from './po-multiselect-filter.service';
import { PoMultiselectOptionTemplateDirective } from './po-multiselect-option-template/po-multiselect-option-template.directive';
import { PoMultiselectOption } from './po-multiselect-option.interface';

const poMultiselectContainerOffset = 8;
const poMultiselectContainerPositionDefault = 'bottom';
const poMultiselectInputPaddingRight = 52;
const poMultiselectSpaceBetweenTags = 8;

const literalsTagRemoveOthers = {
  pt: {
    remove: 'Remover todos os itens selecionados'
  },
  ru: {
    remove: 'Удалить все выбранные элементы'
  },
  es: {
    remove: 'Eliminar todos los elementos seleccionados'
  },
  en: {
    remove: 'Clear all selected items'
  }
};

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
 * <example name="po-multiselect-template" title="PO Multiselect - Template">
 *   <file name="sample-po-multiselect-template/sample-po-multiselect-template.component.html"> </file>
 *   <file name="sample-po-multiselect-template/sample-po-multiselect-template.component.ts"> </file>
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
  @ContentChild(PoMultiselectOptionTemplateDirective, { static: true })
  multiselectOptionTemplate: PoMultiselectOptionTemplateDirective;

  @ViewChild('dropdownElement', { read: ElementRef }) dropdownElement: ElementRef;
  @ViewChild('dropdownElement') dropdown;
  @ViewChild('iconElement', { read: ElementRef, static: true }) iconElement: ElementRef;
  @ViewChild('inputElement', { read: ElementRef, static: true }) inputElement: ElementRef;

  literalsTag;
  dropdownIcon: string = 'po-icon-arrow-down';
  dropdownOpen: boolean = false;
  initialized = false;
  hasMoreTag: boolean;
  timeoutResize;
  visibleElement = false;
  private subscription: Subscription = new Subscription();
  private enterCloseTag = false;
  private initCalculateItems = true;
  private isCalculateVisibleItems: boolean = true;
  private cacheOptions: Array<PoMultiselectOption | any>;
  private focusOnTag = false;

  constructor(
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private el: ElementRef,
    private controlPosition: PoControlPositionService,
    public defaultService: PoMultiselectFilterService,
    languageService: PoLanguageService
  ) {
    super(languageService);
    const language = languageService.getShortLanguage();
    this.literalsTag = {
      ...literalsTagRemoveOthers[poLocaleDefault],
      ...literalsTagRemoveOthers[language]
    };
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
    // Permite que as tags sejam calculadas na primeira vez que o componente torna-se visível,
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
    this.subscription.unsubscribe();
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
    return this.el.nativeElement.querySelector('.po-multiselect-input').offsetWidth - poMultiselectInputPaddingRight;
  }

  getTagsWidth() {
    const tags = this.el.nativeElement.querySelectorAll('po-tag');
    return Array.from(tags).map(tag => tag['offsetWidth']);
  }

  calculateVisibleItems() {
    this.hasMoreTag = false;
    const tagsWidth = this.getTagsWidth();
    const inputWidth = this.getInputWidth();
    const extraTagSize = 63;
    const tagsVisible = tagsWidth[0];

    this.visibleTags = [];

    if (inputWidth > 0) {
      let sum = 0;
      let i = 0;
      for (i = 0; i < this.selectedOptions.length; i++) {
        sum += tagsWidth[i] + poMultiselectSpaceBetweenTags;
        this.visibleTags.push(this.selectedOptions[i]);

        if (sum > inputWidth) {
          sum -= tagsWidth[i];
          this.isCalculateVisibleItems = false;
          break;
        }
      }

      if (tagsVisible || !this.selectedOptions.length) {
        if (i === this.selectedOptions.length) {
          this.isCalculateVisibleItems = false;
          return;
        }

        this.hasMoreTag = true;
        if (sum + extraTagSize > inputWidth) {
          this.visibleTags.splice(-2, 2);
          const label = '+' + (this.selectedOptions.length + 1 - i).toString();
          this.visibleTags.push({ [this.fieldValue]: '', [this.fieldLabel]: label });
        } else {
          this.visibleTags.splice(-1, 1);
          const label = '+' + (this.selectedOptions.length - i).toString();
          this.visibleTags.push({ [this.fieldValue]: '', [this.fieldLabel]: label });
        }
      }
      if (this.initCalculateItems) {
        setTimeout(() => {
          this.handleKeyboardNavigationTag();
        }, 300);
      }
      this.initCalculateItems = false;
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
    setTimeout(() => {
      this.handleKeyboardNavigationTag();
    }, 300);
  }

  updateVisibleItems() {
    if (this.selectedOptions) {
      this.visibleTags = [].concat(this.selectedOptions);
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
    if (
      typeof this.inputElement.nativeElement.getAttribute('aria-label') === 'string' &&
      this.inputElement.nativeElement.getAttribute('aria-label').includes('Unselected')
    ) {
      this.inputElement.nativeElement.setAttribute('aria-label', this.label ? this.label : '');
    }
    this.onModelTouched?.();
  }

  onKeyDown(event?: any) {
    if (event.shiftKey && event.keyCode === PoKeyCodeEnum.tab && !this.focusOnTag) {
      this.controlDropdownVisibility(false);
    }
    this.focusOnTag = false;

    if (event.keyCode === PoKeyCodeEnum.tab) {
      return;
    }

    if (event.keyCode === PoKeyCodeEnum.esc) {
      event.preventDefault();
      this.controlDropdownVisibility(false);
      return;
    }

    if (event.keyCode === PoKeyCodeEnum.arrowDown && this.visibleTags.length > 0) {
      event.preventDefault();
      this.controlDropdownVisibility(true);
      this.dropdown?.listbox?.setFocus();
      return;
    }

    if (event.keyCode === PoKeyCodeEnum.enter && !this.enterCloseTag) {
      if (this.visibleTags.length === 0) {
        this.toggleDropdownVisibility();
        this.focus();
        return;
      } else {
        event.preventDefault();
        this.toggleDropdownVisibility();
        return;
      }
    }

    if (event.keyCode === PoKeyCodeEnum.space) {
      event.preventDefault();
      this.toggleDropdownVisibility();
    }
    this.enterCloseTag = false;
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

  onKeyDownDropdown(event: KeyboardEvent, index: number) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.controlDropdownVisibility(false);
      this.inputElement.nativeElement.focus();
    }
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

  closeTag(value, event) {
    let index;
    this.enterCloseTag = true;
    if (!value || (typeof value === 'string' && value.includes('+'))) {
      index = null;
      const itemsNotInVisibleTags = this.selectedOptions.filter(option => !this.visibleTags.includes(option));
      for (const option of this.visibleTags) {
        if (!this.selectedOptions.includes(option)) {
          this.selectedOptions.splice(this.visibleTags.length - 1, itemsNotInVisibleTags.length);
          this.updateVisibleItems();
          this.callOnChange(this.selectedOptions);
        }
      }
    } else {
      index = this.selectedOptions.findIndex(option => option[this.fieldValue] === value);
      this.selectedOptions.splice(index, 1);
      this.updateVisibleItems();
      this.callOnChange(this.selectedOptions);
    }

    setTimeout(() => {
      this.focusOnNextTag(index, event);
    }, 300);
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

  private focusOnNextTag(indexClosed: number, clickOrEnter: string) {
    if (clickOrEnter === 'enter') {
      const tagRemoveElements: Array<any> = this.el.nativeElement.querySelectorAll('.po-tag-remove');
      indexClosed = indexClosed || indexClosed === 0 ? indexClosed : tagRemoveElements.length;
      if (tagRemoveElements.length === 0) {
        this.inputElement.nativeElement.focus();
        this.inputElement.nativeElement.setAttribute('aria-label', `Unselected items ${this.label}`);
        this.controlDropdownVisibility(true);
      }
      this.focusOnRemoveTag(tagRemoveElements, indexClosed);
    } else {
      indexClosed = 0;
    }
    this.handleKeyboardNavigationTag(indexClosed);
  }

  private focusOnRemoveTag(tag: any, indexClosed: number) {
    if (tag.length === indexClosed) {
      tag[indexClosed - 1]?.focus();
    } else {
      tag[indexClosed]?.focus();
    }
  }

  public handleKeyboardNavigationTag(initialIndex = 0) {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    const tagRemoveElements = this.el.nativeElement.querySelectorAll('.po-tag-remove');
    this.initializeTagRemoveElements(tagRemoveElements, initialIndex);
  }

  private setTabIndex(element, tabIndex) {
    element.setAttribute('tabindex', tabIndex);
  }

  private handleArrowLeft(tagRemoveElements, index) {
    if (index > 0) {
      this.setTabIndex(tagRemoveElements[index], -1);
      tagRemoveElements[index - 1].focus();
      this.setTabIndex(tagRemoveElements[index - 1], 0);
    }
  }

  private handleArrowRight(tagRemoveElements, index) {
    if (index < tagRemoveElements.length - 1) {
      this.setTabIndex(tagRemoveElements[index], -1);
      tagRemoveElements[index + 1].focus();
      this.setTabIndex(tagRemoveElements[index + 1], 0);
    }
  }

  private handleKeyDown(event: KeyboardEvent, tagRemoveElements, index) {
    const KEY_SPACE = 'Space';
    const KEY_ARROW_LEFT = 'ArrowLeft';
    const KEY_ARROW_RIGHT = 'ArrowRight';
    this.focusOnTag = true;

    if (event.code === KEY_SPACE) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (event.key === KEY_ARROW_LEFT) {
      this.handleArrowLeft(tagRemoveElements, index);
    } else if (event.key === KEY_ARROW_RIGHT) {
      this.handleArrowRight(tagRemoveElements, index);
    }
  }

  private initializeTagRemoveElements(tagRemoveElements, initialIndex) {
    tagRemoveElements.forEach((tagRemoveElement, index) => {
      if (index === initialIndex) {
        this.setTabIndex(tagRemoveElements[initialIndex], 0);
      } else if (tagRemoveElements.length === initialIndex) {
        this.setTabIndex(tagRemoveElements[initialIndex - 1], 0);
      } else {
        this.setTabIndex(tagRemoveElement, -1);
      }

      this.subscription.add(
        fromEvent(tagRemoveElement, 'keydown').subscribe((event: KeyboardEvent) => {
          this.handleKeyDown(event, tagRemoveElements, index);
        })
      );
    });
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
