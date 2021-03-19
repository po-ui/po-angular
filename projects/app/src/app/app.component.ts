import { Component } from '@angular/core';
import { PoPageDynamicTableActions } from 'projects/templates/src/lib';
import { PoBreadcrumb } from '@po-ui/ng-components/lib';
import { PoMenuItem } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  readonly menus: Array<PoMenuItem> = [
    { label: 'Cliente', link: '/cliente' },
    { label: 'Teste', link: '/teste' }
  ];
}
