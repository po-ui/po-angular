import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-grid-basic',
  templateUrl: './sample-po-grid-basic.component.html'
})
export class SamplePoGridBasicComponent {
  rowActions = {
    beforeSave: this.onBeforeSave.bind(this),
    afterSave: this.onAfterSave.bind(this),
    beforeRemove: this.onBeforeRemove.bind(this),
    afterRemove: this.onAfterRemove.bind(this),
    beforeInsert: this.onBeforeInsert.bind(this)
  };

  columns = [
    { property: 'id', label: 'Código', align: 'right', readonly: true, freeze: true, width: 120 },
    { property: 'name', label: 'Nome', width: '200px', required: true },
    { property: 'occupation', label: 'Cargo', width: 150 },
    { property: 'email', label: 'E-mail', width: 100, required: true },
    { property: 'status', label: 'Status', align: 'center', width: 80 },
    { property: 'lastActivity', label: 'Última atividade', align: 'center', width: 140 },
    { property: 'actions', label: '.', align: 'center', readonly: true, action: true }
  ];

  data = [
    {
      id: 629131,
      name: 'Jhony Senem',
      occupation: 'Developer',
      email: 'jhony.senem@portinari.com.br',
      status: 'Active',
      lastActivity: '2018-12-12',
      actions: '...'
    },
    {
      id: 78492341,
      name: 'Rafaelly Gruber',
      occupation: 'Engineer',
      email: 'rafaelly.gruber@portinari.com.br',
      status: 'Active',
      lastActivity: '2018-12-10',
      actions: '...'
    },
    {
      id: 986434,
      name: 'Nicole Oliveira',
      occupation: 'Developer',
      email: 'nicole.oliveira@portinari.com.br',
      status: 'Active',
      lastActivity: '2018-12-12',
      actions: '...'
    },
    {
      id: 4235652,
      name: 'Mateus José',
      occupation: 'Developer',
      email: 'mateus.jose@portinari.com.br',
      status: 'Active',
      lastActivity: '2018-11-23',
      actions: '...'
    },
    {
      id: 629131,
      name: 'Leonardo Leal',
      occupation: 'Engineer',
      email: 'leonardo.leal@portinari.com.br',
      status: 'Active',
      lastActivity: '2018-11-30',
      actions: '...'
    }
  ];

  onBeforeSave(row: any, old: any) {
    return row.occupation !== 'Engineer';
  }

  onAfterSave(row) {
    // console.log('onAfterSave(new): ', row);
  }

  onBeforeRemove(row) {
    // console.log('onBeforeRemove: ', row);

    return true;
  }

  onAfterRemove(row) {
    // console.log('onAfterRemove: ', row);
  }

  onBeforeInsert(row) {
    // console.log('onBeforeInsert: ', row);

    return true;
  }
}
