import { Component, OnInit } from '@angular/core';
import { PoCustomAreaService, PoDynamicFormField } from '../../../../ui/src/lib';

@Component({
  // selector: 'app-table',
  templateUrl: './table.component.html',
  styles: []
})
export class TableComponent implements OnInit {
  teste: string;
  eventButton = { emitValue: this.sendNotify.bind(this) };
  resultado = {
    resultado: {
      name: 'result',
      disabled: 'true',
      value: 'francisco',
      placeholder: 'Resultado',
      label: 'Resultado',
      action: () => {}
    },
    select: {
      name: 'select',
      value: undefined
    }
  };
  value: any;
  url = 'http://localhost:3000/custom';
  fields: Array<PoDynamicFormField> = [
    { property: 'id', label: 'id', placeholder: 'id' },
    { property: 'name', label: 'name', placeholder: 'name' },
    { property: 'nickname', label: 'nickname', placeholder: 'nickname' },
    { property: 'email', label: 'email', placeholder: 'email' }
  ];
  constructor(private poCustomAreaService: PoCustomAreaService) {}

  ngOnInit(): void {}

  send(event) {
    console.log('event', event.detail);
    // const { value } = event.detail;
    this.value = event.detail;
    console.log('rels', this.resultado);
  }

  sendNotify() {
    this.teste = 'bruno';
    console.log('bruno');

    this.poCustomAreaService.notifyAll({ teste: 'brums' });
  }
}
