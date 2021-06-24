import { Input, Directive, TemplateRef } from '@angular/core';

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
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-toolbar p-actions-icon="po-icon-user" [p-actions]="actions"></po-toolbar>
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * <po-toolbar p-actions-icon="far fa-comment-alt" [p-actions]="actions"></po-toolbar>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-toolbar [p-actions-icon]="template" [p-actions]="actions"></po-toolbar>
   *
   * <ng-template #template>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   *
   * > Caso não haja ações definidas em `p-actions`, o ícone não será exibido.
   *
   * @default `po-icon-more`
   */
  @Input('p-actions-icon') actionsIcon?: string | TemplateRef<void>;

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

  private _notificationNumber?: number;

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
