import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  exemplo2Parameters: Array<any> = [
    {
      property: 'version',
      required: true,
      gridLgColumns: '6',
      gridXlColumns: '6',
      divider: 'Package information'
    },
    {
      property: 'packages',
      label: 'Packages to upgrade',
      optionsMulti: true,
      gridLgColumns: '6',
      gridXlColumns: '6',
      options: [
        {
          'value': 'ui'
        },
        {
          'value': 'templates'
        },
        {
          'value': 'sync'
        },
        {
          'value': 'storage'
        },
        {
          'value': 'code-editor'
        }
      ]
    },
    {
      property: 'user',
      divider: 'NPM Credentials',
      gridXlColumns: '6',
      gridLgColumns: '6'
    },
    {
      property: 'password',
      secret: true,
      gridXlColumns: '6',
      gridLgColumns: '6'
    }
  ];

  //#region Exemplo 3

  dynamicFormExemplo3a!: NgForm;
  dynamicFormExemplo3b!: NgForm;
  parametersFormExemplo3a: Array<any> = [
    {
      property: 'version',
      required: true,
      gridLgColumns: '12',
      gridXlColumns: '12'
    }
  ];
  parametersFormExemplo3b: Array<any> = [
    {
      property: 'packages',
      label: 'Packages to upgrade',
      optionsMulti: true,
      gridLgColumns: '12',
      gridXlColumns: '12',
      required: true,
      options: [
        {
          'value': 'ui'
        },
        {
          'value': 'templates'
        },
        {
          'value': 'sync'
        },
        {
          'value': 'storage'
        },
        {
          'value': 'code-editor'
        }
      ]
    }
  ];

  //#endregion

  items: Array<any> = [
    {
      code: 1200,
      customer: 'Angeloni',
      driver: 'José Oliveira'
    },
    {
      code: 1355,
      customer: 'Giassi',
      driver: 'Francisco Pereira'
    },
    {
      code: 1496,
      customer: 'Walmart',
      driver: 'Pedro da Costa'
    },
    {
      code: 1712,
      customer: 'Carrefour',
      driver: 'João da Silva'
    }
  ];

  selectedTable = true;
  selectedValue = { select: [] };

  getFormExemplo3a(form: NgForm) {
    this.dynamicFormExemplo3a = form;
  }

  getFormExemplo3b(form: NgForm) {
    this.dynamicFormExemplo3b = form;
  }

  selected(value: any) {
    this.selectedValue.select.push(value);
  }
}
