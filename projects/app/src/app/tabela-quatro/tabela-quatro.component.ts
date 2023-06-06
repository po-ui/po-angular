import { Component, OnInit, ViewChild } from '@angular/core';
import { process } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './tabela-quatro.component.html'
})
export class TabelaQuatroComponent {
  valoresPadrao = {
    label: '',
    nickname: '',
    name: '',
    UnitsInStock: ''
  };

  formGroup = dataItem =>
    new FormGroup({
      value: new FormControl(dataItem.value, Validators.required),
      label: new FormControl(dataItem.label),
      id: new FormControl(dataItem.id),
      name: new FormControl(dataItem.name),
      nickname: new FormControl(dataItem.nickname, Validators.required),
      email: new FormControl(dataItem.nickname, Validators.required)
    });
}
