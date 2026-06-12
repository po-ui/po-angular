import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'po-navbar-item-navigation',
  templateUrl: './po-navbar-item-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PoNavbarItemNavigationComponent {
  @Input('p-disable-left') disableLeft: boolean;

  @Input('p-disable-right') disableRight: boolean;

  @Output('p-click') click: EventEmitter<any> = new EventEmitter<any>();
}
