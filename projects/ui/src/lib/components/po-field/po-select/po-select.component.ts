import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ContentChild,
  Component,
  DoCheck,
  ElementRef,
  forwardRef,
  HostListener,
  IterableDiffers,
  Renderer2,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl } from '@angular/forms';

import { isMobile, removeDuplicatedOptions, removeUndefinedAndNullOptions, validValue } from '../../../utils/util';
import { PoControlPositionService } from './../../../services/po-control-position/po-control-position.service';
import { PoKeyCodeEnum } from './../../../enums/po-key-code.enum';

import { PoSelectOption } from './po-select-option.interface';
import { PoSelectOptionTemplateDirective } from './po-select-option-template/po-select-option-template.directive';
import { PoFieldValidateModel } from '../po-field-validate.model';
import { InputBoolean } from '../../../decorators';

const poSelectContentOffset = 8;
const poSelectContentPositionDefault = 'bottom';

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
export class PoSelectComponent extends PoFieldValidateModel<any> implements AfterViewInit, DoCheck {
  @ContentChild(PoSelectOptionTemplateDirective, { static: true })
  selectOptionTemplate: PoSelectOptionTemplateDirective;

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
  selectIcon: string = 'po-icon-arrow-down';
  scrollPosition: number;

  eventListenerFunction: () => void;
  eventResizeListener: () => void;

  onModelTouched: any;
  protected clickoutListener: () => void;
  private differ: any;
  private _options: Array<PoSelectOption>;

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
    this._options = options;
    removeDuplicatedOptions(this._options);
    removeUndefinedAndNullOptions(this._options);
    this.onUpdateOptions();
  }

  get options() {
    return this._options;
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

  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }

  ngDoCheck() {
    const change = this.differ.diff(this.options);
    if (change) {
      removeDuplicatedOptions(this.options);
      removeUndefinedAndNullOptions(this.options);
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

  onOptionClick(option: PoSelectOption) {
    this.updateValues(option);
    this.toggleButton();
  }

  // Altera o valor ao selecionar um item.
  onSelectChange(value: any) {
    if (value && this.options && this.options.length) {
      const optionFound: PoSelectOption = this.findOptionValue(value);

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
  updateValues(option: PoSelectOption): void {
    if (this.selectedValue !== option.value) {
      this.selectedValue = option.value;
      this.selectElement.nativeElement.value = option.value;
      this.updateModel(option.value);
      this.displayValue = option.label;
      this.emitChange(option.value);
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
    const optionFound: PoSelectOption = this.findOptionValue(value);

    if (optionFound) {
      this.selectElement.nativeElement.value = optionFound.value;
      this.selectedValue = optionFound.value;
      this.displayValue = optionFound.label;
      this.setScrollPosition(optionFound.value);
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
      const optionFound: PoSelectOption = this.findOptionValue(value);

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
}
