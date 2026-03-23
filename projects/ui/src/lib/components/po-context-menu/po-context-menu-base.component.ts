import { Directive, input, model, output } from '@angular/core';

import { PoContextMenuItem } from './po-context-menu-item.interface';

/**
 * @description
 *
 * O componente `po-context-menu` e uma barra lateral de contexto (sidebar) para navegacao interna de modulos.
 * Inspirado visualmente no `po-menu`, porem independente e focado em navegacao contextual.
 *
 * Quando estiver sendo utilizado o componente po-page-default, ambos devem estar no mesmo nível
 * e inseridos em uma div com a classe **po-context-menu-wrapper**.
 * Esta classe será responsável por fazer os cálculos necessários de alinhamento dos componentes.
 *
 * #### Tokens customizaveis
 *
 * E possivel alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informacoes, acesse o guia [Personalizando o Tema Padrao com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descricao                                                    | Valor Padrao                                    |
 * |----------------------------------------|--------------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                              |                                                 |
 * | `--font-family`                        | Familia tipografica usada                                    | `var(--font-family-theme)`                      |
 * | `--font-size`                          | Tamanho da fonte dos itens                                   | `var(--font-size-default)`                      |
 * | `--font-size-context-title`            | Tamanho da fonte do titulo de contexto                       | `var(--font-size-sm)`                           |
 * | `--font-size-title`                    | Tamanho da fonte do titulo principal                         | `var(--font-size-lg)`                           |
 * | `--line-height`                        | Altura da linha                                              | `var(--line-height-md)`                         |
 * | `--border-radius`                      | Raio dos cantos dos itens                                    | `var(--border-radius-md)`                       |
 * | `--border-color`                       | Cor da borda lateral direita do componente                   | `var(--color-neutral-light-20)`                 |
 * | `--background-color`                   | Cor de fundo do componente                                   | `var(--color-neutral-light-05)`                 |
 * | `--color`                              | Cor do texto dos itens                                       | `var(--color-action-default)`                   |
 * | `--color-context-title`                | Cor do texto do titulo de contexto                           | `var(--color-neutral-mid-40)`                   |
 * | `--color-title`                        | Cor do texto do titulo principal                             | `var(--color-neutral-dark-80)`                  |
 * | `--font-weight`                        | Peso da fonte dos itens                                      | `var(--font-weight-bold)`                       |
 * | `--font-weight-title`                  | Peso da fonte do titulo principal                            | `var(--font-weight-bold)`                       |
 * | `--outline-color-focused`              | Cor do outline no estado de focus                            | `var(--color-action-focus)`                     |
 * | **Hover**                              |                                                              |                                                 |
 * | `--color-hover`                        | Cor do texto no estado hover                                 | `var(--color-brand-01-darkest)`                 |
 * | `--background-color-hover`             | Cor de fundo no estado hover                                 | `var(--color-brand-01-lighter)`                 |
 * | **Pressed**                            |                                                              |                                                 |
 * | `--background-color-pressed`           | Cor de fundo no estado pressed                               | `var(--color-brand-01-light)`                   |
 * | **Active (Selected)**                  |                                                              |                                                 |
 * | `--background-color-actived`           | Cor de fundo do item selecionado                             | `var(--color-brand-01-lightest)`                |
 * | `--color-actived`                      | Cor do texto do item selecionado                             | `var(--color-action-pressed)`                   |
 *
 */
@Directive()
export class PoContextMenuBaseComponent {
  /**
   * Titulo do contexto superior
   */
  contextTitle = input<string>('', { alias: 'p-context-title' });

  /**
   * Titulo principal do menu
   */
  title = input<string>('', { alias: 'p-title' });

  /**
   * Lista de itens para renderizacao.
   *
   * > Ao receber os itens, o componente valida que apenas um item pode ter `selected: true`.
   * > Se mais de um item estiver com `selected: true`, apenas o primeiro sera mantido como selecionado.
   */
  items = input<Array<PoContextMenuItem>>([], { alias: 'p-items' });

  /**
   * Define se o menu estar aberto ou fechado.
   *
   * Suporta two-way binding:
   *
   * ```html
   * <po-context-menu
   *   [(p-expanded)]="expanded"
   * />
   * ```
   *
   * ou
   *
   * ```html
   * <po-context-menu
   *   [(p-expanded)]="expanded"
   *   (p-expandedChange)="handlerExpanded($event)"
   * />
   * ```
   *
   * @default `true`
   */
  expanded = model<boolean>(true, { alias: 'p-expanded' });

  /**
   * Evento emitido ao selecionar um item. Emite o item selecionado.
   */
  itemSelected = output<PoContextMenuItem>({ alias: 'p-item-selected' });
}
