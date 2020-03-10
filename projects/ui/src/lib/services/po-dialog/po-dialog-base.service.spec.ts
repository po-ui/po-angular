import { ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoDialogAlertOptions, PoDialogConfirmOptions } from './interfaces/po-dialog.interface';
import { PoDialogBaseService } from './po-dialog-base.service';
import { PoDialogType } from './po-dialog.enum';

class PoDialogService extends PoDialogBaseService {
  openDialog(
    dialogType: PoDialogType,
    dialogOptions: PoDialogAlertOptions | PoDialogConfirmOptions,
    viewContainerRef?: ViewContainerRef
  ): void {}
}

describe('PoDialogBaseService ', () => {
  const alertOptions: PoDialogAlertOptions = {
    title: 'Title',
    message: 'Message',
    ok: () => {}
  };

  const confirmOptionsWithCancel: PoDialogConfirmOptions = {
    title: 'Title',
    message: 'Message',
    confirm: () => {},
    cancel: () => {}
  };

  const confirmOptionsWithoutCancel: PoDialogConfirmOptions = {
    title: 'Title',
    message: 'Message',
    confirm: () => {}
  };

  let service: PoDialogBaseService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [PoDialogService]
    });
  });

  beforeEach(() => {
    service = new PoDialogService();
  });

  it('should have a `service` attribute that is a PoDialogService', () => {
    expect(service instanceof PoDialogService).toBeTruthy();
  });

  it('should call `service.alert` with `alertOptions` correctly', () => {
    spyOn(service, 'alert').and.callThrough();
    spyOn(service, 'openDialog');
    service.alert(alertOptions);
    expect(service.alert).toHaveBeenCalled();
    expect(service.openDialog).toHaveBeenCalledWith(PoDialogType.Alert, alertOptions);
  });

  it('should call `service.confirm` with `confirmOptionsWithCancel` correctly', () => {
    spyOn(service, 'confirm').and.callThrough();
    spyOn(service, 'openDialog');
    service.confirm(confirmOptionsWithCancel);
    expect(service.confirm).toHaveBeenCalled();
    expect(service.openDialog).toHaveBeenCalledWith(PoDialogType.Confirm, confirmOptionsWithCancel);
  });

  it('should call `service.confirm` with `confirmOptionsWithoutCancel` correctly', () => {
    spyOn(service, 'confirm').and.callThrough();
    spyOn(service, 'openDialog');
    service.confirm(confirmOptionsWithoutCancel);
    expect(service.confirm).toHaveBeenCalled();
    expect(service.openDialog).toHaveBeenCalledWith(PoDialogType.Confirm, confirmOptionsWithoutCancel);
  });
});
