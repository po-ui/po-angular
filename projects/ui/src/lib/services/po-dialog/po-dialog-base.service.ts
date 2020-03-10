import { PoDialogAlertOptions, PoDialogConfirmOptions } from './interfaces/po-dialog.interface';
import { PoDialogType } from './po-dialog.enum';

/**
 * @description
 *
 * O po-dialog é um serviço para exibição de caixas de diálogo, é possível customiza-los passando alguns parâmetros de acordo com a
 * necessidade do desenvolvedor.
 */

export abstract class PoDialogBaseService {
  /** Exibe um diálogo de confirmação, é possível definir ações para as opções de confirmação e cancelamento. */
  confirm(confirmOptions: PoDialogConfirmOptions): void {
    this.openDialog(PoDialogType.Confirm, confirmOptions);
  }

  /** Exibe um diálogo de alerta. */
  alert(alertOptions: PoDialogAlertOptions): void {
    this.openDialog(PoDialogType.Alert, alertOptions);
  }

  // Usado para chamar um diálogo
  abstract openDialog(dialogType: PoDialogType, dialogOptions: PoDialogAlertOptions | PoDialogConfirmOptions): void;
}
