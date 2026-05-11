import { Directive, input, output } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoFilterChipSelectedChange } from './interfaces/po-filter-chip-selected-change.interface';

/**
 * @description
 *
 * O `po-filter-chip` é um componente interativo que representa uma opção de filtro selecionável na forma de chip.
 * O componente exibe um rótulo de texto e suporta três estados visuais: padrão (repouso), hover e selecionado.
 * No estado selecionado, um ícone de check é exibido à esquerda do rótulo.
 *
 * #### Boas práticas
 *
 * - Utilize `labels` curtos e descritivos para os filtros.
 * - Agrupe múltiplos `po-filter-chip` para representar opções de filtragem relacionadas.
 * - Utilize a propriedade `p-disabled` para filtros temporariamente indisponíveis.
 *
 * #### Acessibilidade tratada no componente
 *
 * Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:
 *
 * - O componente possui `role="option"` e `aria-selected` refletindo o estado de seleção. [W3C WAI-ARIA 3.14 Listbox](https://www.w3.org/WAI/ARIA/apg/#listbox)
 * - Quando em foco, o chip é ativado usando as teclas de Espaço e Enter do teclado. [W3C WAI-ARIA 3.5 Button - Keyboard Interaction](https://www.w3.org/WAI/ARIA/apg/#keyboard-interaction-3)
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                    | Descrição                                          | Valor Padrão                                |
 * |--------------------------------|----------------------------------------------------|---------------------------------------------|
 * | `--border-radius`              | Raio dos cantos do elemento                        | `var(--border-radius-lg)`                   |
 * | `--border-width`               | Largura da borda                                   | `var(--border-width-sm)`                    |
 * | `--font-family`                | Família tipográfica                                | `var(--font-family-theme)`                  |
 * | `--font-size`                  | Tamanho da fonte                                   | `var(--font-size-default)`                  |
 * | `--font-weight`                | Peso da fonte                                      | `var(--font-weight-normal)`                 |
 * | **Default**                    |                                                    |                                             |
 * | `--border-color`               | Cor da borda no estado padrão                      | `var(--color-neutral-light-20)`             |
 * | `--text-color`                 | Cor do texto no estado padrão                      | `var(--color-neutral-dark-80)`              |
 * | `--background-color`           | Cor de fundo no estado padrão                      | `transparent`                               |
 * | **Hover**                      |                                                    |                                             |
 * | `--background-color-hover`     | Cor de fundo no estado hover                       | `var(--color-brand-01-lightest)`            |
 * | `--text-color-hover`           | Cor do texto no estado hover                       | `var(--color-action-default)`               |
 * | **Selected**                   |                                                    |                                             |
 * | `--background-color-selected`  | Cor de fundo no estado selecionado                 | `var(--color-brand-01-lightest)`            |
 * | `--border-color-selected`      | Cor da borda no estado selecionado                 | `var(--color-brand-01-lighter)`             |
 * | `--text-color-selected`        | Cor do texto no estado selecionado                 | `var(--color-action-default)`               |
 * | `--icon-color-selected`        | Cor do ícone no estado selecionado                 | `var(--color-action-default)`               |
 * | **Disabled**                   |                                                    |                                             |
 * | `--opacity-disabled`           | Opacidade no estado desabilitado                   | `0.5`                                       |
 *
 */
@Directive()
export class PoFilterChipBaseComponent {
  /**
   * @optional
   *
   * @description
   *
   * Define se o chip está desabilitado, impedindo qualquer interação do usuário.
   *
   * Quando habilitado, o chip não responde a cliques nem a eventos de teclado (Enter/Space).
   *
   * @default `false`
   */
  disabled = input<boolean, unknown>(false, { alias: 'p-disabled', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Define o rótulo de texto exibido no chip.
   */
  label = input<string | undefined>(undefined, { alias: 'p-label' });

  /**
   * @optional
   *
   * @description
   *
   * Define o estado de seleção do chip.
   *
   * @default `false`
   */
  selected = input<boolean, unknown>(false, { alias: 'p-selected', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado após a alteração do estado de seleção do *chip*. Retorna o objeto PoFilterChipSelectedChange
   * modificado.
   */
  selectedChange = output<PoFilterChipSelectedChange>({ alias: 'p-selected-change' });
}
