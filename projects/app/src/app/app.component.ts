import { Component } from '@angular/core';
import { PoMenuItem, PoMultiselectOption } from '../../../ui/src/lib';
import { AdapterService, RetornoInfoClienteReturn } from './service/adapter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  multiselect: Array<string> = [];
  counter: number = 0;
  readonly menus: Array<PoMenuItem> = [{ label: 'Home', action: this.onClick.bind(this) }];

  options: Array<PoMultiselectOption> = [
    { value: 'poMultiselect1', label: 'PO Multiselect 1' },
    { value: 'poMultiselect2', label: 'PO Multiselect 2' },
    { value: 'poMultiselect3', label: 'PO Multiselect 3' },
    { value: 'poMultiselect4', label: 'PO Multiselect 4' },
    { value: 'poMultiselect5', label: 'PO Multiselect 5' },
    { value: 'poMultiselect6', label: 'PO Multiselect 6' }
  ];

  constructor(public pfsListaClientesService: AdapterService) {}

  onClick() {
    this.counter = 0;
    console.log('Counter:', this.counter);
  }

  onChangeMultiSelect(event: any): void {
    // console.log(event.length)
    // // console.table(event);
    this.counter++;
    console.log('onChangeMultiSelect', this.counter);
  }

  changeCliente(event: RetornoInfoClienteReturn) {
    console.log('changeCliente', event);
  }

  changeModel(teste: any) {
    console.log('changeModel', teste);
  }
}
