import { Component, OnInit, ViewChild } from '@angular/core';
import { process } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './tabela-cinco.component.html'
})
export class TabelaCincoComponent {
  valoresPadrao = {
    graduation: '',
    id: '',
    name: '',
    city: '',
    street: '',
    statusDescription: '',
    state: '',
    uf: ''
  };

  formGroup = dataItem =>
    new FormGroup({
      name: new FormControl(dataItem.name),
      city: new FormControl(dataItem.city),
      id: new FormControl(dataItem.id),
      graduation: new FormControl(dataItem.graduation, Validators.required),
      street: new FormControl(dataItem.street, Validators.required),
      statusDescription: new FormControl(dataItem.statusDescription, Validators.required),
      state: new FormControl(dataItem.state, Validators.required),
      uf: new FormControl(dataItem.uf, Validators.required)
    });
}
