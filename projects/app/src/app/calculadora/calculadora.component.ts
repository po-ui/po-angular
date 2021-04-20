import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styles: []
})
export class CalculadoraComponent {
  eventButton = { calculate: this.send.bind(this) };
  resultado = {
    name: 'resultado',
    disabled: true,
    value: '',
    placeholder: 'Resultado',
    label: 'Resultado',
    action: () => {}
  };
  url = 'http://localhost:3000/custom';
  constructor() {}

  send(event) {
    console.log('event', event.detail);
    // const { value } = event.detail;
    this.resultado = event.detail;
  }

  save() {
    console.log('save');
  }

  newSave() {
    console.log('new save');
  }

  cancel() {
    console.log('cancel');
  }
}
