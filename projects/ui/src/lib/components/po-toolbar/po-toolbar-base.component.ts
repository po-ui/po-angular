import { Input, Directive } from '@angular/core';

import { convertToInt } from '../../utils/util';

import { PoToolbarAction } from './po-toolbar-action.interface';
import { PoToolbarProfile } from './po-toolbar-profile/po-toolbar-profile.interface';

/**
 * @description
 *
 * O componente `po-toolbar` é um cabeçalho para o título da aplicação e informações de usuário e notificações quando houver necessidade.
 */
@Directive()
export class PoToolbarBaseComponent {
  private _notificationNumber?: number;

  /**
   * @optional
   *
   * @description
   *
   * Define uma lista de ações que serão exibidas ao clicar no ícone declarado em `p-actions-icon`.
   */
  @Input('p-actions') actions?: Array<PoToolbarAction>;

  /**
   * @optional
   *
   * @description
   *
   * Define um [ícone](/guides/icons) para a propriedade `p-actions`.
   *
   * > Caso não haja ações definidas em `p-actions`, o ícone não será exibido.
   *
   * @default `po-icon-more`
   */
  @Input('p-actions-icon') actionsIcon?: string;

  /** Define o objeto que será o cabeçalho da lista de ações com as informações do perfil. */
  @Input('p-profile') profile?: PoToolbarProfile;

  /** Define uma lista de ações que serão exibidas ao clicar no ícone do perfil. */
  @Input('p-profile-actions') profileActions?: Array<PoToolbarAction>;

  /** Se falso, oculta o ícone de notificações. */
  @Input('p-show-notification') showNotification?: boolean = true;

  /** Título do *toolbar* e aplicação. */
  @Input('p-title') title: string;

  /**
   * @optional
   *
   * @description
   *
   * Lista de ações da notificação.
   */
  @Input('p-notification-actions') notificationActions?: Array<PoToolbarAction>;

  /**
   * @optional
   *
   * @description
   *
   * Número de notificações.
   */
  @Input('p-notification-number') set notificationNumber(value: number) {
    this._notificationNumber = convertToInt(value, 0);
  }

  get notificationNumber(): number {
    return this._notificationNumber;
  }

  get isShowProfile(): boolean {
    return !!(this.profile || this.profileActions);
  }
}
