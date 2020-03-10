import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as UtilsFunction from '../../utils/util';
import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoDisclaimerComponent } from './po-disclaimer.component';

describe('PoDisclaimerComponent:', () => {
  let component: PoDisclaimerComponent;
  let fixture: ComponentFixture<PoDisclaimerComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoDisclaimerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have label', () => {
    component.label = 'Label';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-label').innerHTML).toContain('Label');
  });

  it('should set type default', () => {
    component.type = 'default';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer')).toBeTruthy();
    expect(nativeElement.querySelector('.po-disclaimer-label-danger')).toBeFalsy();
  });

  it('should set type danger', () => {
    component.type = 'danger';
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-label-danger')).toBeTruthy();
  });

  it('should set hideClose false', () => {
    component.hideClose = false;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-remove')).toBeTruthy();
  });

  it('should set hideClose true', () => {
    component.hideClose = true;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer-remove')).toBeFalsy();
  });

  it('should hide disclaimer after close', () => {
    component.close();
    fixture.detectChanges();
    expect(nativeElement.querySelector('.po-disclaimer')).toBeFalsy();
  });

  describe('Methods:', () => {
    const eventEnterKey = { keyCode: 13, which: 13 };
    const eventDeleteKey = { keyCode: 46, which: 46 };

    it(`onKeyPress: should call 'close' if enter is typed.`, () => {
      spyOn(component, 'close');

      component.onKeyPress(eventEnterKey);

      expect(component.close).toHaveBeenCalled();
    });

    it(`onKeyPress: should call 'isKeyCodeEnter' and check if typed key is enter.`, () => {
      spyOn(UtilsFunction, <any>'isKeyCodeEnter');

      component.onKeyPress(eventEnterKey);

      expect(UtilsFunction['isKeyCodeEnter']).toHaveBeenCalled();
    });

    it(`onKeyPress: shouldn't call 'close' if the typed key is not enter.`, () => {
      spyOn(UtilsFunction, <any>'isKeyCodeEnter');
      spyOn(component, <any>'close');
      component.onKeyPress(eventDeleteKey);

      expect(component['close']).not.toHaveBeenCalled();
      expect(UtilsFunction['isKeyCodeEnter']).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it(`should set tabindex to 0 if disclaimer 'hideClose' is false.`, () => {
      component.hideClose = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-disclaimer-remove[tabindex="0"]')).toBeTruthy();
    });

    it(`shouldn't set tabindex if disclaimer 'hideClose' is true.`, () => {
      component.hideClose = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-disclaimer-remove[tabindex="0"]')).toBeNull();
    });
  });
});
