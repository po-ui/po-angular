import { Component } from '@angular/core';

import { PoDynamicFormField, PoDynamicFormFieldChanged, PoDynamicFormValidation, PoNotificationService } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-dynamic-form-register',
  templateUrl: './sample-po-dynamic-form-register.component.html'
})
export class SamplePoDynamicFormRegisterComponent {

  person = {};

  fields: Array<PoDynamicFormField> = [
    { property: 'name', divider: 'PERSONAL DATA', required: true, minLength: 4, maxLength: 50, gridColumns: 6, gridSmColumns: 12 },
    { property: 'cpf', label: 'CPF', mask: '999.999.999-99', gridColumns: 6, gridSmColumns: 12 },
    { property: 'birthday', type: 'date', gridColumns: 6, gridSmColumns: 12 },
    { property: 'genre', gridColumns: 6, gridSmColumns: 12, options: ['Male', 'Female', 'Other'] },
    { property: 'shortDescription', label: 'Short Description', gridColumns: 12, gridSmColumns: 12, rows: 5 },
    { property: 'secretKey', label: 'Secret Key', gridColumns: 6, secret: true },
    { property: 'email', divider: 'CONTACTS', gridColumns: 6 },
    { property: 'phone', mask: '(99) 99999-9999', gridColumns: 6 },
    { property: 'address', gridColumns: 6 },
    { property: 'addressNumber', label: 'Address number', type: 'number', gridColumns: 6 },
    { property: 'state', gridColumns: 6, options: [
      { label: 'Santa Catarina', value: 1 },
      { label: 'São Paulo', value: 2 },
      { label: 'Rio de Janeiro', value: 3 },
      { label: 'Minas Gerais', value: 4 }
    ]},
    { property: 'city', disabled: true },
    { property: 'entryTime', label: 'Entry time', type: 'time', divider: 'Work data', gridColumns: 6 },
    { property: 'exitTime', label: 'Exit time', type: 'time', gridColumns: 6 },
    { property: 'wage', type: 'currency', gridColumns: 6 },
    {
      property: 'hobbies',
      divider: 'MORE INFO',
      gridColumns: 6,
      gridSmColumns: 12,
      options: ['Soccer', 'Basketball', 'Bike', 'Yoga', 'Travel', 'Run'],
      optionsMulti: true
    },
    {
      property: 'favoriteHero',
      gridColumns: 6,
      gridSmColumns: 12,
      label: 'Favorite Hero',
      searchService: 'https://thf.totvs.com.br/sample/api/comboOption/heroes',
      columns: [ { property: 'nickname', label: 'Hero' }, { property: 'label', label: 'Name' }]
    },
  ];

  constructor(public poNotification: PoNotificationService) { }

  onChangeFields(changedValue: PoDynamicFormFieldChanged): PoDynamicFormValidation {

    if (changedValue.property === 'state') {

      return {
        value: { city: undefined},
        fields: [
          { property: 'city', gridColumns: 6, options: this.getCity(changedValue.value.state), disabled: false }
        ]
      };
    }

  }

  private getCity(state: number) {
    switch (state) {
      case 1: {
        return [
          { label: 'Palhoça', value: 5 },
          { label: 'Lages', value: 6 },
          { label: 'Balneário Camboriú', value: 7 },
          { label: 'Brusque', value: 8 },
        ];
      }
      case 2: {
        return [
          { label: 'São Paulo', value: 9 },
          { label: 'Guarulhos', value: 10 },
          { label: 'Campinas', value: 11 },
          { label: 'São Bernardo do Campo', value: 12 }
        ];
      }
      case 3: {
        return [
          { label: 'Rio de Janeiro', value: 13 },
          { label: 'São Gonçalo', value: 14 },
          { label: 'Duque de Caxias', value: 15 },
          { label: 'Nova Iguaçu', value: 16 }
        ];
      }
      case 4: {
        return [
          { label: 'Belo Horizonte', value: 17 },
          { label: 'Uberlândia', value: 18 },
          { label: 'Contagem', value: 19 },
          { label: 'Juiz de Fora', value: 20 }
        ];
      }
    }
    return [];
  }

}
