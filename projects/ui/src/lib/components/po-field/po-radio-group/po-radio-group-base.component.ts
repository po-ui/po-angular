import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  input,
  Input,
  Output
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';

import {
  convertToBoolean,
  getDefaultSizeFn,
  removeDuplicatedOptions,
  validateSizeFn,
  PoUtils
} from '../../../utils/util';
import { PoValidators } from '../validators';

import { PoRadioSize } from '../po-radio/enums/po-radio-size.enum';
import { PoRadioGroupOption } from './po-radio-group-option.interface';
import { PoHelperOptions } from '../../po-helper';

const poRadioGroupColumnsDefaultLength: number = 6;
const poRadioGroupColumnsTotalLength: number = 12;

/**
 * @description
 *
 * O componente `po-radio-group` deve ser utilizado para disponibilizar múltiplas opções ao usuário, permitindo a ele que
 * selecione apenas uma delas. Seu uso é recomendado para um número pequeno de opções, caso contrário, recomenda-se o uso
 * do [**po-combo**](/documentation/po-combo) ou [**po-select**](/documentation/po-select).
 *
 * Este não é um componente de multiseleção, se for este o caso, deve-se utilizar o
 * [**po-checkbox-group**](/documentation/po-checkbox-group).
 *
 * > Ao passar um valor para o *model* que não esteja na lista de opções, o mesmo será definido como `undefined`.
 *
 * #### Acessibilidade tratada no componente interno `po-radio`:
 *
 * Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:
 *
 * - O componente foi desenvolvido utilizando controles padrões HTML para permitir a identificação do mesmo na interface por tecnologias assistivas. [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
 * - A cor não deve ser o único meio para diferenciar o radio button normal do selecionado, por isso deve-se manter uma diferença visual entre os estados. [WGAG 1.4.1: Use of Color, 3.2.4: Consistent Identification](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color)
 * - Quando em foco, o componente é ativado usando as teclas de Espaço e Enter do teclado. [W3C WAI-ARIA 3.5 Button - Keyboard Interaction](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-3)
 * - A área do foco precisar ter uma espessura de pelo menos 2 pixels CSS e o foco não pode ficar escondido por outros elementos da tela. [(WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)
 *
 * Conforme documentação em: https://doc.animaliads.io/docs/components/radio
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS): <br>
 * Obs: No componente Radio Group, a customização ocorre principalmente nos elementos `po-radio` que compõem o grupo de opções. <br>
 * Portanto, ao aplicar estilos customizados, é importante focar na customização dos elementos `po-radio` em vez do próprio `po-radio-group`.
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                                   | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                             |                                                 |
 * | `--border-color`                       | Cor da borda                                                | `var(--color-neutral-dark-70)`                  |
 * | `--field-container-title-justify`      | Alinhamento horizontal do título (`justify-content`)        | `space-between`                                 |
 * | `--field-container-title-flex`         | Flex do título (`flex`)                                     | `1 auto`                                        |
 * | **Hover**                              |                                                             |                                                 |
 * | `--shadow-color-hover`                 | Cor da sombra no estado hover                               | `var(--color-brand-01-lighter)`                 |
 * | `--color-hover`                        | Cor principal no estado hover                               | `var(--color-brand-01-dark)`                    |
 * | **Focused**                            |                                                             |                                                 |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                           | `var(--color-brand-01-darkest)`                 |
 * | **checked**                            |                                                             |                                                 |
 * | `--color-unchecked`                    | Cor quando não selecionado                                  | `var(--color-neutral-light-00)`                 |
 * | `--color-checked`                      | Cor quando selecionado                                      | `var(--color-action-default)`                   |
 * | **Disabled**                           |                                                             |                                                 |
 * | `--color-unchecked-disabled`           | Cor pricipal quando não selecionado no estado disabled      | `var(--color-neutral-light-30)`                 |
 * | `--color-checked-disabled`             | Cor pricipal quando selecionado no estado disabled          | `var(--color-neutral-dark-70)`                  |
 *
 */

@Directive()
export abstract class PoRadioGroupBaseComponent implements ControlValueAccessor, Validator {
  // Propriedade interna que define se o ícone de ajuda adicional terá cursor clicável (evento) ou padrão (tooltip).
  @Input() additionalHelpEventTrigger: string | undefined;

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
  compactLabel = input<boolean, unknown>(false, { alias: 'p-compact-label', transform: convertToBoolean });

  /** Nome das opções. */
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

