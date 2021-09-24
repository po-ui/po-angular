import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoCustomAreaService, PoPageAction } from '../../../../ui/src/lib';

export interface DataExample {
  name?: string;
  age?: string;
  personType?: string;
  email?: string;
  corporate?: string;
  cpf?: string;
  cnpj?: string;
  registration?: string;
}

@Component({
  selector: 'app-final-form',
  templateUrl: './final-form.component.html',
  styles: []
})
export class FinalFormComponent implements OnInit, OnDestroy {
  eventInput = { emitValue: this.updateFields.bind(this) };
  customUrl = 'http://localhost:3000/custom';
  fields = [
    { property: 'name', label: 'Name', placeholder: 'Insert your name' },
    { property: 'age', label: 'Age', placeholder: 'Insert your age' },
    {
      property: 'personType',
      label: 'Person Type',
      options: [
        { label: 'Physical', value: 'CPF' },
        { label: 'Legal', value: 'CNPJ' }
      ],
      validate: this.onFieldChanges.bind(this)
    },
    { property: 'corporate', label: 'Corporate Name', placeholder: 'Set your corporate name', disabled: false },
    { property: 'email', label: 'E-mail', visible: false },
    { property: 'cpf', label: 'CPF', visible: false },
    { property: 'cnpj', label: 'CNPJ', visible: false },
    { property: 'registration', label: 'State Registration', visible: false }
  ];
  values: DataExample = {};
  teste = {
    name: 'teste',
    disabled: false,
    value: '',
    placeholder: 'placholder do teste',
    label: 'label do teste'
  };

  actions: Array<PoPageAction> = [{ label: 'Save', action: this.saveData.bind(this) }];

  private apiSubs: Subscription;

  constructor(private http: HttpClient, private service: PoCustomAreaService) {}

  ngOnInit(): void {
    const personType = 'CPF';
    this.values = { personType, ...this.values };
  }

  ngOnDestroy(): void {
    this.apiSubs?.unsubscribe();
  }

  onFieldChanges(changeValue) {
    console.log(changeValue);
    if (changeValue.value === 'CNPJ') {
      delete this.values?.email;
      delete this.values?.cpf;
    }
    if (changeValue.value === 'CPF') {
      console.log('delete coprporate');
      delete this.values?.corporate;
      delete this.values?.registration;
      delete this.values?.cnpj;
    }
  }

  updateFields(event) {
    const { detail } = event;
    console.log('detail', detail);
    // this.values = { ...this.values, ...detail};
    this.teste = { ...this.teste, ...detail[0] };
  }

  clearData() {
    this.values = {
      name: '',
      age: '',
      personType: 'CPF',
      email: '',
      corporate: '',
      cpf: '',
      cnpj: '',
      registration: ''
    };
  }

  saveData(event) {
    console.log('saveData', this.values);
    console.log(event);
    const { age, name, personType, corporate, email, cnpj, cpf, registration } = this.values;
    const detailed = email ? `, Email: ${email}` : corporate ? `, Corporate Name: ${corporate}` : '';
    const success = `{
      "_messages": [
        {
            "code": "200",
            "message": "${name}'s data was successfully saved",
            "detailedMessage": "How did you choose ${personType} the saved data were: Name: ${name}, Age: ${age}${detailed}.",
            "type": "success",
            "helpUrl": ""
        }
      ]
    }`;
    const headers = {};
    const body = JSON.parse(success);

    this.apiSubs = this.http.post('https://po-sample-api.herokuapp.com/v1/messages', body, { headers }).subscribe(
      () => this.service.notifyAll({ ...this.values }),
      err => console.error(err),
      () => this.clearData()
    );
  }
}
