import { Component, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';
import {
  PoNotificationService,
  PoDialogService,
  PoBreadcrumb,
  PoCustomAreaService,
  PoRadioGroupOption
} from '../../../../ui/src/lib';
import { Router } from '@angular/router';
@Component({
  templateUrl: './clientes.component.html'
})
export class ClientesComponent {
  birthDate: Date;
  email: string;
  fathersName: string;
  genre: string;
  graduation: string;
  mothersName: string;
  name: string;
  nationality: string;
  nickname: string;
  placeOfBirth: string;
  userId: number;
  personType: string = 'CNPJ';
  cnpj: string;

  typeTest;

  typeTestOptions: Array<PoRadioGroupOption> = [
    { label: 'Naruto', value: 'NARUTO' },
    { label: 'DragonBall', value: 'DRAGON' }
  ];

  readonly personOptions: Array<PoRadioGroupOption> = [
    { label: 'Jurídica', value: 'CNPJ' },
    { label: 'Física', value: 'CPF' }
  ];
  eventInput = { emitValue: this.setCNPJ.bind(this) };

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', action: this.beforeRedirect.bind(this) }, { label: 'User Edit' }]
  };

  @ViewChild('formEditUser', { static: true }) formEditUser: NgForm;

  constructor(
    private route: Router,
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private poCustomAreaService: PoCustomAreaService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  cancel() {
    this.initialize();
  }

  setCNPJ(event) {
    const { value } = event.detail;
    this.cnpj = value;
  }

  initialize() {
    this.birthDate = new Date(1978, 11, 26);
    this.email = 'john.doe@po-ui.com.br';
    this.fathersName = 'Mike Doe';
    this.genre = 'male';
    this.graduation = 'College Degree';
    this.mothersName = 'Jane Doe';
    this.name = 'John Doe';
    this.nationality = 'USA';
    this.nickname = 'John';
    this.placeOfBirth = 'Colorado';
    this.userId = 122635;
  }

  save() {
    this.poNotification.success(`Save successfully`);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.formEditUser.valid) {
      this.route.navigate(['/']);
    } else {
      this.poDialog.confirm({
        title: `Confirm redirect to ${itemBreadcrumbLabel}`,
        message: `There is data that has not been saved yet. Are you sure you want to quit?`,
        confirm: () => this.route.navigate(['/'])
      });
    }
  }

  changePerson(personType) {
    //this.poCustomAreaService.notifyAll({ personType });
  }
}
