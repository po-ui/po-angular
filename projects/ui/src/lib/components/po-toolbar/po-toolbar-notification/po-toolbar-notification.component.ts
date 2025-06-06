import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';

import { PoToolbarAction } from '../po-toolbar-action.interface';

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
export class PoToolbarNotificationComponent implements AfterViewInit {
  @ViewChild('notification', { read: ElementRef }) notificationRef: ElementRef;

  @Input('p-notification-actions') notificationActions?: Array<PoToolbarAction>;

  private _notificationNumber?: number = 0;

  @Input('p-notification-number') set notificationNumber(value: number) {
    this._notificationNumber = Number.isInteger(value) ? value : 0;
  }

  get notificationNumber() {
    return this._notificationNumber;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
