import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'po-navbar-item-navigation',
  templateUrl: './po-navbar-item-navigation.component.html'
})
export class PoNavbarItemNavigationComponent {
  @Input('p-disable-left') disableLeft: boolean;

  @Input('p-disable-right') disableRight: boolean;

  @Output('p-click') click: EventEmitter<any> = new EventEmitter<any>();
}
