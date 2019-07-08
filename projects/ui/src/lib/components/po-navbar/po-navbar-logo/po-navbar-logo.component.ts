import { Component, Input } from '@angular/core';

@Component({
  selector: 'po-navbar-logo',
  templateUrl: './po-navbar-logo.component.html'
})
export class PoNavbarLogoComponent {
  @Input('p-logo') logo?: string;
}
