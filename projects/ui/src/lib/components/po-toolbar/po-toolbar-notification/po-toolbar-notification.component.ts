import { Component, ElementRef, input, viewChild } from '@angular/core';

import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';

import { PoToolbarAction } from '../po-toolbar-action.interface';

function toIntegerOrZero(value: unknown): number {
  return Number.isInteger(value) ? (value as number) : 0;
}

/**
 * @docsPrivate
 *
 * @usedBy PoToolbarComponent
 *
 * @description
 *
 * O componente `po-toolbar-notification` tem como objetivo notificar o usuário de novas ações da aplicação que necessitam de atenção,
 * como por exemplo um alerta de nova mensagem.
 *
 * O mesmo também permite que a cada nova notificação seja incrementado e exibido, ou não, este número em uma *tag* ao lado do
 * ícone de notificações.
 */
@Component({
  selector: 'po-toolbar-notification',
  templateUrl: './po-toolbar-notification.component.html',
  providers: [PoControlPositionService],
  standalone: false
})
export class PoToolbarNotificationComponent {
  readonly notificationRef = viewChild('notification', { read: ElementRef });

  readonly notificationActions = input<Array<PoToolbarAction>>(undefined, { alias: 'p-notification-actions' });

  readonly notificationNumber = input<number, unknown>(0, {
    alias: 'p-notification-number',
    transform: toIntegerOrZero
  });
}
