import { Component } from '@angular/core';

import { PoTableColumn } from '../../../../ui/src/lib';
import { AppService } from '../app.service';

@Component({
  selector: 'po-virtual',
  templateUrl: './virtual.component.html',
  styleUrls: ['./virtual.component.css']
})
export class VirtualComponent {
  loading: boolean = false;
  items: Array<any> = [];
  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID' },
    { property: 'nome', label: 'Nome' },
    { property: 'microrregiao.mesorregiao.UF.nome', label: 'Estado' },
    { property: 'microrregiao.mesorregiao.UF.sigla', label: 'UF' },
    { property: 'microrregiao.mesorregiao.UF.regiao.nome', label: 'Região' },
    { property: 'microrregiao.mesorregiao.UF.regiao.sigla', label: 'Reg' },
    { property: 'microrregiao.nome', label: 'Microrregião' },
    { property: 'microrregiao.mesorregiao.nome', label: 'Mesorregião' }
  ];
  constructor(private service: AppService) {
    this.loading = true;
    this.service.getMunicipios().subscribe({
      next: data => {
        this.items = data;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onSelectRow(row) {
    console.log(row);
  }
}
