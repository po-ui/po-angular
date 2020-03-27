import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-clean-labs',
  templateUrl: './sample-po-clean-labs.component.html'
})
export class SamplePoCleanLabsComponent {
  fieldValue: string;
  website: string;
  email: string;
  password: string;
  date: Date;
  age: number;

  constructor() {
    this.fieldValue = 'Texto Padrão';
    this.website = 'www.po-ui.com.br';
    this.email = 'contato@po-ui.com.br';
    this.password = '12345';
    this.date = new Date();
    this.age = 0;
  }
}
