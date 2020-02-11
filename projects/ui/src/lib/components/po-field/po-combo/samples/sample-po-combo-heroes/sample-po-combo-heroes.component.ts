import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Component({
  selector: 'sample-po-combo-heroes',
  templateUrl: './sample-po-combo-heroes.component.html'
})
export class SamplePoComboHeroesComponent {

  hero$: Observable<any>;
  heroName: string;

  constructor(private http: HttpClient) { }

  knowMore(heroName: string) {
    window.open(`http://google.com/search?q=${heroName}`, '_blank');
  }

  onChangeHero(heroName: string) {
    this.hero$ = this.getHero(heroName);
  }

  private getHero(heroName: string) {
    return this.http.get(`https://thf.totvs.com.br/sample/api/new/heroes/${heroName}`);
  }

}
