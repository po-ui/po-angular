import { PoToasterOrientation } from './po-toaster/po-toaster-orientation.enum';

/**
 * @usedBy PoNotificationService
 *
 * @description
 *
 * Interface para uso do serviço po-notification.
 */
export interface PoNotification {
  /** Ação para a notificação. */
  action?: Function;

  /** Label do botão quando houver uma ação definida. */
  actionLabel?: string;

  /** Mensagem a ser exibida na notificação. */
  message: string;

  /**
   * @description
   *
   * Posição da notificação na página que pode ser ```Top``` (topo) ou ```Bottom```(rodapé).
   *
   * @default `Bottom`
   */
  orientation?: PoToasterOrientation;

  /** Define em milissegundos o tempo de duração que a notificação ficará disponível em tela. */
  duration?: number;
}
