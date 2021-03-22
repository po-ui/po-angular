import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoCustomAreaService, PoRadioGroupOption } from '../../../../ui/src/lib';

@Component({
  templateUrl: './teste.component.html'
})
export class TesteComponent {
  constructor(private poCustomAreaService: PoCustomAreaService) {}
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
  eventInput = { emitValue: this.setCNPJ.bind(this) };

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
    this.poCustomAreaService.notifyAll({ personType });
  }

  toggle(event) {
    console.log(event);
    this.open = event.detail.show;
  }
}
