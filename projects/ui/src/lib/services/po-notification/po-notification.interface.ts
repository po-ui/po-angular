import { PoToasterOrientation } from './po-toaster/po-toaster-orientation.enum';

/**
 * @usedBy PoNotificationService
 *
 * @description
 *
 * Interface para uso do serviço PoNotification.
 */
export interface PoNotification {
  /**
   * Ação para a notificação.
   *
   * Ao utilizar esta propriedade em conjunto com a `actionLabel`,
   * a notificação ficará fixa na página até usuário fechá-la ou clicar nesta ação.
   *
   * Caso não informar a propriedade `actionLabel` a ação será atribuida ao ícone de "Fechar" da notificação.
   */
  action?: Function;

  /** Label do botão quando houver uma ação definida. */
  actionLabel?: string;

  /** Mensagem a ser exibida na notificação. */
  message: string;

  /**
   * @description
   *
   * Posição da notificação na página que pode ser ```Top``` (topo) ou ```Bottom```(rodapé). A posição padrão é `bottom`.
   *
   * @default `Bottom`
   */
  orientation?: PoToasterOrientation;

  /**
   * Define em milissegundos o tempo de duração que a notificação ficará disponível em tela. O padrão é 9000 milissegundos.
   *
   * > Caso a notificação tenha uma ação ou seja uma notificação de `erro`, a propriedade será ignorada.
   */
  duration?: number;
}
