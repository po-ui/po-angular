import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoCustomAreaService, PoTableComponent } from '../../../../ui/src/lib';

@Component({
  selector: 'app-hc-app',
  templateUrl: './hc-app.component.html',
  styles: []
})
export class HcAppComponent implements OnInit, OnDestroy {
  @ViewChild(PoTableComponent, { static: true }) poTable: PoTableComponent;

  // customUrl = 'https://custom-api-backend.herokuapp.com/custom';
  customUrl = 'http://localhost:3000/custom';
  url;
  eventInput = { emitValue: this.setUrl.bind(this) };
  selectedItems;
  buttonDisabled = true;

  private apiSubscription: Subscription;

  constructor(private service: PoCustomAreaService, private http: HttpClient) {}

  setDisabled() {
    return !this.url;
  }

  changeUrl(url) {
    this.service.notifyAll({ url });
  }

  selectItem(item) {
    this.selectedItems = item;
    this.buttonDisabled = item && this.url;
  }

  ngOnInit() {
    // code
  }

  ngOnDestroy() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }

  setUrl(event) {
    const { url } = event.detail;
    this.url = url;
  }

  sendItem() {
    const { name, email, nickname } = this.selectedItems;
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
    this.service.notifyAll({ ...this.selectedItems });

    const headers = {};
    const body = JSON.parse(success);

    this.apiSubscription = this.http
      .post('https://po-sample-api.herokuapp.com/v1/messages', body, { headers })
      .subscribe();
  }
}
