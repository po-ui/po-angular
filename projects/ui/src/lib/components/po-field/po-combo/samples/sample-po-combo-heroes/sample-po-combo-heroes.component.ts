import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
  selector: 'sample-po-combo-heroes',
  templateUrl: './sample-po-combo-heroes.component.html',
  standalone: false
})
export class SamplePoComboHeroesComponent {
  hero$: Observable<any>;
  heroName: string;

  constructor(private http: HttpClient) {}

  get knowMoreLabel() {
    return this.heroName ? 'Know more' : undefined;
  }

  knowMore(heroName: string) {
    window.open(`http://google.com/search?q=${heroName}`, '_blank');
  }

  onChangeHero(heroName: string) {
    this.hero$ = this.getHero(heroName);
  }

  private getHero(heroName: string) {
    return this.http.get(`https://po-sample-api.onrender.com/v1/heroes/${heroName}`);
  }
}
