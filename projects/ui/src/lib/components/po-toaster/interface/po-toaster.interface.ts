import { PoNotification } from '../../../services/po-notification';
import { PoToasterType } from '../enum/po-toaster-type.enum';

// Define as propriedades de um toaster.
export interface PoToaster extends PoNotification {
  /** Referência do componente toaster. */
  componentRef?: any;

  /** Posição onde a notificação aparecerá na tela. */
  position: number;

  /** Tipo de notificação. */
  type: PoToasterType;
}
