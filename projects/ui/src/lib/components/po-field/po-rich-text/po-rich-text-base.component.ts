import { Directive, EventEmitter, input, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { convertToBoolean, getDefaultSizeFn, validateSizeFn } from '../../../utils/util';
import { PoValidators } from '../validators';
import { PoRichTextToolbarActions } from './enum/po-rich-text-toolbar-actions.enum';
import { PoRichTextService } from './po-rich-text.service';
import { PoHelperOptions } from '../../po-helper';

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
   *
   * @deprecated v23.x.x use `p-helper`
   *
   * @optional
   *
   * @description
   * Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`.
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   * > Requer um recuo mínimo de 8px se o componente estiver próximo à lateral da tela.
   *
   * > Essa propriedade está **depreciada** e será removida na versão `23.x.x`. Recomendamos utilizar a propriedade `p-helper` que oferece mais recursos e flexibilidade.
   */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define que o popover (`p-helper` e/ou `p-error-limit`) será incluído no body da página e não
   * dentro do componente. Essa opção pode ser necessária em cenários com containers que possuem scroll ou overflow
   * escondido, garantindo o posicionamento correto do tooltip próximo ao elemento.
   *
   * > Quando utilizado com `p-helper`, leitores de tela como o NVDA podem não ler o conteúdo do popover.
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

  /**
   * @optional
   *
   * @description
   * Define se o título do campo será exibido de forma compacta.
   *
   * Quando habilitado (`true`), o modo compacto afeta o conjunto composto por:
   * - `po-label`
   * - `p-requirement (showRequired)`
   * - `po-helper`
   *
   * Ou seja, todos os elementos relacionados ao título do campo
   * (rótulo, indicador de obrigatoriedade e componente auxiliar) passam
   * a seguir o comportamento de layout compacto.
   *
   * Também é possível definir esse comportamento de forma global,
   * uma única vez, na folha de estilo geral da aplicação, por meio
   * da customização dos tokens CSS:
   *
   * - `--field-container-title-justify`
   * - `--field-container-title-flex`
   *
   * Exemplo:
   *
   * ```
   * :root {
   *   --field-container-title-justify: flex-start;
   *   --field-container-title-flex: 0 1 auto;
   * }
   * ```
   *
   * Dessa forma, o layout compacto passa a ser o padrão da aplicação,
   * sem a necessidade de definir a propriedade individualmente em cada campo.
   *
   * @default `false`
   */
  @Input({ alias: 'p-compact-label', transform: convertToBoolean }) compactLabel: boolean = false;

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
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`.
   * > Para mais informações acesse: https://po-ui.io/documentation/po-helper.
   *
   * > Ao configurar esta propriedade, o antigo ícone de ajuda adicional (`p-additional-help-tooltip` e `p-additional-help`) será ignorado.
   */
  poHelperComponent = input<PoHelperOptions | string>(undefined, { alias: 'p-helper' });

  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede
   * o espaço disponível é transferido para a próxima linha em pontos apropriados para uma
   * leitura clara.
   *
   * @default `false`
   */
  labelTextWrap = input<boolean>(false, { alias: 'p-label-text-wrap' });

  /**
   *
   * @deprecated v23.x.x use `p-helper`
   *
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone de ajuda adicional.
   *
   * > Essa propriedade está **depreciada** e será removida na versão `23.x.x`. Recomendamos utilizar a propriedade `p-helper` que oferece mais recursos e flexibilidade.
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
    this._size = validateSizeFn(value, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  /**
   * Define se a indicação de campo obrigatório será exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  @Input('p-show-required') showRequired: boolean = false;

  constructor(private richTextService: PoRichTextService) {}

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
    if (PoValidators.requiredFailed(this.required, false, abstractControl.value)) {
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
