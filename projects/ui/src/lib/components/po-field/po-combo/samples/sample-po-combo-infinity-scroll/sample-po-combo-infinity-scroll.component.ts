import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'sample-po-combo-infinity-scroll',
  templateUrl: './sample-po-combo-infinity-scroll.component.html'
})
export class SamplePoComboInfinityScrollComponent {
  peopleName: string;
  people$: Observable<any>;

  constructor(private http: HttpClient) {}

  onChangePeople(peopleId: string) {
    this.people$ = this.getPeople(peopleId);
  }

  private getPeople(peopleId: string) {
    return this.http.get(`https://po-sample-api.onrender.com/v1/people/${peopleId}`);
  }
}
