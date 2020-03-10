import { PoToasterOrientation } from './po-toaster-orientation.enum';
import { PoToasterType } from './po-toaster-type.enum';
import { PoToaster } from './po-toaster.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * O componente po-toaster foi construído para exibir notificações para o usuário.
 */
export abstract class PoToasterBaseComponent {
  /** Disponibiliza uma ação para a notificação. */
  action: Function;

  /** Permite alterar o label do botão quando houver uma ação definida. */
  actionLabel: string;

  /** Mensagem a ser exibida na notificação. */
  message: string;

  /** Orientação da notificação, a mesma pode ser exibida na parte superior ou inferior da página. */
  orientation: PoToasterOrientation = PoToasterOrientation.Bottom;

  /** ComponentRef */
  componentRef: any;

  /** Posição para notificação aparecer na tela. */
  position: number;

  /** Tipo de notificação. */
  type: PoToasterType;

  /** Fecha a notificação. */
  abstract close(): void;

  /**
   * Altera a posição da notificação.
   * @param number value
   */
  abstract changePosition(value: number): void;

  /**
   * Configura o componente po-toaster de acordo com as definições do usuário.
   * @param PoToaster poToaster
   * @param ComponentRef comp
   */
  abstract configToaster(poToaster: PoToaster): void;
}
