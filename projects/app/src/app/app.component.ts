import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoSelectOption } from '../../../ui/src/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public form: FormGroup;
  public currency: Array<PoSelectOption>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      currency: this.formBuilder.control('', [Validators.required])
    });
    this.setCurrency();
  }

  async setCurrency() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.currency = [
      { label: 'Real', value: '001' },
      { label: 'Dolar', value: '002' },
      { label: 'Euro', value: '003' }
    ];
    this.form.controls.currency.setValue('003');
  }

  empresaSemPadrao = 2;

  empresas1 = [
    {
      value: 1,
      label: 'a'
    },
    {
      value: 2,
      label: 'b'
    },
    {
      value: 3,
      label: 'c'
    }
  ];

  empresas2 = [
    {
      codigo: 1,
      nomeFantasia: 'a'
    },
    {
      codigo: 2,
      nomeFantasia: 'b'
    },
    {
      codigo: 3,
      nomeFantasia: 'c'
    }
  ];

  empresas3 = [
    {
      codigo: 1,
      nomeFantasia: 'a'
    },
    {
      codigo: 2,
      nomeFantasia: 'b'
    },
    {
      codigo: 3,
      nomeFantasia: 'c'
    },
    {
      codigo: 4,
      nomeFantasia: 'd'
    }
  ];
}
