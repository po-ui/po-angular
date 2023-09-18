import {
  AfterViewInit,
  DoCheck,
  Component,
  ElementRef,
  forwardRef,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { NgControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { uuid } from '../../../utils/util';

import { PoLookupBaseComponent } from './po-lookup-base.component';
import { PoLookupFilterService } from './services/po-lookup-filter.service';
import { PoLookupModalService } from './services/po-lookup-modal.service';

/* istanbul ignore next */
const providers = [
  PoLookupFilterService,
  PoLookupModalService,
  {
    provide: NG_VALUE_ACCESSOR,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoLookupComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // eslint-disable-next-line
    useExisting: forwardRef(() => PoLookupComponent),
    multi: true
  },
  {
    provide: NgControl,
    useExisting: forwardRef(() => PoLookupComponent),
    multi: false
  }
];

/**
 * @docsExtends PoLookupBaseComponent
 *
 * @description
 *
 * Quando existe muitos dados o po-lookup por padrão traz apenas 10 itens na tabela e os demais são carregados por demanda através do
 * botão 'Carregar mais resultados'. Para que funcione corretamente, é importante que o serviço siga o
 * [Guia de implementação das APIs TOTVS](https://po-ui.io/guides/api).
 *
 * Importante:
 *
 * - Caso o po-lookup contenha o [(ngModel)] sem o atributo name, ocorrerá um erro de angular.
 * Então será necessário informar o atributo name ou o atributo [ngModelOptions]="{standalone: true}".
 * ```
 * <po-lookup
 *   [(ngModel)]="pessoa.nome"
 *   [ngModelOptions]="{standalone: true}">
 * </po-lookup>
 * ```
 *
 * @example
 *
 * <example name="po-lookup-basic" title="PO Lookup Basic">
 *  <file name="sample-po-lookup-basic/sample-po-lookup-basic.component.html"> </file>
 *  <file name="sample-po-lookup-basic/sample-po-lookup-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-lookup-labs" title="PO Lookup Labs">
 *  <file name="sample-po-lookup-labs/sample-po-lookup-labs.component.html"> </file>
 *  <file name="sample-po-lookup-labs/sample-po-lookup-labs.component.ts"> </file>
 *  <file name="sample-po-lookup.service.ts"> </file>
 * </example>
 *
 * <example name="po-lookup-hero" title="PO Lookup - Hero">
 *  <file name="sample-po-lookup-hero/sample-po-lookup-hero.component.html"> </file>
 *  <file name="sample-po-lookup-hero/sample-po-lookup-hero.component.ts"> </file>
 *  <file name="sample-po-lookup.service.ts"> </file>
 * </example>
 *
 * <example name="po-lookup-hero-reactive-form" title="PO Lookup - Hero Reactive Form">
 *  <file name="sample-po-lookup-hero-reactive-form/sample-po-lookup-hero-reactive-form.component.html"> </file>
 *  <file name="sample-po-lookup-hero-reactive-form/sample-po-lookup-hero-reactive-form.component.ts"> </file>
 *  <file name="sample-po-lookup.service.ts"> </file>
 * </example>
 *
 * <example name="po-lookup-sw-films" title="PO Lookup - Star Wars films">
 *  <file name="sample-po-lookup-sw-films/sample-po-lookup-sw-films.component.html"> </file>
 *  <file name="sample-po-lookup-sw-films/sample-po-lookup-sw-films.component.ts"> </file>
 *  <file name="sample-po-lookup-sw-films/sample-po-lookup-sw-films.service.ts"> </file>
 * </example>
 *
 * <example name="po-lookup-multiple" title="PO Lookup - Multiple">
 *  <file name="sample-po-lookup-multiple/sample-po-lookup-multiple.component.html"> </file>
 *  <file name="sample-po-lookup-multiple/sample-po-lookup-multiple.component.ts"> </file>
 *  <file name="sample-po-lookup-multiple/sample-po-lookup-multiple.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-lookup',
  templateUrl: './po-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers
})
export class PoLookupComponent extends PoLookupBaseComponent implements AfterViewInit, OnDestroy, OnInit, DoCheck {
  @ViewChild('inp', { read: ElementRef, static: false }) inputEl: ElementRef;

  initialized = false;
  timeoutResize;
  visibleElement = false;

  disclaimers = [];
  visibleDisclaimers = [];

  id = `po-lookup[${uuid()}]`;

  private modalSubscription: Subscription;
  private isCalculateVisibleItems: boolean = true;

  get autocomplete() {
    return this.noAutocomplete ? 'off' : 'on';
  }

  constructor(
    private renderer: Renderer2,
    poLookupFilterService: PoLookupFilterService,
    poLookupModalService: PoLookupModalService,
    private cd: ChangeDetectorRef,
    injector: Injector
  ) {
    super(poLookupFilterService, injector, poLookupModalService);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.autoFocus) {
      this.focus();
    }

    this.initialized = true;
  }

  ngDoCheck() {
    const inputWidth = this.inputEl?.nativeElement.offsetWidth;
    // Permite que os disclaimers sejam calculados na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    if ((inputWidth && !this.visibleElement && this.initialized) || (inputWidth && this.isCalculateVisibleItems)) {
      this.debounceResize();
      this.visibleElement = true;
    }
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeListeners();
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoLookupComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoLookupComponent, { static: true }) lookup: PoLookupComponent;
   *
   * focusLookup() {
   *   this.lookup.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled) {
      this.inputEl.nativeElement.focus();
    }
  }

  openLookup(): void {
    if (this.isAllowedOpenModal()) {
      const {
        advancedFilters,
        service,
        columns,
        filterParams,
        hideColumnsManager,
        literals,
        infiniteScroll,
        multiple,
        fieldLabel,
        fieldValue,
        changeVisibleColumns,
        columnRestoreManager
      } = this;

      const selectedItems = this.checkSelectedItems();

      this.poLookupModalService.openModal({
        advancedFilters,
        service,
        columns,
        filterParams,
        hideColumnsManager,
        title: this.label,
        literals,
        infiniteScroll,
        multiple,
        selectedItems,
        fieldLabel,
        fieldValue,
        changeVisibleColumns,
        columnRestoreManager
      });

      if (!this.modalSubscription) {
        this.modalSubscription = this.poLookupModalService.selectValueEvent.subscribe(selectedOptions => {
          if (selectedOptions.length > 1 || this.disclaimers.length) {
            this.setDisclaimers(selectedOptions);
            this.updateVisibleItems();
          }

          this.selectModel(selectedOptions);
        });
      }
    }
  }

  checkSelectedItems() {
    if (this.multiple) {
      if (!this.disclaimers.length && this.valueToModel?.length) {
        return [{ value: this.valueToModel[0], label: this.oldValue, ...this.selectedOptions[0] }];
      }

      return this.disclaimers;
    } else {
      return this.valueToModel;
    }
  }

  setDisclaimers(selectedOptions: Array<any>) {
    this.disclaimers = selectedOptions.map(selectedOption => ({
      value: selectedOption[this.fieldValue],
      label: selectedOption[this.fieldLabel],
      ...selectedOption
    }));

    this.visibleDisclaimers = [...this.disclaimers];
    this.cd.markForCheck();
  }

  setViewValue(value: any, object: any): void {
    if (this.inputEl && this.fieldFormat) {
      this.setInputValueWipoieldFormat(object);
    } else if (this.inputEl) {
      this.inputEl.nativeElement.value = this.valueToModel || this.valueToModel === 0 ? value : '';
    }
    this.cd.markForCheck();
  }

  getViewValue(): string {
    return this.inputEl.nativeElement.value;
  }

  searchEvent() {
    this.onTouched?.();
    const value = this.getViewValue();

    if (this.oldValue?.toString() !== value) {
      this.searchById(value);
    }
  }

  closeDisclaimer(value) {
    this.disclaimers = this.disclaimers.filter(disclaimer => disclaimer.value !== value);
    this.valueToModel = this.valueToModel.filter(model => model !== value);

    this.updateVisibleItems();
    this.callOnChange(this.valueToModel.length ? this.valueToModel : undefined);
  }

  updateVisibleItems() {
    if (this.disclaimers && this.disclaimers.length > 0) {
      this.visibleDisclaimers = [].concat(this.disclaimers);
    }

    this.debounceResize();

    if (!this.inputEl.nativeElement.offsetWidth) {
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
  }

  getInputWidth() {
    return this.inputEl.nativeElement.offsetWidth - 40;
  }

  getDisclaimersWidth() {
    const disclaimers = this.inputEl.nativeElement.querySelectorAll('po-disclaimer');
    return Array.from(disclaimers).map(disclaimer => disclaimer['offsetWidth']);
  }

  calculateVisibleItems() {
    const disclaimersWidth = this.getDisclaimersWidth();
    const inputWidth = this.getInputWidth();
    const extraDisclaimerSize = 38;
    const disclaimersVisible = disclaimersWidth[0];

    const newDisclaimers = [];
    const disclaimers = this.disclaimers;

    if (inputWidth > 0) {
      let sum = 0;
      let i = 0;
      for (i = 0; i < disclaimers.length; i++) {
        sum += disclaimersWidth[i];
        newDisclaimers.push(disclaimers[i]);

        if (sum > inputWidth) {
          sum -= disclaimersWidth[i];
          this.isCalculateVisibleItems = false;
          break;
        }
      }

      if (disclaimersVisible || !disclaimers.length) {
        if (i === disclaimers.length) {
          this.isCalculateVisibleItems = false;
          return;
        }

        if (sum + extraDisclaimerSize > inputWidth) {
          newDisclaimers.splice(-2, 2);
          const label = '+' + (disclaimers.length + 1 - i).toString();
          newDisclaimers.push({ value: '', label: label });
        } else {
          newDisclaimers.splice(-1, 1);
          const label = '+' + (disclaimers.length - i).toString();
          newDisclaimers.push({ value: '', label: label });
        }
      }
    }

    this.visibleDisclaimers = [...newDisclaimers];
  }

  private isAllowedOpenModal(): boolean {
    if (!this.service) {
      console.warn('No service informed');
    }

    return !!(this.service && !this.disabled);
  }

  private formatFields(objectSelected, properties) {
    let formatedField;
    if (Array.isArray(properties)) {
      for (const property of properties) {
        if (objectSelected && objectSelected[property]) {
          if (!formatedField) {
            formatedField = objectSelected[property];
          } else {
            formatedField = formatedField + ' - ' + objectSelected[property];
          }
        }
      }
    }

    if (!formatedField) {
      formatedField = objectSelected[this.fieldValue];
    }
    return formatedField;
  }

  private setInputValueWipoieldFormat(objectSelected: any) {
    const isEmpty = Object.keys(objectSelected).length === 0;
    let fieldFormated;

    if (Array.isArray(this.fieldFormat)) {
      fieldFormated = this.formatFields(objectSelected, this.fieldFormat);
    } else {
      fieldFormated = this.fieldFormat(objectSelected);
    }

    this.oldValue = isEmpty ? '' : fieldFormated;
    this.inputEl.nativeElement.value = isEmpty ? '' : fieldFormated;
  }

  private initializeListeners(): void {
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.updateVisibleItems();
    });
  }
}
