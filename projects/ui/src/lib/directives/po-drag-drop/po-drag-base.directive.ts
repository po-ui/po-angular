import { Directive, output, input } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoDraggableItem, PoDragMovedEvent } from './interfaces/po-draggable-item.interface';

@Directive()
export abstract class PoDragBaseDirective {
  /**
   * @description
   *
   * Dado associado ao item arrastável. O valor é emitido nos eventos
   * `p-drag-started` e `p-drag-ended`.
   */
  data = input<PoDraggableItem>(undefined, { alias: 'p-drag' });

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o arraste do item. Quando `true`, o usuário não pode iniciar
   * um gesto de arrastar neste elemento, mas o item continua participando do
   * cálculo de posições dos vizinhos dentro do `p-drop-list`.
   *
   * @default false
   */
  dragDisabled = input<boolean, unknown>(false, { alias: 'p-drag-disabled', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Evento emitido quando o arraste do item é iniciado.
   * O valor emitido é o dado associado ao item (propriedade `p-drag`).
   */
  dragStarted = output<PoDraggableItem>({ alias: 'p-drag-started' });

  /**
   * @optional
   *
   * @description
   *
   * Evento emitido quando o arraste do item é encerrado.
   * O valor emitido é o dado associado ao item (propriedade `p-drag`).
   */
  dragEnded = output<PoDraggableItem>({ alias: 'p-drag-ended' });

  /**
   * @optional
   *
   * @description
   *
   * Evento emitido continuamente enquanto o item está sendo arrastado.
   * Contém a posição do ponteiro, a distância percorrida e a direção do movimento.
   *
   * > **Atenção:** Este evento é disparado em alta frequência (a cada frame de movimento).
   * > Evite operações custosas no handler ou aplique técnicas de throttle/debounce.
   */
  dragMoved = output<PoDragMovedEvent>({ alias: 'p-drag-moved' });
}
