import { Component } from '@angular/core';
import { PoMultiselectFilter } from '../../../ui/src/lib/components/po-field/po-multiselect/po-multiselect-filter.interface';
import { PoAppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [PoAppService]
})
export class AppComponent {
  options = [{ value: 'value1', label: 'VALUE 1' }];

  opcoes = ['value1'];
  opcoes2; // multiselect com serviço sem valores selecionados por default
  opcoes3 = ['1405833068599', '1495831666871'];

  service: PoMultiselectFilter;

  debounce = 2000;

  constructor(public appService: PoAppService) {
    this.service = appService;
  }
}
