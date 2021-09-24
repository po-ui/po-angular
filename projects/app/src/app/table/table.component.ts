import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoCustomAreaService, PoDynamicFormField } from '../../../../ui/src/lib';

@Component({
  // selector: 'app-table',
  templateUrl: './table.component.html',
  styles: []
})
export class TableComponent implements OnInit, OnDestroy {
  teste: string;
  eventInput = { emitValue: this.setNotify.bind(this) };
  value: any;
  url = 'http://localhost:3000/custom';
  fields: Array<PoDynamicFormField> = [
    { property: 'name', label: 'Nome', placeholder: 'Digite um nome', disabled: true },
    { property: 'nickname', label: 'Apelido', placeholder: 'Digite um apelido', disabled: true },
    { property: 'email', label: 'Email', placeholder: 'Digite um email', disabled: true }
  ];
  person = {};

  private apiSubscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.apiSubscription) {
      // this.apiSubscription.unsubscribe();
    }
  }

  setNotify(event) {
    console.log('set', event);
    const { value } = event.detail;
    this.teste = 'José';
  }

  setDisabled(data) {
    const { name, email, nickname } = data;
    return !name && !email && !nickname;
  }

  send(event) {
    console.log('event', event.detail);
    // const { value } = event.detail;
    this.value = event.detail;
  }

  sendNotify(data) {
    console.log('sendNotify');
    const { name, email, nickname } = data;
    const success = `{
      "_messages": [
        {
            "code": "200",
            "message": "Os dados de ${name} foram gravados com sucesso",
            "detailedMessage": "Os seguintes dados foram salvos: nome: ${name}, email: ${email} e apelido: ${nickname}",
            "type": "success",
            "helpUrl": ""
        }
      ]
    }`;

    const headers = {};
    const body = JSON.parse(success);

    this.apiSubscription = this.http
      .post('https://po-sample-api.herokuapp.com/v1/messages', body, { headers })
      .subscribe();
  }
}
