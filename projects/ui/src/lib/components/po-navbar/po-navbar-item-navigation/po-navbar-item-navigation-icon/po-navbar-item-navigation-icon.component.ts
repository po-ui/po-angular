import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'po-navbar-item-navigation-icon',
  templateUrl: './po-navbar-item-navigation-icon.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PoNavbarItemNavigationIconComponent {
  @Input('p-disabled') disabled: boolean;

  @Input('p-icon') icon: boolean;

  @Output('p-click') click: EventEmitter<any> = new EventEmitter<any>();
}
