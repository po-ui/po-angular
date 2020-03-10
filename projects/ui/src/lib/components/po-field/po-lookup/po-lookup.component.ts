import { Component, ElementRef, forwardRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PoLookupBaseComponent } from './po-lookup-base.component';
import { PoLookupFilterService } from './services/po-lookup-filter.service';
import { PoLookupModalService } from './services/po-lookup-modal.service';

/**
 * @docsExtends PoLookupBaseComponent
 *
 * @description
 *
 * Quando existe muitos dados o po-lookup por padrão traz apenas 10 itens na tabela e os demais são carregados por demanda através do
 * botão 'Carregar mais resultados'. Para que funcione corretamente, é importante que o serviço siga o
 * [Guia de implementação das APIs TOTVS](http://tdn.totvs.com/pages/releaseview.action?pageId=271660444).
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
 * <example name="po-lookup-basic" title="Portinari Lookup Basic">
 *  <file name="sample-po-lookup-basic/sample-po-lookup-basic.component.html"> </file>
 *  <file name="sample-po-lookup-basic/sample-po-lookup-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-lookup-labs" title="Portinari Lookup Labs">
 *  <file name="sample-po-lookup-labs/sample-po-lookup-labs.component.html"> </file>
 *  <file name="sample-po-lookup-labs/sample-po-lookup-labs.component.ts"> </file>
 *  <file name="sample-po-lookup.service.ts"> </file>
 * </example>
 *
 * <example name="po-lookup-hero" title="Portinari Lookup - Hero">
 *  <file name="sample-po-lookup-hero/sample-po-lookup-hero.component.html"> </file>
 *  <file name="sample-po-lookup-hero/sample-po-lookup-hero.component.ts"> </file>
 *  <file name="sample-po-lookup.service.ts"> </file>
 * </example>
 *
 * <example name="po-lookup-hero-reactive-form" title="Portinari Lookup - Hero Reactive Form">
 *  <file name="sample-po-lookup-hero-reactive-form/sample-po-lookup-hero-reactive-form.component.html"> </file>
 *  <file name="sample-po-lookup-hero-reactive-form/sample-po-lookup-hero-reactive-form.component.ts"> </file>
 *  <file name="sample-po-lookup.service.ts"> </file>
 * </example>
 *
 * <example name="po-lookup-sw-films" title="Portinari Lookup - Star Wars films">
 *  <file name="sample-po-lookup-sw-films/sample-po-lookup-sw-films.component.html"> </file>
 *  <file name="sample-po-lookup-sw-films/sample-po-lookup-sw-films.component.ts"> </file>
 *  <file name="sample-po-lookup-sw-films/sample-po-lookup-sw-films.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-lookup',
  templateUrl: './po-lookup.component.html',
  providers: [
    PoLookupFilterService,
    PoLookupModalService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoLookupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoLookupComponent),
      multi: true
    }
  ]
})
export class PoLookupComponent extends PoLookupBaseComponent implements AfterViewInit, OnDestroy, OnInit {
  private modalSubscription: Subscription;

  @ViewChild('inp', { read: ElementRef, static: true }) inputEl: ElementRef;

  get autocomplete() {
    return this.noAutocomplete ? 'off' : 'on';
  }

  constructor(poLookupFilterService: PoLookupFilterService, private poLookupModalService: PoLookupModalService) {
    super(poLookupFilterService);
  }

  ngAfterViewInit() {
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
   * import { PoLookupComponent } from '@portinari/portinari-ui';
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
      const { service, columns, filterParams, literals } = this;

      this.poLookupModalService.openModal({ service, columns, filterParams, title: this.label, literals });

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
    const value = this.getViewValue();

    if (this.oldValue !== value) {
      this.searchById(value);
    }
  }

  private isAllowedOpenModal(): boolean {
    if (!this.service) {
      console.warn('No service informed');
    }

    return !!(this.service && !this.disabled);
  }

  private setInputValueWipoieldFormat(objectSelected: any) {
    const isEmpty = Object.keys(objectSelected).length === 0;
    const fieldFormated = this.fieldFormat(objectSelected);

    this.oldValue = isEmpty ? '' : fieldFormated;
    this.inputEl.nativeElement.value = isEmpty ? '' : fieldFormated;
  }
}
