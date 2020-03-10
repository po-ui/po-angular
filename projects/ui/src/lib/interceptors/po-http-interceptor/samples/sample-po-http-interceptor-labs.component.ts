import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { PoRadioGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-http-interceptor-labs',
  templateUrl: './sample-po-http-interceptor-labs.component.html'
})
export class SamplePoHttpInterceptorLabsComponent implements OnDestroy, OnInit {
  noMessageHeaderParam: boolean;
  requestMessage: string;
  status: string;

  errorMessage = `{
    "code": "401",
    "message": "Not Authorized",
    "detailedMessage": "The request has not been applied because it lacks valid authentication credentials for the target resource.",
    "type": "error",
    "helpUrl": "",
    "details": [{
        "code": "406",
        "message": "Not Acceptable",
        "detailedMessage": "The target resource does not have a current representation that would be acceptable to the user agent",
        "type": "error"
    }]
}`;

  successMessage = `{
    "_messages": [
        {
            "code": "200",
            "message": "Ok",
            "detailedMessage": "The request has succeeded.",
            "type": "success",
            "helpUrl": "",
            "details": [{
              "code": "202",
              "message": "Accepted",
              "detailedMessage": "The request has been accepted for processing, but the processing has not been completed.",
              "type": "warning"
            }]
        }
    ]
}`;

  readonly statusOptions: Array<PoRadioGroupOption> = [
    { label: '200 - Success', value: '200' },
    { label: '401 - Error', value: '401' }
  ];

  private apiSubscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnDestroy() {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.restore();
  }

  changeOption() {
    this.requestMessage = this.status === '200' ? this.successMessage : this.errorMessage;
  }

  processRequest() {
    const headers = { 'X-Portinari-No-Message': (!!this.noMessageHeaderParam).toString() };
    const body = JSON.parse(this.requestMessage);
    const params = { status: this.status || '' };

    this.apiSubscription = this.http
      .post(`https://thf.totvs.com.br/sample/api/message`, body, { headers, params })
      .subscribe();
  }

  restore() {
    this.noMessageHeaderParam = undefined;
    this.requestMessage = this.successMessage;
    this.status = '200';
  }
}
