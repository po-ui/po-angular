import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ContentChild,
  Component,
  ElementRef,
  forwardRef,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl } from '@angular/forms';

import { removeDuplicatedOptions, removeUndefinedAndNullOptions } from '../../../utils/util';
import { PoControlPositionService } from './../../../services/po-control-position/po-control-position.service';

import { PoSelectOption } from './po-select-option.interface';
import { PoSelectOptionTemplateDirective } from './po-select-option-template/po-select-option-template.directive';
import { PoFieldValidateModel } from '../po-field-validate.model';
import { InputBoolean } from '../../../decorators';

import '@animaliads/ani-select';

/**
 * @docsExtends PoFieldValidateModel
 *
 * @example
 *
 * <example name="po-select-basic" title="PO Select Basic">
 *   <file name="sample-po-select-basic/sample-po-select-basic.component.html"> </file>
 *   <file name="sample-po-select-basic/sample-po-select-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-select-labs" title="PO Select Labs">
 *   <file name="sample-po-select-labs/sample-po-select-labs.component.html"> </file>
 *   <file name="sample-po-select-labs/sample-po-select-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-select-customer-registration" title="PO Select - Customer registration">
 *   <file name="sample-po-select-customer-registration/sample-po-select-customer-registration.component.html"> </file>
 *   <file name="sample-po-select-customer-registration/sample-po-select-customer-registration.component.ts"> </file>
 *   <file name="sample-po-select-customer-registration/sample-po-select-customer-registration.service.ts"> </file>
 *   <file name='sample-po-select-customer-registration/sample-po-select-customer-registration.component.e2e-spec.ts'> </file>
 *   <file name='sample-po-select-customer-registration/sample-po-select-customer-registration.component.po.ts'> </file>
 * </example>
 *
 * @description
 *
 * O componente po-select exibe uma lista de valores e permite que o usuário selecione um desses valores.
 * Os valores listados podem ser fixos ou dinâmicos de acordo com a necessidade do desenvolvedor, dando mais flexibilidade ao componente.
 * O po-select não permite que o usuário informe um valor diferente dos valores listados, isso garante a consistência da informação.
 * O po-select não permite que sejam passados valores duplicados, undefined e null para as opções, excluindo-os da lista.
 *
 * > Ao passar um valor para o _model_ que não está na lista de opções, o mesmo será definido como `undefined`.
 *
 * Também existe a possibilidade de utilizar um _template_ para a exibição dos itens da lista,
 * veja mais em **[p-select-option-template](/documentation/po-select-option-template)**.
 */
@Component({
  selector: 'po-select',
  templateUrl: './po-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PoSelectComponent),
      multi: true
    },
    PoControlPositionService
  ]
})
export class PoSelectComponent extends PoFieldValidateModel<any> implements AfterViewInit {
  @ContentChild(PoSelectOptionTemplateDirective, { static: true })
  selectOptionTemplate: PoSelectOptionTemplateDirective;

  @ViewChild('select', { read: ElementRef, static: true }) selectElement: ElementRef;

  /**
   * @optional
   *
   * @description
   *
   * Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da tag form.
   *
   * Na versão 12.2.0 do Angular a verificação `strictTemplates` vem true como default. Portanto, para utilizar
   * two-way binding no componente deve se utilizar da seguinte forma:
   *
   * ```
   * <po-select ... [ngModel]="selectModel" (ngModelChange)="selectModel = $event"> </po-select>
   * ```
   */
  @Output('ngModelChange') ngModelChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será somente para leitura.
   *
   * @default `false`
   */
  @Input('p-readonly') @InputBoolean() readonly: boolean = false;

  /** Mensagem que aparecerá enquanto nenhuma opção estiver selecionada. */
  @Input('p-placeholder') placeholder?: string;

  modelValue: any;
  onModelChange: any;
  selectedValue: any;

  onModelTouched: any;
  private _options: any;

  /**
   * Nesta propriedade deve ser definido uma coleção de objetos que implementam a interface `PoSelectOption`.
   *
   * Caso esta lista estiver vazia, o model será `undefined`.
   *
   * > Essa propriedade é imutável, ou seja, sempre que quiser atualizar a lista de opções disponíveis
   * atualize a referência do objeto:
   *
   * ```
   * // atualiza a referência do objeto garantindo a atualização do template
   * this.options = [...this.options, { value: 'x', label: 'Nova opção' }];
   *
   * // evite, pois não atualiza a referência do objeto podendo gerar atrasos na atualização do template
   * this.options.push({ value: 'x', label: 'Nova opção' });
   * ```
   */
  @Input('p-options') set options(options: Array<PoSelectOption>) {
    removeDuplicatedOptions(options);
    removeUndefinedAndNullOptions(options);
    this._options = JSON.stringify(options);
    this.onUpdateOptions();
  }

  get options() {
    return this._options;
  }
  /* istanbul ignore next */
  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  /**
   * Função que atribui foco ao componente.
   *
   * Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:
   *
   * ```
   * import { PoSelectComponent } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild(PoSelectComponent, { static: true }) select: PoSelectComponent;
   *
   * focusSelect() {
   *   this.select.focus();
   * }
   * ```
   */
  focus(): void {
    if (!this.disabled) {
      this.selectElement.nativeElement.setFocus();
    }
  }

  onBlur() {
    this.onModelTouched?.();
  }

  // Altera o valor ao selecionar um item.
  onSelectChange(value: any) {
    this.selectElement.nativeElement.value = value;
    this.selectedValue = value;
    this.updateModel(value);
    this.emitChange(value);
  }

  onUpdateOptions() {
    if (this.modelValue) {
      this.onSelectChange(this.modelValue);
    }
  }

  // Recebe as alterações do model
  onWriteValue(value: any) {
    this.selectedValue = value;
    this.modelValue = value;
    this.changeDetector.detectChanges();
  }

  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }
}
