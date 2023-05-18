import { Component, OnInit, ViewChild } from '@angular/core';
import { process } from '@progress/kendo-data-query';

@Component({
  templateUrl: './tabela-dois.component.html'
})
export class TabelaDoisComponent implements OnInit {
  inputFilter = [
    {
      field: 'name',
      operator: 'contains'
    },
    {
      field: 'nickname',
      operator: 'contains'
    }
  ];

  columnsFixed = ['id'];

  public ngOnInit(): void {}
}
