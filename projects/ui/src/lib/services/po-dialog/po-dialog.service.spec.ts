import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoComponentInjectorService } from './../po-component-injector/po-component-injector.service';
import { PoDialogComponent } from './po-dialog.component';
import { PoDialogService } from './po-dialog.service';
import { PoDialogAlertOptions, PoDialogConfirmOptions, PoDialogType } from '../../services/po-dialog';
import { PoModalModule } from '../../components/po-modal';

@NgModule({
  imports: [CommonModule, PoModalModule],
  declarations: [PoDialogComponent],
  providers: [PoComponentInjectorService, PoDialogService]
})
class TestModule {}

@Component({
  template: ` test component `,
  providers: [PoComponentInjectorService, PoDialogService]
})
class TestComponent {
  constructor(poDialog: PoDialogService) {}
}

describe('PoDialogService', () => {
  let fixture: ComponentFixture<TestComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [PoDialogService],
      declarations: [TestComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);

    const modalContainer = document.body.querySelectorAll('po-modal');
    Array.from(modalContainer).forEach(modal => {
      modal.remove();
    });

    fixture.detectChanges();
  });

  it('should open a alert options dialog', inject([PoDialogService], (poDialogService: PoDialogService) => {
    const alertOptions: PoDialogAlertOptions = {
      title: 'Alerta',
      message: 'O teste continua!',
      ok: () => {}
    };

    poDialogService.openDialog(PoDialogType.Alert, alertOptions);

    fixture.detectChanges();

    const modalContainer = document.body.querySelector('po-modal');
    expect(modalContainer.querySelector('.po-modal-title').innerHTML).toContain(alertOptions.title);
    expect(modalContainer.querySelector('.po-modal-body').innerHTML).toContain(alertOptions.message);
    // Removendo o atributo para não interferir no segundo teste.
    modalContainer.remove();
  }));

  it('should open a confirm options dialog', inject([PoDialogService], (poDialogService: PoDialogService) => {
    const confirmOptions: PoDialogConfirmOptions = {
      literals: { cancel: 'Cancelar', confirm: 'Confirmar' },
      title: 'Confirmar',
      message: 'Deseja prosseguir com o teste?',
      confirm: () => {},
      cancel: () => {}
    };

    poDialogService.openDialog(PoDialogType.Confirm, confirmOptions);

    fixture.detectChanges();

    const modalContainer = document.body.querySelector('po-modal');
    expect(modalContainer.querySelector('.po-modal-title').innerHTML).toContain(confirmOptions.title);
    expect(modalContainer.querySelector('.po-modal-body').innerHTML).toContain(confirmOptions.message);
    expect(modalContainer.querySelector('.po-button-primary').innerHTML).toContain('Confirmar');
    expect(modalContainer.querySelector('.po-button').innerHTML).toContain('Cancelar');
    modalContainer.remove();
  }));
});
