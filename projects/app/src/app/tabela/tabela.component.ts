import { Component, OnInit, ViewChild } from '@angular/core';
import { process } from '@progress/kendo-data-query';

@Component({
  templateUrl: './tabela.component.html'
})
export class TabelaComponent implements OnInit {
  inputFilter = [
    {
      field: 'name',
      title: 'name',
      editor: 'string'
    },
    {
      field: 'birthdate',
      title: 'birthdate',
      editor: 'date'
    },
    {
      field: 'cityName',
      title: 'cityName',
      editor: 'string'
    }
  ];

  inputFilterInput = [
    {
      field: 'name',
      operator: 'contains'
    },
    {
      field: 'birthPlace',
      operator: 'contains'
    }
  ];

  columnsFixed = ['id', 'name'];

  public ngOnInit(): void {}
}
