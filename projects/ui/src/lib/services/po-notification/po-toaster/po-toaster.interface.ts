import { PoNotification } from './../po-notification.interface';
import { PoToasterType } from './po-toaster-type.enum';

/**
 * @docsPrivate
 *
 * Interface para os dados do serviço do po-toaster.
 */
export interface PoToaster extends PoNotification {
  /** ID do toaster */
  componentRef?: any;

  /** Posição para notificação aparecer na tela. */
  position: number;

  /** Tipo de notificação. */
  type: PoToasterType;
}
