import { Directive, output, input } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoDragEnterEvent, PoDraggableItem, PoDropEvent } from './interfaces/po-draggable-item.interface';

@Directive()
export abstract class PoDropListBaseDirective {
  /**
   * @description
   *
   * Lista de itens gerenciada pelo container. A diretiva muta este array
   * diretamente ao reordenar ou transferir itens entre containers.
   *
   * O array atualizado é refletido no evento `p-dropped`.
   */
  items = input<Array<PoDraggableItem>>([], { alias: 'p-drop-list' });

  /**
   * @optional
   *
   * @description
   *
   * Identificador único do container. Utilizado para conectar múltiplos
   * containers via `p-drop-list-connected-to`.
   *
   */
  dropListId = input<string>('', { alias: 'p-drop-list-id' });

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o drag para os elementos dentro do container.
   * Quando `true`, seus elementos não poderão ser arrastados, porém elementos de outros containers poderão ser arrastados para dentro dele.
   *
   * @default false
   */
  dropListDisabled = input<boolean, unknown>(false, { alias: 'p-drop-list-disabled', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Lista de containers conectados. Aceita um array de ids (`string`). Quando configurado,
   * itens podem ser arrastados entre os containers listados.
   */
  dropListConnectedTo = input<Array<string>>([], { alias: 'p-drop-list-connected-to' });

  /**
   * @optional
   *
   * @description
   *
   * Orientação dos itens dentro do container. Afeta a lógica de sombra de
   * posicionamento do Angular CDK durante o arraste.
   *
   * Valores aceitos: `'horizontal'` | `'vertical'` | `'mixed'`.
   *
   * @default `'vertical'`
   */
  dropListOrientation = input<'horizontal' | 'vertical' | 'mixed'>('vertical', { alias: 'p-drop-list-orientation' });

  /**
   * @optional
   *
   * @description
   *
   * Evento emitido quando um item é solto dentro deste container.
   * Contém os índices anterior e atual, o item movido e os ids dos
   * containers de origem e destino.
   */
  dropped = output<PoDropEvent>({ alias: 'p-dropped' });

  /**
   * @optional
   *
   * @description
   *
   * Evento emitido quando um item externo entra neste container durante o arraste.
   * Contém o item que entrou e o id do container de origem.
   */
  dragEntered = output<PoDragEnterEvent<PoDraggableItem>>({ alias: 'p-drag-entered' });

  dropSortingDisabled = input<boolean, unknown>(false, {
    alias: 'p-drop-sorting-disabled',
    transform: convertToBoolean
  });
}
