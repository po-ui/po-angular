import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { PoThemeService } from '../../../services';
import { convertToBoolean, getDefaultSize, uuid, validateSize } from './../../../utils/util';
import { PoCheckboxSize } from './enums/po-checkbox-size.enum';

/**
 * @description
 *
 * O componente `po-checkbox` exibe uma caixa de opção com um texto ao lado, na qual é possível marcar e desmarcar através tanto
 * no *click* do *mouse* quanto por meio da tecla *space* quando estiver com foco.
 *
 * Cada opção poderá receber um estado de marcado, desmarcado, indeterminado/mixed e desabilitado, como também uma ação que será disparada quando
 * ocorrer mudanças do valor.
 *
 * > O *model* deste componente aceitará valores igual à `true`, `false` ou `null` para quando for indeterminado/mixed.
 *
 * **Acessibilidade tratada no componente:**
 *
 * Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:
 *
 * - O componente foi desenvolvido utilizando controles padrões HTML para permitir a identificação do mesmo na interface por tecnologias assistivas. [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
 * - A área do foco precisar ter uma espessura de pelo menos 2 pixels CSS e o foco não pode ficar escondido por outros elementos da tela. [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)
 * - A cor não deve ser o único meio para diferenciar o componente do seu estado marcado e desmarcado. [WGAG 1.4.1: Use of Color, 3.2.4: Consistent Identification](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color)
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                                    | Valor Padrão                                    |
 * |----------------------------------------|--------------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                              |                                                 |
 * | `--border-color`                       | Cor da borda                                                 | `var(--color-neutral-dark-70)`                  |
 * | `--color-unchecked`                    | Cor quando não selecionado                                   | `var(--color-neutral-light-00)`                 |
 * | `--color-checked`                      | Cor quando selecionado                                       | `var(--color-action-default)`                   |
 * | **Hover**                              |                                                              |                                                 |
 * | `--color-hover`                        | Cor principal no estado hover                                | `var(--color-action-hover)`                     |
 * | `--shadow-color-hover`                 | Cor da sombra no estado hover                                | `var(--color-brand-01-lighter)`                 |
 * | **Focused**                            |                                                              |                                                 |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                            | `var(--color-action-focus)`                     |
 * | **Disabled**                           |                                                              |                                                 |
 * | `--color-unchecked-disabled` &nbsp;    | Cor pricipal quando não selecionado no estado disabled&nbsp; | `var(--color-action-disabled)`                  |
 * | `--color-checked-disabled` &nbsp;      | Cor pricipal quando selecionado no estado disabled           | `var(--color-neutral-dark-70)`                  |
 *
 */
@Directive()
export abstract class PoCheckboxBaseComponent implements ControlValueAccessor {
  // Propriedade interna que define se o ícone de ajuda adicional terá cursor clicável (evento) ou padrão (tooltip).
  @Input() additionalHelpEventTrigger: string | undefined;

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
   * Define que o tooltip (`p-additional-help-tooltip`) será incluído no body da página e não dentro do componente. Essa
   * opção pode ser necessária em cenários com containers que possuem scroll ou overflow escondido, garantindo o
   * posicionamento correto do tooltip próximo ao elemento.
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
   * Texto de apoio do campo */
  @Input('p-help') help?: string;

  /** Define o nome do *checkbox*. */
  @Input('name') name: string;

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

  /** Texto de exibição do *checkbox*. */
  @Input('p-label') label?: string;

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
   * Evento disparado ao sair do campo.
   */
  @Output('p-blur') blur: EventEmitter<any> = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando o valor do *checkbox* for alterado.
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

  //propriedade interna recebida do checkbox-group para verificar se o checkbox está ativo, inativo ou indeterminate
  @Input('p-checkboxValue') checkboxValue: boolean | null | string;

  //propriedade interna recebida do checkbox-group para verificar se o checkbox é required
  @Input({ alias: 'p-required', transform: convertToBoolean }) checkBoxRequired: boolean;

  //propriedade interna recebida para desabilitar o tabindex do checkbox na utilização dentro de um list-box
  @Input({ alias: 'p-disabled-tabindex', transform: convertToBoolean }) disabladTabindex: boolean = false;

  displayAdditionalHelp: boolean = false;
  id = uuid();
  propagateChange: any;
  onTouched;

  private _disabled?: boolean = false;
  private _size?: string = undefined;

  /**
   * @optional
   *
   * @description
   *
   * Define o estado do *checkbox* como desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = convertToBoolean(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho da caixa de seleção do componente:
   * - `small`: 16x16 (disponível apenas para acessibilidade AA).
   * - `medium`: 24x24.
   * - `large`: 32x32.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   *
   */
  @Input('p-size') set size(value: string) {
    this._size = validateSize(value, this.poThemeService, PoCheckboxSize);
  }

  get size(): string {
    return this._size ?? getDefaultSize(this.poThemeService, PoCheckboxSize);
  }

  constructor(protected poThemeService: PoThemeService) {}

  changeValue() {
    if (this.propagateChange) {
      this.propagateChange(this.checkboxValue);
    }

    this.change.emit(this.checkboxValue);
  }

  checkOption(value: boolean | null | string) {
    if (!this.disabled) {
      value === 'mixed' ? this.changeModelValue(true) : this.changeModelValue(!value);
      this.changeValue();
    }
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    if (value !== this.checkboxValue) {
      this.changeModelValue(value);
    }
  }

  protected abstract changeModelValue(value: boolean | null);
}
