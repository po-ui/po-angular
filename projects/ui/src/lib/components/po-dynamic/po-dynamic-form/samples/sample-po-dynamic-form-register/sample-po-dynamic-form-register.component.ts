import { Component, OnInit } from '@angular/core';

import {
  PoDynamicFormField,
  PoDynamicFormFieldChanged,
  PoDynamicFormValidation,
  PoNotificationService
} from '@po-ui/ng-components';
import { PoDynamicFormRegisterService } from './sample-po-dynamic-form-register.service';

@Component({
  selector: 'sample-po-dynamic-form-register',
  templateUrl: './sample-po-dynamic-form-register.component.html',
  providers: [PoDynamicFormRegisterService]
})
export class SamplePoDynamicFormRegisterComponent implements OnInit {
  person = {};
  validateFields: Array<string> = ['state'];

  fields: Array<PoDynamicFormField> = [
    {
      property: 'name',
      divider: 'PERSONAL DATA',
      required: true,
      minLength: 4,
      maxLength: 50,
      gridColumns: 6,
      gridSmColumns: 12,
      order: 1
    },
    {
      property: 'birthday',
      label: 'Date of birth',
      type: 'date',
      format: 'mm/dd/yyyy',
      gridColumns: 6,
      gridSmColumns: 12,
      maxValue: '2010-01-01',
      errorMessage: 'The date must be before the year 2010.',
      order: -1
    },
    { property: 'cpf', label: 'CPF', mask: '999.999.999-99', gridColumns: 6, gridSmColumns: 12, visible: false },
    { property: 'cnpj', label: 'CNPJ', mask: '99.999.999/9999-99', gridColumns: 6, gridSmColumns: 12, visible: false },
    { property: 'genre', gridColumns: 6, gridSmColumns: 12, options: ['Male', 'Female', 'Other'], order: 2 },
    { property: 'shortDescription', label: 'Short Description', gridColumns: 12, gridSmColumns: 12, rows: 5 },
    {
      property: 'secretKey',
      label: 'Secret Key',
      gridColumns: 6,
      secret: true,
      pattern: '[a-zA]{5}[Z0-9]{3}',
      errorMessage: 'At least 5 alphabetic and 3 numeric characters are required.'
    },
    { property: 'email', divider: 'CONTACTS', gridColumns: 6, icon: 'po-icon-mail' },
    { property: 'phone', mask: '(99) 99999-9999', gridColumns: 6 },
    { property: 'address', gridColumns: 6 },
    {
      property: 'addressNumber',
      label: 'Address number',
      type: 'number',
      gridColumns: 6,
      maxValue: 10000,
      errorMessage: 'Invalid number.'
    },
    {
      property: 'state',
      gridColumns: 6,
      options: [
        { label: 'Santa Catarina', value: 1 },
        { label: 'São Paulo', value: 2 },
        { label: 'Rio de Janeiro', value: 3 },
        { label: 'Minas Gerais', value: 4 }
      ]
    },
    { property: 'city', disabled: true, gridColumns: 6 },
    { property: 'entryTime', label: 'Entry time', type: 'time', divider: 'Work data', gridColumns: 6 },
    { property: 'exitTime', label: 'Exit time', type: 'time', gridColumns: 6 },
    {
      property: 'wage',
      type: 'currency',
      gridColumns: 6,
      decimalsLength: 2,
      thousandMaxlength: 7,
      icon: 'po-icon-finance'
    },
    {
      property: 'hobbies',
      divider: 'MORE INFO',
      gridColumns: 6,
      gridSmColumns: 12,
      optional: true,
      options: ['Soccer', 'Basketball', 'Bike', 'Yoga', 'Travel', 'Run'],
      optionsMulti: true
    },
    {
      property: 'favoriteHero',
      gridColumns: 6,
      gridSmColumns: 12,
      label: 'Favorite hero',
      optional: true,
      searchService: 'https://po-sample-api.herokuapp.com/v1/heroes',
      columns: [
        { property: 'nickname', label: 'Hero' },
        { property: 'label', label: 'Name' }
      ],
      format: ['id', 'nickname'],
      fieldLabel: 'nickname',
      fieldValue: 'email'
    }
  ];

  constructor(public poNotification: PoNotificationService, private registerService: PoDynamicFormRegisterService) {}

  ngOnInit() {
    this.person = {
      name: 'Tony Stark',
      birthday: '1970-05-29',
      isJuridicPerson: false
    };
  }

  onChangeFields(changedValue: PoDynamicFormFieldChanged): PoDynamicFormValidation {
    return {
      value: { city: undefined },
      fields: [
        {
          property: 'city',
          gridColumns: 6,
          options: this.registerService.getCity(changedValue.value.state),
          disabled: false
        }
      ]
    };
  }

  onLoadFields(value: any) {
    return this.registerService.getUserDocument(value);
  }
}
