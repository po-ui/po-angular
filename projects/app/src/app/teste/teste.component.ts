import { Component, OnInit } from '@angular/core';
import { PoRadioGroupOption } from '../../../../ui/src/lib';

@Component({
  templateUrl: './teste.component.html'
})
export class TesteComponent implements OnInit {
  open = false;
  personType: string = 'CPF';
  cnpj = 'aaa';

  url = 'http://localhost:3000/custom';
  buttonCustom = 'pods-button';
  buttonProps = {
    label: 'Botão de Teste'
  };
  classButton = 'po-md-4';
  eventButon = { clickButton: this.toggle.bind(this) };
  slotButton = 'Teste';

  readonly personOptions: Array<PoRadioGroupOption> = [
    { label: 'Jurídica', value: 'CNPJ' },
    { label: 'Física', value: 'CPF' }
  ];

  setCNPJ(event) {
    const { value } = event.detail;
    this.cnpj = value;
  }

  customComponents = [];

  changePerson(personType) {
    //this.notifyAll({ personType });
  }

  toggle(event) {
    console.log(event);
    this.open = event.detail.show;
  }
  ngOnInit(): void {}

  getData(): [string, string, string] {
    return [
      '' + Math.round(Math.random() * 100),
      '' + Math.round(Math.random() * 100),
      '' + Math.round(Math.random() * 100)
    ];
  }

  addDefault(): void {
    //this.add('dashboard-tile', 'content', this.getPropData(), 'po-md-4');
  }

  addExternal(): void {
    //this.externalService.load('external-dashboard-tile').subscribe(() => {
    // this.add('external-dashboard-tile', 'content', this.getPropData(), 'po-md-4 po-mt-1');
    //});
  }

  getPropData() {
    const [a, b, c] = this.getData();
    return { a, b, c };
  }
}
