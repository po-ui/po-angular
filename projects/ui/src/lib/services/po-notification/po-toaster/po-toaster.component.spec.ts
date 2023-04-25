import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoButtonModule } from '../../../components/po-button';
import { PoIconModule } from '../../../components/po-icon';

import { PoToaster } from './po-toaster.interface';
import { PoToasterType } from './po-toaster-type.enum';
import { PoToasterOrientation } from './po-toaster-orientation.enum';
import { PoToasterComponent } from './po-toaster.component';

describe('PoToasterComponent', () => {
  let component: PoToasterComponent;
  let fixture: ComponentFixture<PoToasterComponent>;

  const toasterErrorWithAction: PoToaster = {
    position: 1,
    type: PoToasterType.Error,
    message: 'toasterErrorWithAction',
    action: () => {}
  };

  const toasterErrorWithoutAction: PoToaster = {
    position: 1,
    type: PoToasterType.Error,
    message: 'toasterErrorWithoutAction'
  };

  const toasterInfoWithAction: PoToaster = {
    position: 1,
    type: PoToasterType.Information,
    message: 'toasterInfoWithAction',
    action: () => {},
    actionLabel: 'Texto Botão'
  };

  const toasterInfoWithoutAction: PoToaster = {
    position: 1,
    type: PoToasterType.Information,
    message: 'toasterInfoWithoutAction'
  };

  const toasterSuccessWithAction: PoToaster = {
    position: 1,
    type: PoToasterType.Success,
    message: 'toasterSuccessWithAction',
    action: () => {}
  };

  const toasterSuccessWithoutAction: PoToaster = {
    position: 1,
    type: PoToasterType.Success,
    message: 'toasterSuccessWithoutAction'
  };

  const toasterWarningWithAction: PoToaster = {
    position: 1,
    type: PoToasterType.Warning,
    message: 'toasterWarning',
    action: () => {}
  };

  const toasterWarningWithoutAction: PoToaster = {
    position: 1,
    type: PoToasterType.Warning,
    message: 'toasterWarningWithoutAction'
  };

  const toasterBottom: PoToaster = {
    position: 1,
    type: PoToasterType.Error,
    message: 'toasterBottom',
    orientation: PoToasterOrientation.Bottom
  };
  const toasterTop: PoToaster = {
    position: 1,
    type: PoToasterType.Error,
    message: 'toasterTop',
    orientation: PoToasterOrientation.Top
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoButtonModule, PoIconModule],
      declarations: [PoToasterComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be load `component` correctly', () => {
    expect(component).toBeTruthy();
  });

  it('should be load `component.message` attribute correctly', () => {
    component.configToaster(toasterErrorWithAction);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-toaster-message')).nativeElement.innerHTML).toContain('toasterError');
  });

  it('should be load `component.orientation`with PoToasterOrientation.Bottom atribute correctly', () => {
    component.configToaster(toasterBottom);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-toaster-bottom'))).toBeTruthy();
  });

  it('should be load `component.orientation`with PoToasterOrientation.Top atribute correctly', () => {
    component.configToaster(toasterTop);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-toaster-bottom'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.po-toaster-top'))).toBeTruthy();
  });

  it('should be load `component` with all `PoToasterType` with PoToasterType.Error and with action correctly', () => {
    component.configToaster(toasterErrorWithAction);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.po-toaster-error'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.po-icon-warning'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.po-toaster-action po-button'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.po-toaster-close'))).toBeTruthy();
  });

  it('should be load `component` with all `PoToasterType` with PoToasterType.Info and with action correctly', () => {
    component.configToaster(toasterInfoWithAction);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.po-toaster-info'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.po-icon-info'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.po-toaster-action po-button')).nativeElement.innerHTML).toContain(
      'Texto Botão'
    );
  });

  it('should be load `component` with all `PoToasterType` with PoToasterType.Success and with action correctly', () => {
    component.configToaster(toasterSuccessWithAction);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.po-toaster-success'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.po-icon-ok'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.po-toaster-action po-button'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.po-toaster-close'))).toBeTruthy();
  });

  it('should be load `component` with all `PoToasterType` with PoToasterType.Warning and with action correctly', () => {
    component.configToaster(toasterWarningWithAction);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.po-toaster-warning'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.po-icon-warning'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.po-toaster-action po-button'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.po-toaster-close'))).toBeTruthy();
  });

  it('should be load `component` with all `PoToasterType` with PoToasterType.Error and without action correctly', () => {
    component.configToaster(toasterErrorWithoutAction);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-toaster-action po-button'))).toBeNull();
  });

  it('should be load `component` with all `PoToasterType` with PoToasterType.Info and without action correctly', () => {
    component.configToaster(toasterInfoWithoutAction);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-toaster-action po-button'))).toBeNull();
  });

  it('should be load `component` with all `PoToasterType` with PoToasterType.Success and without action correctly', () => {
    component.configToaster(toasterSuccessWithoutAction);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-toaster-action po-button'))).toBeNull();
  });

  it('should be load `component` with all `PoToasterType` with PoToasterType.Warning and without action correctly', () => {
    component.configToaster(toasterWarningWithoutAction);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.po-toaster-action po-button'))).toBeNull();
  });

  it('should be call the `component.action` method how must call a function correctly', () => {
    component.configToaster(toasterErrorWithAction);
    const event = {
      metaKey: false,
      preventDefault: () => {},
      stopPropagation: () => {}
    };
    fixture.detectChanges();
    spyOn(component, 'action');
    component.poToasterAction(event);
    expect(component.action).toHaveBeenCalled();
  });

  it('should set the `alive` attribute to false after the end of the component lifetime', fakeAsync(() => {
    component.configToaster(toasterInfoWithoutAction);
    fixture.detectChanges();
    fixture.destroy();

    tick(10301);

    expect(component.alive).toBeFalse();
  }));

  describe('Methods:', () => {
    it('onButtonClose: should call `close` if action and actionLabel are truthy', () => {
      component.action = () => {};
      component.actionLabel = 'Details';
      const event = {
        metaKey: false,
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      const spyClose = spyOn(component, 'close');
      const spyToasterAction = spyOn(component, 'poToasterAction');

      component.onButtonClose(event);

      expect(spyToasterAction).not.toHaveBeenCalled();
      expect(spyClose).toHaveBeenCalled();
    });

    it('onButtonClose: should call `poToasterAction` if action are truthy and actionLabel is null', () => {
      component.action = () => {};
      component.actionLabel = null;
      const event = {
        metaKey: false,
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      const spyToasterAction = spyOn(component, 'poToasterAction');

      component.onButtonClose(event);

      expect(spyToasterAction).toHaveBeenCalled();
    });

    it('onButtonClose: should call `close` if actionLabel are truthy and action is null', () => {
      component.action = null;
      component.actionLabel = 'Details';
      const event = {
        metaKey: false,
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      const spyCloseCall = spyOn(component, 'close').and.callThrough();

      component.onButtonClose(event);

      expect(spyCloseCall).toBeTruthy();
    });

    it('onButtonClose: should call `poToasterAction` if action is truthy and actionLabel is null', () => {
      component.action = () => {};
      component.actionLabel = null;
      const event = {
        metaKey: false,
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      const spyToasterAction = spyOn(component, 'poToasterAction');
      const spyClose = spyOn(component, 'close');

      component.onButtonClose(event);

      expect(spyClose).not.toHaveBeenCalled();
      expect(spyToasterAction).toHaveBeenCalled();
    });

    it('onButtonClose: should call `close` if action and actionLabel are null', () => {
      component.action = null;
      component.actionLabel = null;
      const event = {
        metaKey: false,
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      const spyToasterAction = spyOn(component, 'poToasterAction');
      const spyClose = spyOn(component, 'close');

      component.onButtonClose(event);

      expect(spyClose).toHaveBeenCalled();
      expect(spyToasterAction).not.toHaveBeenCalled();
    });

    it('setFadeOut: if the class is `po-toaster-invisible` it must keep fade out', () => {
      component.action = () => {};
      component.actionLabel = 'Details';
      component.toaster.nativeElement.className = 'po-toaster-invisible';

      component.setFadeOut();

      expect(component.toaster.nativeElement.className).toContain('po-toaster-invisible');
      expect(component.toaster.nativeElement.className).not.toContain('po-toaster-visible');
    });

    it('setFadeOut: if the css class is different from fade-in/out, it must keep the same class', () => {
      component.action = () => {};
      component.actionLabel = 'Details';
      component.toaster.nativeElement.className = 'po-toaster-test';

      component.setFadeOut();

      expect(component.toaster.nativeElement.className).not.toContain('fade-in');
      expect(component.toaster.nativeElement.className).toContain('po-toaster-test');
      expect(component.toaster.nativeElement.className).toContain('po-toaster-invisible');
    });

    it('setFadeOut: if the class is `po-toaster-visible` it must change to `po-toaster-invisible`', () => {
      component.action = () => {};
      component.actionLabel = 'Details';
      component.toaster.nativeElement.className = 'po-toaster-visible';

      component.setFadeOut();

      expect(component.toaster.nativeElement.className).not.toContain('po-toaster-visible');
      expect(component.toaster.nativeElement.className).toContain('po-toaster-invisible');
    });

    it('poToasterAction: should call `action` when called action attribute', () => {
      component.action = () => {};
      component.actionLabel = 'Details';
      const event = {
        metaKey: false,
        preventDefault: () => {},
        stopPropagation: () => {}
      };

      component.poToasterAction(event);

      const spyAction = spyOn(component, 'action');

      expect(spyAction).toBeTruthy();
    });

    it('should set the margin correctly for one toaster', fakeAsync(() => {
      component.action = () => {};
      component.actionLabel = 'changePosition';
      component.toaster.nativeElement.className = 'po-toaster-visible';
      const position = 1;

      spyOn<any>(component, 'returnHeightToaster').and.returnValue(62);

      component.changePosition(position);
      tick();
      component.orientation = PoToasterOrientation.Top;

      expect((component as any).margin).toBe(78);

      component.changePosition(position);
      tick();
      component.orientation = PoToasterOrientation.Bottom;

      expect((component as any).margin).toBe(78);
    }));

    it('changePosition: Margin should receive the default value plus the next toaster concatenated by the default margin value', fakeAsync(() => {
      const expectResult = 8 + 80 + 8 + 150 + 8;
      spyOn(component, <any>'returnHeightToaster').and.callFake((position: number) => {
        if (position === 1) {
          return 80;
        } else {
          return 150;
        }
      });

      component.changePosition(1);
      tick();
      component.changePosition(2);
      tick();

      expect(component['margin']).toEqual(expectResult);
    }));
  });

  describe('Properties', () => {
    it('icon: should get icon', () => {
      component['icon'] = 'icone';

      expect(component.getIcon()).toBe('icone');
    });

    it('toasterPosition: should get toasterPosition', () => {
      component['toasterPosition'] = 'toasterPosition';

      expect(component.getToasterPosition()).toBe('toasterPosition');
    });

    it('toasterType: should get toasterType', () => {
      component['toasterType'] = 'toasterType';

      expect(component.getToasterType()).toBe('toasterType');
    });
  });
});
