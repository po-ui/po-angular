import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { poDialogAlertLiteralsDefault, PoDialogComponent, poDialogConfirmLiteralsDefault } from './po-dialog.component';
import { PoDialogAlertOptions, PoDialogConfirmOptions } from './interfaces/po-dialog.interface';
import { PoDialogModule } from './po-dialog.module';
import { PoDialogType } from './po-dialog.enum';

describe('PoDialogComponent:', () => {
  let component: PoDialogComponent;
  let fixture: ComponentFixture<PoDialogComponent>;

  const alertOptions: PoDialogAlertOptions = {
    title: 'Title',
    message: 'Message',
    ok: () => {}
  };

  const confirmOptions: PoDialogConfirmOptions = {
    title: 'Title',
    message: 'Message',
    confirm: () => {},
    cancel: () => {},
    close: () => {}
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoDialogModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoDialogComponent).toBeTruthy();
  });

  it('should call primaryAction and close', () => {
    spyOn(component, 'close');
    component.primaryAction.action();
    component.close();
    expect(component.primaryAction.label).toBe('ok');
    expect(component.close).toHaveBeenCalled();
  });

  it('should call primaryAction and secondaryAction', () => {
    component.configDialog(
      'teste',
      () => {},
      'teste',
      () => {}
    );

    spyOn(component, 'close');
    component.primaryAction.action();
    expect(component.close).toHaveBeenCalled();

    component.secondaryAction.action();
    expect(component.close).toHaveBeenCalled();
  });

  it('should call primaryAction and secondaryAction with undefined functions', () => {
    component.configDialog('teste', undefined, 'teste');

    spyOn(component, 'close');
    component.primaryAction.action();
    expect(component.close).toHaveBeenCalled();

    component.secondaryAction.action();
    expect(component.close).toHaveBeenCalled();
  });

  it('should close poModal and destroy', () => {
    const fakeThis = {
      poModal: {
        close: () => {}
      },
      destroy: () => {}
    };

    spyOn(fakeThis.poModal, 'close');
    spyOn(fakeThis, 'destroy');

    component.close.call(fakeThis);

    expect(fakeThis.poModal.close).toHaveBeenCalled();
    expect(fakeThis.destroy).toHaveBeenCalled();
  });

  it(
    'Should call destroy if was closed with X',
    waitForAsync(() => {
      spyOn(component, 'destroy');

      component.poModal.close(true);
      fixture.detectChanges();

      expect(component.destroy).toHaveBeenCalled();
    })
  );

  it(
    'Should call closeAction if has closeAction callback and was closed with X',
    waitForAsync(() => {
      component.closeAction = () => {};
      spyOn(component, 'closeAction');

      component.poModal.close(true);
      fixture.detectChanges();

      expect(component.closeAction).toHaveBeenCalled();
    })
  );

  it('should set var configDialog', () => {
    const fakeThis = {
      primaryAction: {
        label: 'primaryLabel',
        action: () => {}
      },
      secondaryAction: {
        label: 'secondaryLabel',
        action: () => {}
      }
    };
    component.configDialog.call(fakeThis, 'primaryLabel', 'primaryAction', 'secondaryLabel', 'secondaryAction');
    expect(fakeThis.primaryAction.label).toBe('primaryLabel');
    expect(fakeThis.secondaryAction.label).toBe('secondaryLabel');
  });

  it('should be call destroy method from componentRef', () => {
    const sourceObject = { componentRef: { destroy: function () {} } };
    Object.assign(component, sourceObject);

    spyOn(sourceObject.componentRef, 'destroy');

    component.destroy();

    Object.assign(component, { componentRef: null });
    component.destroy();

    expect(sourceObject.componentRef.destroy).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it('closeSubscription: should unsubscribe closeSubscription on destroy.', () => {
      component['closeSubscription'] = <any>{ unsubscribe: () => {} };

      spyOn(component['closeSubscription'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['closeSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('open: should set `title` and `message` with dialogOptions properties.', () => {
      component.literalsConfirm = { 'cancel': 'Cancel', 'confirm': 'Confirm' };
      component.title = undefined;
      component.message = undefined;

      spyOn(component, <any>'setDialogLiterals');
      spyOn(component, 'configDialog');
      spyOn(component.poModal, 'open');

      component.open(confirmOptions, PoDialogType.Confirm);

      expect(component.title).toEqual(confirmOptions.title);
      expect(component.message).toEqual(confirmOptions.message);
    });

    it('open: should call `setDialogLiterals()` with `dialogOptions` and `dialogType`.', () => {
      component.literalsConfirm = { 'cancel': 'Cancel', 'confirm': 'Confirm' };

      spyOn(component, <any>'setDialogLiterals');
      spyOn(component, 'configDialog');
      spyOn(component.poModal, 'open');

      component.open(confirmOptions, PoDialogType.Confirm);

      expect(component['setDialogLiterals']).toHaveBeenCalledWith(confirmOptions, PoDialogType.Confirm);
    });

    it(`open: should call 'configDialog()' with 'literals.ok', 'dialogOptions.ok()' if 'dialogType' is 'PoDialogType.Alert'.`, () => {
      component.literalsAlert = { 'ok': 'Ok' };

      spyOn(component, <any>'setDialogLiterals');
      spyOn(component, 'configDialog');
      spyOn(component.poModal, 'open');

      component.open(alertOptions, PoDialogType.Alert);

      expect(component.configDialog).toHaveBeenCalledWith(component.literalsAlert.ok, alertOptions.ok);
    });

    it(`open: should call 'configDialog()' with 'literals.confirm', 'dialogOptions.confirm()', 'literals.cancel',
        'dialogOptions.cancel()', and 'dialogOptions.close()' if 'dialogType' is 'PoDialogType.Confirm'.`, () => {
      component.literalsConfirm = { 'cancel': 'Cancel', 'confirm': 'Confirm' };

      spyOn(component, <any>'setDialogLiterals');
      spyOn(component, 'configDialog');
      spyOn(component.poModal, 'open');

      component.open(confirmOptions, PoDialogType.Confirm);

      expect(component.configDialog).toHaveBeenCalledWith(
        component.literalsConfirm.confirm,
        confirmOptions.confirm,
        component.literalsConfirm.cancel,
        confirmOptions.cancel,
        confirmOptions.close
      );
    });

    it('open: should call `PoModal.open()`.', () => {
      component.literalsAlert = { 'ok': 'Ok' };

      spyOn(component, <any>'setDialogLiterals');
      spyOn(component, 'configDialog');
      spyOn(component.poModal, 'open');

      component.open(alertOptions, PoDialogType.Alert);

      expect(component.poModal.open).toHaveBeenCalled();
    });

    it('setDialogLiterals: should set `literalsAlert` in portuguese if browser is setted with an unsupported language.', () => {
      component['language'] = 'xx';

      component['setDialogLiterals'](alertOptions, PoDialogType.Alert);

      expect(component.literalsAlert).toEqual(poDialogAlertLiteralsDefault.pt);
    });

    it('setDialogLiterals: should set `literalsConfirm` in portuguese if browser is setted with an unsupported language.', () => {
      component['language'] = 'xx';

      component['setDialogLiterals'](confirmOptions, PoDialogType.Confirm);

      expect(component.literalsConfirm).toEqual(poDialogConfirmLiteralsDefault.pt);
    });

    it(`setDialogLiterals: should set 'literalsAlert' in english.`, () => {
      component['language'] = 'en';

      component['setDialogLiterals'](alertOptions, PoDialogType.Alert);

      expect(component.literalsAlert).toEqual(poDialogAlertLiteralsDefault.en);
    });

    it(`setDialogLiterals: should set 'literalsAlert' in spanish.`, () => {
      component['language'] = 'es';

      component['setDialogLiterals'](alertOptions, PoDialogType.Alert);

      expect(component.literalsAlert).toEqual(poDialogAlertLiteralsDefault.es);
    });

    it(`setDialogLiterals: should set 'literalsAlert' in portuguese.`, () => {
      component['language'] = 'pt';

      component['setDialogLiterals'](alertOptions, PoDialogType.Alert);

      expect(component.literalsAlert).toEqual(poDialogAlertLiteralsDefault.pt);
    });

    it(`setDialogLiterals: should set 'literalsConfirm' in english.`, () => {
      component['language'] = 'en';

      component['setDialogLiterals'](confirmOptions, PoDialogType.Confirm);

      expect(component.literalsConfirm).toEqual(poDialogConfirmLiteralsDefault.en);
    });

    it(`setDialogLiterals: should set 'literalsConfirm' in spanish.`, () => {
      component['language'] = 'es';

      component['setDialogLiterals'](confirmOptions, PoDialogType.Confirm);

      expect(component.literalsConfirm).toEqual(poDialogConfirmLiteralsDefault.es);
    });

    it(`setDialogLiterals: should set 'literalsAlert' in russian.`, () => {
      component['language'] = 'ru';

      component['setDialogLiterals'](alertOptions, PoDialogType.Alert);

      expect(component.literalsAlert).toEqual(poDialogAlertLiteralsDefault.ru);
    });

    it(`setDialogLiterals: should set 'literalsConfirm' in portuguese.`, () => {
      component['language'] = 'pt';

      component['setDialogLiterals'](confirmOptions, PoDialogType.Confirm);

      expect(component.literalsConfirm).toEqual(poDialogConfirmLiteralsDefault.pt);
    });

    it(`setDialogLiterals: should set 'literalsAlert' as 'dialogOptions.literals' if 'dialogOptions.literals' is defined
        and 'dialogType' is 'PoDialogType.Alert'.`, () => {
      const alertOptionsCustom: PoDialogAlertOptions = {
        literals: { ok: 'Finish' },
        title: 'Title',
        message: 'Message',
        ok: () => {}
      };

      component['language'] = 'pt';

      component['setDialogLiterals'](alertOptionsCustom, PoDialogType.Alert);

      expect(component.literalsAlert).toEqual(alertOptionsCustom.literals);
    });

    it(`setDialogLiterals: should set 'literalsConfirm' as 'dialogOptions.literals' if 'dialogOptions.literals' is defined
        and 'dialogType' is 'PoDialogType.Confirm'.`, () => {
      const confirmOptionsCustom: PoDialogConfirmOptions = {
        literals: { cancel: 'No', confirm: 'Yes' },
        title: 'Title',
        message: 'Message',
        confirm: () => {},
        cancel: () => {}
      };

      component['language'] = 'pt';

      component['setDialogLiterals'](confirmOptionsCustom, PoDialogType.Confirm);

      expect(component.literalsConfirm).toEqual(confirmOptionsCustom.literals);
    });
  });
});
