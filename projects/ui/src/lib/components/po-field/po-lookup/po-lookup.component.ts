import {
  Component,
  ElementRef,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
  Injector
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PoLookupBaseComponent } from './po-lookup-base.component';
import { PoLookupFilterService } from './services/po-lookup-filter.service';
import { PoLookupModalService } from './services/po-lookup-modal.service';

/* istanbul ignore next */
const providers = [
  PoLookupFilterService,
  PoLookupModalService,
  {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line
    useExisting: forwardRef(() => PoLookupComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    // tslint:disable-next-line
    useExisting: forwardRef(() => PoLookupComponent),
    multi: true
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
 */
@Component({
  selector: 'po-lookup',
  templateUrl: './po-lookup.component.html',
  providers
})
export class PoLookupComponent extends PoLookupBaseComponent implements AfterViewInit, OnDestroy, OnInit {
  private modalSubscription: Subscription;

  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;

  get autocomplete() {
    return this.noAutocomplete ? 'off' : 'on';
  }

  constructor(
    poLookupFilterService: PoLookupFilterService,
    private poLookupModalService: PoLookupModalService,
    injector: Injector
  ) {
    super(poLookupFilterService, injector);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.autoFocus) {
      this.focus();
    }
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    super.ngOnInit();
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
      const { advancedFilters, service, columns, filterParams, literals } = this;

      this.poLookupModalService.openModal({
        advancedFilters,
        service,
        columns,
        filterParams,
        title: this.label,
        literals
      });

      if (!this.modalSubscription) {
        this.modalSubscription = this.poLookupModalService.selectValueEvent.subscribe(element => {
          this.selectModel(element);
        });
      }
    }
  }

  setViewValue(value: any, object: any): void {
    if (this.fieldFormat) {
      this.setInputValueWipoieldFormat(object);
    } else {
      this.inputEl.nativeElement.value = this.valueToModel || this.valueToModel === 0 ? value : '';
    }
  }

  getViewValue(): string {
    return this.inputEl.nativeElement.value;
  }

  searchEvent() {
    this.onTouched?.();
    const value = this.getViewValue();

    if (this.oldValue.toString() !== value) {
      this.searchById(value);
    }
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
}
