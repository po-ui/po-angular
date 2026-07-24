import { Directive, input, output } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoDashboardCard } from './interfaces/po-dashboard-card.interface';
import { PoDashboardReorderEvent } from './interfaces/po-dashboard-reorder-event.interface';

/**
 * @description
 *
 * O componente `po-dashboard` é um container de grid automático para exibição de cards (`po-widget`)
 * na home de uma aplicação.
 *
 * Ele gerencia o layout responsivo e o comportamento de arrastar e soltar (*drag and drop*) dos cards,
 * liberando o consumidor da responsabilidade de controlar essas interações.
 *
 * #### Como funciona
 *
 * O layout é baseado em CSS Grid com `grid-auto-flow: row dense` ativo por padrão, o que garante
 * que os cards preencham os espaços disponíveis automaticamente, evitando buracos no grid.
 *
 * A quantidade de colunas varia por breakpoint:
 * - `xs`: 1 coluna (até 850px)
 * - `sm`: 2 colunas (a partir de 850px)
 * - `md`: 3 colunas (a partir de 1366px)
 * - `lg`: 4 colunas (a partir de 1650px)
 * - `xl`: 5 colunas (a partir de 2110px)
 *
 * #### Tamanho dos cards
 *
 * O tamanho de cada card é definido pela propriedade `displaySize` da interface `PoDashboardCard`:
 * - `extrasmall`: 1 coluna × 1 linha
 * - `small`: 1 coluna × 2 linhas
 * - `medium`: 2 colunas × 2 linhas
 * - `large`: 3 colunas × 2 linhas
 * - `extralarge`: 4 colunas × 2 linhas
 *
 * #### Drag and drop
 *
 * Quando `p-draggable` está ativo, o usuário pode reordenar os cards arrastando-os.
 * O evento `p-cards-reorder` é emitido com a nova lista ordenada sempre que a posição de um card muda.
 * O consumidor deve atualizar o array de cards com o valor recebido no evento para persistir a nova ordem.
 *
 * #### Boas práticas
 *
 * - Sempre defina um `id` único para cada card para garantir rastreabilidade após reordenações.
 * - Utilize a propriedade `displaySize` para controlar o espaço visual de cada card no grid.
 * - Mantenha o array de cards como fonte de verdade e atualize-o ao receber o evento `p-cards-reorder`.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                      | Descrição                                      | Valor Padrão               |
 * |----------------------------------|------------------------------------------------|----------------------------|
 * | `--row-height`                   | Altura automática de cada linha do grid        | `10.8rem`                  |
 * | `--gap`                          | Espaçamento entre os cards                     | `var(--spacing-sm)`        |
 */
@Directive()
export class PoDashboardBaseComponent {
  /**
   * @description
   *
   * Lista de cards a serem exibidos no dashboard.
   * Cada item deve seguir a interface `PoDashboardCard`.
   */
  cards = input<Array<PoDashboardCard>>([], { alias: 'p-cards' });

  /**
   * @optional
   *
   * @description
   *
   * Habilita o comportamento de arrastar e soltar (*drag and drop*) nos cards do dashboard.
   * Quando ativo, o usuário pode reordenar os cards arrastando-os para novas posições.
   *
   * > Ao mover um card, o evento `p-cards-reorder` é emitido com a nova lista ordenada.
   *
   * @default `false`
   */
  draggable = input<boolean, unknown>(false, { alias: 'p-draggable', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Evento emitido após o usuário reordenar os cards via drag and drop.
   * O valor emitido é um objeto `PoDashboardReorderEvent` contendo a nova lista de cards
   * na ordem em que foram posicionados.
   *
   * O consumidor deve atualizar o array de cards com o valor recebido para persistir a nova ordem:
   *
   * ```html
   * <po-dashboard
   *   [p-cards]="cards"
   *   p-draggable
   *   (p-cards-reorder)="cards = $event.cards">
   * </po-dashboard>
   * ```
   */
  cardsReorder = output<PoDashboardReorderEvent>({ alias: 'p-cards-reorder' });
}
