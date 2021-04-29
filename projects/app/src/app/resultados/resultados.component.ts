import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html'
})
export class ResultadosComponent implements OnInit {
  fields = [
    {
      property: 'firstName',
      disabled: false
    },
    {
      property: 'lastName',
      disabled: false
    },
    {
      property: 'email',
      disabled: false
    },
    {
      property: 'phone',
      disabled: false
    },
    {
      property: 'address',
      disabled: false
    },
    {
      property: 'quote',
      disabled: false
    },
    {
      property: 'motherName',
      disabled: false
    },
    {
      property: 'fatherName',
      disabled: false
    }
  ];
  constructor() {}

  ngOnInit(): void {}
}
