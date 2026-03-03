import { ChangeDetectorRef, Component, EventEmitter, input, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { convertToBoolean, getDefaultSizeFn, uuid, validateSizeFn } from './../../../utils/util';
import { PoCheckboxSize } from './enums/po-checkbox-size.enum';
import { PoHelperOptions } from '../../po-helper';

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
 * | `--field-container-title-justify`      | Alinhamento horizontal do título (`justify-content`)         | `space-between`                                 |
 * | `--field-container-title-flex`         | Flex do título (`flex`)                                      | `1 auto`                                        |
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
@Component({
  selector: 'po-checkbox-base',
  template: '',
  standalone: false
})
export abstract class PoCheckboxBaseComponent implements ControlValueAccessor {
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
   * Define que o popover (`p-helper`) será incluído no body da página e não dentro do componente. Essa
   * opção pode ser necessária em cenários com containers que possuem scroll ou overflow escondido, garantindo o
   * posicionamento correto do tooltip próximo ao elemento.
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
  compactLabel = input<boolean>(false, { alias: 'p-compact-label' });

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
    this._size = validateSizeFn(value, PoCheckboxSize);
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

  get size(): string {
    return this._size ?? getDefaultSizeFn(PoCheckboxSize);
  }

  constructor(private readonly cd: ChangeDetectorRef) {}

  changeValue() {
    if (this.propagateChange) {
      this.propagateChange(this.checkboxValue);
    }

    this.change.emit(this.checkboxValue);
  }

  checkOption(event: any, value: boolean | null | string) {
    const target = event.target as HTMLElement;

    if (target.closest('po-helper')) {
      return;
    }

    if (!this.disabled) {
      value === 'mixed' ? this.changeModelValue(true) : this.changeModelValue(!value);
      this.changeValue();
    }
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.cd.markForCheck();
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
