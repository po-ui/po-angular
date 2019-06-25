import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-i18n-pipe-labs',
  templateUrl: './sample-po-i18n-pipe-labs.component.html'
})
export class SamplePoI18nPipeLabsComponent {
  literal: string = 'Olá {name}, seja bem vindo e tenha um {greeting}!';
  parameters: string = 'Yoda,bom dia';
  parameterArray: Array<any> = ['Yoda', 'bom dia'];

  onChange() {
    this.parameterArray = this.parameters.trim() ? this.parameters.split(',') : [];
  }
}
