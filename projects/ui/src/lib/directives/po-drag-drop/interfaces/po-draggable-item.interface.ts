/**
 * @usedBy PoDropListDirective, PoDragDirective
 *
 * @description
 *
 * Define a estrutura de um item arrastável genérico utilizado pelas diretivas
 * `PoDropListDirective` e `PoDragDirective`.
 *
 * A interface é intencionalmente leve — contém apenas os campos essenciais para
 * qualquer componente arrastável.
 */
export interface PoDraggableItem {
  /** Identificador único do item. */
  id: string;

  /**
   * @optional
   * @description
   *
   * Dados arbitrários do consumidor. Útil para associar informações extras
   * ao item sem estender a interface.
   */
  data?: any;
}

/**
 * @usedBy PoDropListDirective
 *
 * @description
 *
 * Evento emitido quando um item é solto em um container (`p-drop-list`), contendo os índices,
 * o item movido e os identificadores dos containers envolvidos.
 */
export interface PoDropEvent {
  /** Índice original do item antes do drop. */
  previousIndex: number;

  /** Índice final do item após o drop. */
  currentIndex: number;

  /** O item que foi movido. */
  item: PoDraggableItem;

  /**
   * @description
   * Array resultante após o drop, já com a nova ordem aplicada.
   * Use este valor para atualizar o signal ou array do consumidor.
   */
  items: Array<PoDraggableItem>;

  /** Identificador do container de destino. */
  container: string;

  /**
   * @optional
   * @description
   * Identificador do container de origem. Preenchido apenas quando o item
   * foi transferido entre containers distintos.
   */
  previousContainer?: string;

  dropPoint?: any;
}

/**
 * @usedBy PoDropListDirective
 *
 * @description
 *
 * Evento emitido quando um item entra em um container `p-drop-list`.
 */
export interface PoDragEnterEvent<T = any> {
  /** O item que entrou no container. */
  item: T;

  /** Identificador do container que recebeu o item. */
  container: string;
}

/**
 * @usedBy PoDragDirective
 *
 * @description
 *
 * Evento emitido continuamente enquanto o item está sendo arrastado.
 * Contém a posição do ponteiro e a distância percorrida desde o início do arraste.
 */
export { CdkDragMove as PoDragMovedEvent } from '@angular/cdk/drag-drop';