  /**
   * @optional
   *
   * @description
   *
   * Exibe a mensagem setada se o campo estiver vazio e for requerido.
   *
   * > Necessário que a propriedade `p-required` esteja habilitada.
   *
   */
  @Input('p-field-error-message') fieldErrorMessage: string;

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
   * Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`.
   * > Para mais informações acesse: https://po-ui.io/documentation/po-helper.
   *
   * > Ao configurar esta propriedade, o antigo ícone de ajuda adicional (`p-additional-help-tooltip` e `p-additional-help`) será ignorado.
   */
  poHelperComponent = input<PoHelperOptions | string>(undefined, { alias: 'p-helper' });

  /**
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
   * Evento ao alterar valor do campo.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
   * Retorna um objeto `KeyboardEvent` com informações sobre a tecla.
   */
  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  displayAdditionalHelp: boolean = false;
  mdColumns: number = poRadioGroupColumnsDefaultLength;
  value: any;

  protected cd = inject(ChangeDetectorRef);
  protected onTouched: any = null;

  private _columns: number = poRadioGroupColumnsDefaultLength;
  private _disabled?: boolean = false;
  private _options: Array<PoRadioGroupOption>;
  private _required?: boolean = false;
  private _size?: string = undefined;
  private _initialSize?: string = undefined;
  private onChangePropagate: any = null;
  private validatorChange;

  /**
   * @optional
   *
   * @description
   *
   * Define a quantidade de colunas para exibição das opções.
   *
   * **Considerações:**
   *  - É possível exibir as opções entre `1` e `4` colunas.
   *  - O número máximo de colunas é invariável nas seguintes resoluções:
   *    + `sm`: `1`
   *    + `md`: `2`
   *
   * @default `2`
   */
  @Input('p-columns') set columns(value: number) {
    const columns = PoUtils.convertToInt(value, poRadioGroupColumnsDefaultLength);

    this._columns = this.getGridSystemColumns(columns, 4);
    this.mdColumns = this.getGridSystemColumns(columns, 2);
  }

  get columns() {
    return this._columns;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(disabled: boolean) {
    this._disabled = convertToBoolean(disabled);

    this.validateModel();
  }

  get disabled() {
    return this._disabled;
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
  @Input('p-required') set required(required: boolean) {
    this._required = convertToBoolean(required);

    this.validateModel();
  }

  get required() {
    return this._required;
  }

  /**
   * Define se a indicação de campo obrigatório será exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  @Input('p-show-required') showRequired: boolean = false;

  /**
   * Lista de opções que serão exibidas.
   * Nesta propriedade deve ser definido um array de objetos que implementam a interface PoRadioGroupOption.
   */
  @Input('p-options') set options(value: Array<PoRadioGroupOption>) {
    this._options = value;
    removeDuplicatedOptions(this.options);
  }
  get options() {
    return this._options;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos radios do componente:
   * - `small`: 16x16 (disponível apenas para acessibilidade AA).
   * - `medium`: 24x24.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   *
   */
  set size(value: string) {
    this._initialSize = value;
    this.applySizeBasedOnA11y();
  }

  @Input('p-size')
  @HostBinding('attr.p-size')
  get size(): string {
    return this._size ?? getDefaultSizeFn(PoRadioSize);
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  // Função que controla quando deve ser emitido onChange e atualiza o Model
  changeValue(changedValue: any) {
    if (this.onChangePropagate) {
      this.onChangePropagate(changedValue);
    }

    if (this.value !== changedValue) {
      this.change.emit(changedValue);
    }

    this.value = changedValue;
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any) {
    this.onChangePropagate = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: any) {
    this.validatorChange = fn;
  }

  validate(abstractControl: AbstractControl): { [key: string]: any } {
    if (PoValidators.requiredFailed(this.required, this.disabled, abstractControl.value)) {
      return {
        required: {
          valid: false
        }
      };
    }
  }

  writeValue(modelValue: any) {
    this.value = modelValue;

    // Busca radio com o valor especificado
    const element = this.getElementByValue(modelValue);
    if (!element && this.onChangePropagate) {
      this.value = undefined;
      this.onChangePropagate(this.value);
    }
  }

  private checkColumnsRange(columns, maxColumns): boolean {
    const minColumns = 1;

    return columns >= minColumns && columns <= maxColumns;
  }

  private getGridSystemColumns(columns: number, maxColumns: number): number {
    const gridSystemColumns = poRadioGroupColumnsTotalLength / columns;

    return this.checkColumnsRange(columns, maxColumns) ? gridSystemColumns : poRadioGroupColumnsDefaultLength;
  }

  private validateModel() {
    if (this.validatorChange) {
      this.validatorChange();
    }
  }

  private applySizeBasedOnA11y(): void {
    const size = validateSizeFn(this._initialSize, PoRadioSize);
    this._size = size;
  }

  // Deve retornar o valor elemento que contém o valor passado por parâmetro
  abstract getElementByValue(value: any): any;
}
