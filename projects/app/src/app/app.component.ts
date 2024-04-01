import { Component, Injector } from '@angular/core';
import { PoIconComponent, PoIconService } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  icon: any;

  constructor(
    public iconsService: PoIconService
  ) {
    this.icon = this.iconsService.icons.address_book
  }
}
