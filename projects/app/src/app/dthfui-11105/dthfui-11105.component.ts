import { Component, ViewChild } from '@angular/core';
import { PoMenuItem, PoTableColumn, PoTableComponent } from '@po-ui/ng-components/lib';

@Component({
  selector: 'app-dthfui-11105',
  templateUrl: './dthfui-11105.component.html',
  standalone: false
})
export class Dthfui11105Component {
  readonly menus: Array<PoMenuItem> = [
    { label: 'PoTable', link: '/PoTable' },
    { label: 'PoTableLabs', link: '/PoTableLabs' },
    { label: 'PoDynamic', link: '/PoDynamic' },
    { label: 'PoLookup', link: '/PoLookup' },
    { label: 'PoSample', link: '/PoSample' }
  ];
}
