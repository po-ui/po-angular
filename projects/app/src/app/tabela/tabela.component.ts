import { Component, OnInit, ViewChild } from '@angular/core';
import { process } from '@progress/kendo-data-query';

@Component({
  templateUrl: './tabela.component.html'
})
export class TabelaComponent implements OnInit {
  inputFilter = [
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
