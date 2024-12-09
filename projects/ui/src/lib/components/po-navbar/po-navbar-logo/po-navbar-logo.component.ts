import { Component, Input } from '@angular/core';

@Component({
  selector: 'po-navbar-logo',
  templateUrl: './po-navbar-logo.component.html',
  standalone: false
})
export class PoNavbarLogoComponent {
  @Input('p-logo') logo?: string;

  @Input('p-logo-alt') logoAlt?: string;
}
