import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'po-navbar-item-navigation-icon',
  templateUrl: './po-navbar-item-navigation-icon.component.html'
})
export class PoNavbarItemNavigationIconComponent {
  @Input('p-disabled') disabled: boolean;

  @Input('p-icon') icon: boolean;

  @Output('p-click') click: EventEmitter<any> = new EventEmitter<any>();
}
