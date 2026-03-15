import { Component, ViewChild } from '@angular/core';
import { PoTableColumn, PoTableComponent } from 'projects/ui/src/lib';

@Component({
  selector: 'dthfui-11105-po-table',
  templateUrl: './poTable-component.html',
  standalone: false
})
export class Dthfui11105PoTableComponent {
  @ViewChild('tableComp') tableComponent!: PoTableComponent;

  testeField: number = 0;
  testeField2: string = '';
  data = [
    {
      table: 'PO Table1',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table2',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: false,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table3',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table4',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: false,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table5',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table6',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table7',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table8',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table9',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: false,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table10',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table11',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table12',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table13',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table14',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    },
    {
      table: 'PO Table15',
      angular: 'Biblioteca de componentens PO-UI by TOTVS',
      colA: true,
      colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
      colD: 'coluna D',
      colE: 'coluna e',
      colF: 'coluna f',
      colg: 'coluna g',
      colh: 'coluna h',
      coli: 'coluna i'
    }
  ];
  columns: Array<PoTableColumn> = [
    { label: 'Tabela', property: 'table', fixed: true },
    { label: 'Biblioteca', property: 'angular' },
    { label: 'Coluna A', property: 'colA', type: 'cellTemplate' },
    { label: 'Coluna B', property: 'colB' },
    { label: 'Coluna C', property: 'colC' },
    { label: 'Coluna D', property: 'colD' },
    { label: 'Coluna E', property: 'colE' },
    { label: 'Coluna F', property: 'colF' },
    { label: 'Coluna g', property: 'colg' },
    { label: 'Coluna h', property: 'colh' },
    { label: 'Coluna i', property: 'coli' },
    { label: 'Coluna F', property: 'colF' },
    { label: 'Coluna F', property: 'colF' },
    { label: 'Coluna F', property: 'colF' },
    { label: 'Coluna F', property: 'colF' },
    { label: 'Coluna F', property: 'colF' }
  ];

  constructor() {
    for (let count = 0; count < 5000; count++) {
      this.data.push({
        table: `PO Table${count}`,
        angular: 'Biblioteca de componentens PO-UI by TOTVS',
        colA: true,
        colB: 'coluna BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        colC: 'coluna CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
        colD: 'coluna D',
        colE: 'coluna e',
        colF: 'coluna f',
        colg: 'coluna g',
        colh: 'coluna h',
        coli: 'coluna i'
      });
    }
  }

  getHeight(): number {
    return window.innerHeight - 300;
  }

  onKeyDown(event: any) {
    console.log(event);
  }
}
