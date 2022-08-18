import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  IterableDiffers,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  isMobile,
  removeDuplicatedOptions,
  removeDuplicatedOptionsWithFieldValue,
  removeUndefinedAndNullOptions,
  removeUndefinedAndNullOptionsWithFieldValue,
  validValue
} from '../../../utils/util';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';
import { PoControlPositionService } from './../../../services/po-control-position/po-control-position.service';

import { InputBoolean } from '../../../decorators';
import { PoFieldValidateModel } from '../po-field-validate.model';
import { PoSelectOption } from './po-select-option.interface';

const poSelectContentOffset = 8;
const poSelectContentPositionDefault = 'bottom';
const PO_SELECT_FIELD_LABEL_DEFAULT = 'label';
const PO_SELECT_FIELD_VALUE_DEFAULT = 'value';

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
 * <example name="po-select-companies" title="PO Select Companies">
 *   <file name="sample-po-select-companies/sample-po-select-companies.component.html"> </file>
 *   <file name="sample-po-select-companies/sample-po-select-companies.component.ts"> </file>
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
 * veja mais em **[p-combo-option-template](/documentation/po-combo-option-template)**.
 *
 * > Obs: o template **[p-select-option-template](/documentation/po-select-option-template)** será depreciado na versão 14.x.x.
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
export class PoSelectComponent extends PoFieldValidateModel<any> implements DoCheck {
  @ViewChild('contentList', { read: ElementRef, static: true }) contentList: ElementRef;
  @ViewChild('icon', { read: ElementRef, static: true }) iconElement: ElementRef;
  @ViewChild('select', { read: ElementRef, static: true }) selectElement: ElementRef;
  @ViewChild('selectButton', { read: ElementRef, static: true }) selectButtonElement: ElementRef;

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

  displayValue;
  isMobile: any = isMobile();
  modelValue: any;
  onModelChange: any;
  open: boolean = false;
  selectedValue: any;
  selectOptionTemplate: any;
  selectIcon: string = 'po-icon-arrow-down';
  scrollPosition: number;

  eventListenerFunction: () => void;
  eventResizeListener: () => void;

  onModelTouched: any;
  protected clickoutListener: () => void;
  private differ: any;
  private _fieldLabel?: string = PO_SELECT_FIELD_LABEL_DEFAULT;
  private _fieldValue?: string = PO_SELECT_FIELD_VALUE_DEFAULT;
  private _options: Array<PoSelectOption> | Array<any>;

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
  @Input('p-options') set options(options: Array<any>) {
    if (this.fieldLabel && this.fieldValue) {
      options.map(option => {
        option.label = option[this.fieldLabel];
        option.value = option[this.fieldValue];
      });
    }

    this.validateOptions([...options]);
    this.onUpdateOptions();
    this._options = [...options];
  }

  get options() {
    return this._options;
  }

  /**
   * @optional
   *
   * @description
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente
   * (`p-options`), esta propriedade será responsável pelo texto de apresentação de cada item da lista.
   *
   * @default `label`
   */
  @Input('p-field-label') set fieldLabel(value: string) {
    this._fieldLabel = value || PO_SELECT_FIELD_LABEL_DEFAULT;
    if (this.options && this.options.length > 0) {
      this.options = [...this.options];
    }
  }

  get fieldLabel() {
    return this._fieldLabel;
  }

  /**
   * @optional
   *
   * @description
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente
   * (`p-options`), esta propriedade será responsável pelo valor de cada item da lista.
   *
   * @default `value`
   */
  @Input('p-field-value') set fieldValue(value: string) {
    this._fieldValue = value || PO_SELECT_FIELD_VALUE_DEFAULT;
    if (this.options && this.options.length > 0) {
      this.options = [...this.options];
    }
  }

  get fieldValue() {
    return this._fieldValue;
  }

  /* istanbul ignore next */
  constructor(
    private element: ElementRef,
    private changeDetector: ChangeDetectorRef,
    differs: IterableDiffers,
    public renderer: Renderer2,
    private controlPosition: PoControlPositionService
  ) {
    super();
    this.differ = differs.find([]).create(null);
  }

  get isInvisibleSelectNative() {
    return this.readonly && this.isMobile;
  }

  @HostListener('keydown', ['$event']) onKeydown($event?: any) {
    const charCode = $event.which || $event.keyCode;

    // Tratamentos para quando o readonly for ativado.
    if (this.readonly) {
      // deve matar o evento do teclado devido a alterar o valor do model mesmo com os options fechados
      if (charCode !== PoKeyCodeEnum.tab) {
        this.disableDefaultEventAndToggleButton();
        $event.preventDefault();
      }
      return;
    }

    // Seleciona os itens com as teclas "up" e "down"
    if ((!this.open || $event.altKey) && (charCode === PoKeyCodeEnum.arrowDown || charCode === PoKeyCodeEnum.arrowUp)) {
      this.disableDefaultEventAndToggleButton();
    }

    // Abre o po-select com as teclas "enter" e "espaço"
    if (charCode === PoKeyCodeEnum.enter || charCode === PoKeyCodeEnum.space) {
      this.disableDefaultEventAndToggleButton();
    }

    // Fecha o po-select com a tecla "tab"
    if (this.open && charCode === PoKeyCodeEnum.tab) {
      $event.preventDefault();
      this.toggleButton();
    }
  }

  ngDoCheck() {
    const change = this.differ.diff(this.options);
    if (change) {
      removeDuplicatedOptions(this.options);
      removeUndefinedAndNullOptions(this.options);
      removeDuplicatedOptionsWithFieldValue(this.options, this.fieldValue);
      removeUndefinedAndNullOptionsWithFieldValue(this.options, this.fieldValue);
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
      this.selectElement.nativeElement.focus();
    }
  }

