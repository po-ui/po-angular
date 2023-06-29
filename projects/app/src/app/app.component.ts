import { Component } from '@angular/core';
import { PoTableColumn, PoMultiselectFilter, PoPopupAction, PoMultiselectOption } from '../../../ui/src/lib';

import { SamplePoMultiselectHeroesService } from './sample-po-multiselect-heroes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  multiselect: Array<any> = [];

  options: Array<PoMultiselectOption> = [
    { value: 'poMultiselect1', label: 'PO Multiselect 1' },
    { value: 'poMultiselect2', label: 'PO Multiselect 2' },
    { value: 'poMultiselect3', label: 'PO Multiselect 2' },
    { value: 'poMultiselect4', label: 'PO Multiselect 2' },
    { value: 'poMultiselect5', label: 'PO Multiselect 2' },
    { value: 'poMultiselect6', label: 'PO Multiselect 2' },
    { value: 'poMultiselect7', label: 'PO Multiselect 2' },
    { value: 'poMultiselect8', label: 'PO Multiselect 2' },
    { value: 'poMultiselect9', label: 'PO Multiselect 2' },
    { value: 'poMultiselect10', label: 'PO Multiselect 2' }
  ];

  teste(event?) {
    console.log(event);
  }
}
