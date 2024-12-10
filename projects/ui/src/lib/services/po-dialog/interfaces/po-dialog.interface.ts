import { PoDialogAlertLiterals } from './po-dialog-alert-literals.interface';
import { PoDialogConfirmLiterals } from './po-dialog-confirm-literals.interface';

/**
 * @docsPrivate
 *
 * @usedBy PoDialogService
 *
 * @description
 *
 * Interface para o título e a mensagem do serviço po-dialog.
 */
export interface PoDialogOptions {
  /** Título da caixa de diálogo. */
  title: string;

  /** Mensagem da caixa de diálogo.
   * > Pode-se informar um conteúdo HTML na mensagem.
   */
  message: string;

  /**
   * Define o tamanho dos componentes de formulário no dialog:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  componentsSize?: string;
}

/**
 * @usedBy PoDialogService
 *
 * @docsExtends PoDialogOptions
 *
 * @description
 *
 * Interface com as propriedades da caixa de diálogo de alerta do serviço po-dialog.
 */
export interface PoDialogAlertOptions extends PoDialogOptions {
  /** Ação executada ao fechar o alerta pelo botão "Ok". */
  ok?: Function;

  /**
   * Objeto com as literais usadas no `po-dialog` do tipo alerta.
   *
   * Para customizar o *label*, pode ser enviado o objeto da seguinte forma:
   *
   * ```typescript
   * this.poDialog.alert({
   *   literals: { ok: 'Close' },
   *   title: 'Info message',
   *   message: 'Message body dialog'
   * });
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do *browser* (pt, en, es).
   */
  literals?: PoDialogAlertLiterals;
}

/**
 * @usedBy PoDialogService
 *
 * @docsExtends PoDialogOptions
 *
 * @description
 *
 * Interface com as propriedades da caixa de diálogo de confirmação do serviço po-dialog.
 */
export interface PoDialogConfirmOptions extends PoDialogOptions {
  /** Ação de confirmação da caixa de diálogo. */
  confirm: Function;

  /** Ação de cancelamento da caixa de diálogo. */
  cancel?: Function;

  /** Ação de fechamento da caixa de diálogo. */
  close?: Function;

  /**
   * Objeto com as literais usadas no `po-dialog` do tipo confirmação.
   *
   * Para customizar os *labels*, pode ser enviado o objeto da seguinte forma:
   *
   * ```typescript
   * this.poDialog.confirm({
   *   literals: { cancel: 'No', confirm: 'Yes' },
   *   title: 'Confirm',
   *   message: 'Message body dialog',
   *   confirm: () => this.confirmOperation()
   * });
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do *browser* (pt, en, es).
   */
  literals?: PoDialogConfirmLiterals;
}
