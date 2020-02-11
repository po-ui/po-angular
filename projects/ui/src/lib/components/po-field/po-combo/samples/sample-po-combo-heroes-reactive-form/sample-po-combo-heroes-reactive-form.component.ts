import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Component({
  selector: 'sample-po-combo-heroes-reactive-form',
  templateUrl: './sample-po-combo-heroes-reactive-form.component.html'
})
export class SamplePoComboHeroesReactiveFormComponent implements OnInit {

  form: FormGroup;
  hero$: Observable<any>;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      hero: [null, Validators.required]
    });
  }

  knowMore() {
    const heroName = this.form.get('hero').value;

    window.open(`http://google.com/search?q=${heroName}`, '_blank');
  }

  onChangeHero(heroName: string) {
    this.hero$ = this.getHero(heroName);
  }

  private getHero(heroName: string) {
    return this.http.get(`https://thf.totvs.com.br/sample/api/new/heroes/${heroName}`);
  }

}
