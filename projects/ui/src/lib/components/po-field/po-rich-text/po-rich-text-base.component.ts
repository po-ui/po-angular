import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoThemeService } from '../../../services';
import { convertToBoolean, getDefaultSize, validateSize } from '../../../utils/util';
import { requiredFailed } from '../validators';
import { PoRichTextToolbarActions } from './enum/po-rich-text-toolbar-actions.enum';
import { PoRichTextService } from './po-rich-text.service';

/**
 * @description
 *
 * O componente `po-rich-text` é um editor de textos enriquecidos.
 *
 * Para edição de texto simples sem formatação recomenda-se o uso do componente [**po-textarea**](/documentation/po-textarea).
 *
 * > No navegador Internet Explorer não é possível alterar a cor do texto.
 */
@Directive()
export abstract class PoRichTextBaseComponent implements ControlValueAccessor, Validator {
  /**
   * @optional
   *
   * @description
   * Exibe um ícone de ajuda adicional ao `p-help`, com o texto desta propriedade no tooltip.
   * Se o evento `p-additional-help` estiver definido, o tooltip não será exibido.
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   * > Requer um recuo mínimo de 8px se o componente estiver próximo à lateral da tela.
   */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define que o tooltip (`p-additional-help-tooltip` e/ou `p-error-limit`) será incluído no body da página e não
   * dentro do componente. Essa opção pode ser necessária em cenários com containers que possuem scroll ou overflow
   * escondido, garantindo o posicionamento correto do tooltip próximo ao elemento.
   *
   * > Quando utilizado com `p-additional-help-tooltip`, leitores de tela como o NVDA podem não ler o conteúdo do tooltip.
   *
   * @default `false`
   */
  @Input({ alias: 'p-append-in-body', transform: convertToBoolean }) appendBox?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   *
   * > Caso mais de um elemento seja configurado com essa propriedade, apenas o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input({ alias: 'p-auto-focus', transform: convertToBoolean }) autoFocus: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define se o alinhamento de texto será desabilitado.
   *
   * @default `false`
   */
  @Input({ alias: 'p-disabled-text-align', transform: convertToBoolean }) disabledTextAlign: boolean;

  /**
   * @description
   *
   * Mensagem que será apresentada quando a propriedade required estiver habilitada e o campo for limpo após algo ser digitado.
   */
  @Input('p-error-message') errorMessage?: string = '';

  /**
   * @optional
   *
   * @description
   *
   * Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo.
   *
   * > Caso essa propriedade seja definida como `true`, a mensagem de erro será limitada a duas linhas
   * e um tooltip será exibido ao passar o mouse sobre a mensagem para mostrar o conteúdo completo.
   *
   * @default `false`
   */
  @Input('p-error-limit') errorLimit: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Texto de apoio do campo.
   */
  @Input('p-help') help?: string;

  /**
   * @optional
   *
   * @description
   *
   * Rótulo do campo.
   */
  @Input('p-label') label?: string;

  /** Nome e identificador do campo. */
  @Input('name') name: string;

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * > Não será exibida a indicação se:
   * - O campo conter `p-required`;
   * - Não possuir `p-help` e/ou `p-label`.
   *
   * @default `false`
   */
  @Input('p-optional') optional: boolean;

  private _hideToolbarActions: Array<PoRichTextToolbarActions> = [];

  /**
   * @optional
   *
   * @description
   *
   * Define as ações da barra de ferramentas do `PoRichTextComponent` que serão ocultadas.
   * Aceita um único valor do tipo `PoRichTextToolbarActions` ou uma lista de valores.
   *
   * > Esta propriedade sobrepõe a configuração da propriedade `p-disabled-text-align` quando for passada como `false`, caso sejam definidas simultaneamente.
   *
   * @default `[]`
   *
   * @example
   * ```
   * // Oculta apenas o seletor de cores
   * component.hideToolbarActions = PoRichTextToolbarActions.Color;
   *
   * // Oculta as opções de alinhamento e link
   * component.hideToolbarActions = [PoRichTextToolbarActions.Align, PoRichTextToolbarActions.Link];
   * ```
   */
  @Input('p-hide-toolbar-actions') set hideToolbarActions(
    actions: Array<PoRichTextToolbarActions> | PoRichTextToolbarActions
  ) {
    this._hideToolbarActions = Array.isArray(actions) ? [...actions] : [actions];
  }

  get hideToolbarActions(): Array<PoRichTextToolbarActions> {
    return this._hideToolbarActions;
  }

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone de ajuda adicional.
   * Este evento ativa automaticamente a exibição do ícone de ajuda adicional ao `p-help`.
   */
  @Output('p-additional-help') additionalHelp = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao deixar o campo e que recebe como parâmetro o valor alterado.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao modificar valor do model e que recebe como parâmetro o valor alterado.
   */
  @Output('p-change-model') changeModel: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   * Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
   * Retorna um objeto `KeyboardEvent` com informações sobre a tecla.
   */
  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  displayAdditionalHelp: boolean = false;
  invalid: boolean = false;
  onChangeModel: any = null;
  value: string;

  private _height?: number;
  private _placeholder: string;
  private _readonly: boolean;
  private _required: boolean;
  private _size?: string = undefined;
  private validatorChange: any;
  // eslint-disable-next-line
  protected onTouched: any = null;

  /**
   * @optional
   *
   * @description
   *
   * Define a altura da área de edição de texto.
   *
   * > Altura mínima do componente é `94` e a altura máxima é `262`.
   */
  @Input('p-height') set height(height: number) {
    this._height = height;
  }

  get height() {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Mensagem que aparecerá enquanto o campo não estiver preenchido.
   *
   * @default ''
   */
  @Input('p-placeholder') set placeholder(value: string) {
    this._placeholder = value || '';
  }

  get placeholder() {
    return this._placeholder;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será somente leitura.
   *
   * @default `false`
   */
  @Input('p-readonly') set readonly(value: boolean) {
    this._readonly = convertToBoolean(value);
  }

  get readonly() {
    return this._readonly;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define que o campo será obrigatório.
   *
   * @default `false`
   */
  @Input('p-required') set required(value: boolean) {
    this._required = convertToBoolean(value);

    this.validateModel(this.value);
  }

  get required() {
    return this._required;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura dos buttons como 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura dos buttons como 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-size') set size(value: string) {
    this._size = validateSize(value, this.poThemeService, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSize(this.poThemeService, PoFieldSize);
  }

  /**
   * Define se a indicação de campo obrigatório será exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  @Input('p-show-required') showRequired: boolean = false;

  constructor(
    private richTextService: PoRichTextService,
    protected poThemeService: PoThemeService
  ) {}

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnChange(func: any): void {
    this.onChangeModel = func;
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnTouched(func: any): void {
    this.onTouched = func;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  validate(abstractControl: AbstractControl): { [key: string]: any } {
    if (requiredFailed(this.required, false, abstractControl.value)) {
      return {
        required: {
          valid: false
        }
      };
    }
  }

  writeValue(value: string): void {
    this.value = value;

    this.richTextService.emitModel(value);
  }

  // Executa a função onChange
  protected updateModel(value: any) {
    // Quando o rich-text não possui um formulário, então esta função não é registrada
    if (this.onChangeModel) {
      this.onChangeModel(value);
    }
  }

  protected validateModel(value: any) {
    if (this.validatorChange) {
      this.validatorChange(value);
    }
  }
}