  hideDropDown() {
    this.selectIcon = 'po-icon-arrow-down';
    this.selector('.po-select-container').classList.remove('po-select-show');
    this.open = false;

    this.changeDetector.markForCheck();
    this.selectElement.nativeElement.focus();

    this.removeListeners();
  }

  onBlur() {
    this.onModelTouched?.();
  }

  onOptionClick(option: any) {
    this.updateValues(option);
    this.toggleButton();
  }

  // Altera o valor ao selecionar um item.
  onSelectChange(value: any) {
    if (value && this.options && this.options.length) {
      const optionFound: any = this.findOptionValue(value);

      if (optionFound) {
        this.updateValues(optionFound);
        this.setScrollPosition(optionFound.value);
      }
    }
  }

  onUpdateOptions() {
    if (this.modelValue) {
      this.onSelectChange(this.modelValue);
    }
  }

  scrollValue(index, clientHeight) {
    const heightScrollValue: number = index * this.getSelectItemHeight();

    return (this.scrollPosition = heightScrollValue > clientHeight ? heightScrollValue : 0);
  }

  selector(query: string): Element {
    return this.element.nativeElement.querySelector(query);
  }

  toggleButton(): void {
    this.open ? this.hideDropDown() : this.showDropdown();
  }

  // Atualiza valores
  updateValues(option: any): void {
    if (this.selectedValue !== option[this.fieldValue]) {
      this.selectedValue = option[this.fieldValue];
      this.selectElement.nativeElement.value = option[this.fieldValue];
      this.updateModel(option[this.fieldValue]);
      this.displayValue = option[this.fieldLabel];
      this.emitChange(option[this.fieldValue]);
    }
  }

  // Esconde Content do Select quando for clicado fora
  wasClickedOnToggle(event: MouseEvent): void {
    if (
      !this.selectButtonElement.nativeElement.contains(event.target) &&
      !this.iconElement.nativeElement.contains(event.target)
    ) {
      this.hideDropDown();
    }
  }

  // Recebe as alterações do model
  onWriteValue(value: any) {
    const optionFound: any = this.findOptionValue(value);

    if (optionFound) {
      this.selectElement.nativeElement.value = optionFound.value;
      this.selectedValue = optionFound[this.fieldValue];
      this.displayValue = optionFound[this.fieldLabel];
      this.setScrollPosition(optionFound[this.fieldValue]);
    } else if (validValue(this.selectedValue)) {
      this.selectElement.nativeElement.value = undefined;
      this.updateModel(undefined);
      this.selectedValue = undefined;
      this.displayValue = undefined;
    }

    this.modelValue = value;
    this.changeDetector.detectChanges();
  }

  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }

  private isEqual(value: any, inputValue: any): boolean {
    if ((value || value === 0) && inputValue) {
      return value.toString() === inputValue.toString();
    }

    if ((value === null && inputValue !== null) || (value === undefined && inputValue !== undefined)) {
      value = `${value}`; // Transformando em string
    }

    return value === inputValue;
  }

  // Método necessário para bloquear o evento default do select nativo.
  // Ao utilizar event.preventDefault(), nos navegadores Firefox e IE o mesmo não cancela o evento.
  private disableDefaultEventAndToggleButton() {
    this.selectElement.nativeElement.style.display = 'none';

    setTimeout(() => {
      this.selectElement.nativeElement.style.display = 'block';
      this.toggleButton();
    });
  }

  private findOptionValue(value: any) {
    return this.options.find(option => this.isEqual(option.value, value));
  }

  private getSelectItemHeight() {
    const selectItem = this.selector('div.po-select-item');

    return selectItem && selectItem.clientHeight;
  }

  private initializeListeners() {
    this.clickoutListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.wasClickedOnToggle(event);
    });

    this.eventResizeListener = this.renderer.listen('window', 'resize', () => {
      this.hideDropDown();
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  private onScroll = (): void => {
    this.controlPosition.adjustPosition(poSelectContentPositionDefault);
  };

  private removeListeners() {
    if (this.clickoutListener) {
      this.clickoutListener();
    }

    this.eventResizeListener();
    window.removeEventListener('scroll', this.onScroll, true);
  }

  private setPositionDropdown() {
    this.controlPosition.setElements(
      this.contentList.nativeElement,
      poSelectContentOffset,
      this.selectButtonElement,
      ['top', 'bottom'],
      true
    );

    this.controlPosition.adjustPosition(poSelectContentPositionDefault);
  }

  private setScrollPosition(value: any) {
    const ulDropdpwn = this.element.nativeElement.querySelector('ul.po-select-content');

    if (value && this.options && this.options.length) {
      const optionFound: any = this.findOptionValue(value);

      if (optionFound) {
        const index = this.options.indexOf(optionFound);
        ulDropdpwn.scrollTop = this.scrollValue(index, ulDropdpwn.clientHeight);
      }
    }
  }

  private showDropdown() {
    if (!this.readonly) {
      this.selectElement.nativeElement.focus();
      this.selectIcon = 'po-icon-arrow-up';
      this.selector('.po-select-container').classList.add('po-select-show');
      this.open = true;
      this.changeDetector.markForCheck();
      this.setPositionDropdown();
      this.initializeListeners();

      if (this.options && this.options.length) {
        this.setScrollPosition(this.selectedValue);
      }
    }
  }

  private validateOptions(options: Array<any>) {
    removeDuplicatedOptions(options);
    removeUndefinedAndNullOptions(options);
    removeDuplicatedOptionsWithFieldValue(options, this.fieldValue);
    removeUndefinedAndNullOptionsWithFieldValue(options, this.fieldValue);
  }
}
