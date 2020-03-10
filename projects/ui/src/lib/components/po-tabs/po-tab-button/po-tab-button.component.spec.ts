import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite, expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoTabButtonComponent } from './po-tab-button.component';

describe('PoTabButtonComponent:', () => {
  let component: PoTabButtonComponent;
  let fixture: ComponentFixture<PoTabButtonComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoTabButtonComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTabButtonComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('active: should call `emitActivated`', () => {
      spyOn(component, <any>'emitActivated');
      component.active = true;
      expect(component['emitActivated']).toHaveBeenCalled();
    });

    it('hide: should set `hide` with valid values', () => {
      const validValues = ['', true, 1, [], {}, 'true'];

      expectPropertiesValues(component, 'hide', validValues, true);
    });

    it('hide: should set `hide` to false with invalid values', () => {
      const invalidValues = [null, undefined, NaN, false, 0, 'false', 'teste'];

      expectPropertiesValues(component, 'hide', invalidValues, false);
    });

    it('hide: should call `setDisplayOnHide`', () => {
      spyOn(component, <any>'setDisplayOnHide');
      component.hide = true;
      expect(component['setDisplayOnHide']).toHaveBeenCalled();
    });
  });

  describe('Methods:', () => {
    it('ngOnChanges: should emit `changeState` if hide currentValue is true', () => {
      spyOn(component.changeState, 'emit');

      component.ngOnChanges(<any>{ hide: { currentValue: true } });

      expect(component.changeState.emit).toHaveBeenCalled();
    });

    it('ngOnChanges: should emit `changeState` if disabled currentValue is true', () => {
      spyOn(component.changeState, 'emit');

      component.ngOnChanges(<any>{ disabled: { currentValue: true } });

      expect(component.changeState.emit).toHaveBeenCalled();
    });

    it('ngOnChanges: shouldn`t emit `changeState` if hide or disabled currentValue is false', () => {
      spyOn(component.changeState, 'emit');

      component.ngOnChanges(<any>{ disabled: { currentValue: false }, hide: { currentValue: false } });

      expect(component.changeState.emit).not.toHaveBeenCalled();
    });

    it('onClick: should emit `click` if `disabled` is false', () => {
      spyOn(component.click, 'emit');

      component.disabled = false;
      component.onClick();

      expect(component.click.emit).toHaveBeenCalled();
    });

    it('onClick: shouldn`t emit `click` if `disabled` is true', () => {
      spyOn(component.click, 'emit');

      component.disabled = true;
      component.onClick();

      expect(component.click.emit).not.toHaveBeenCalled();
    });

    it('emitActivated: should emit `activated` if `active` is true', () => {
      spyOn(component.activated, 'emit');

      component.active = true;
      component['emitActivated']();

      expect(component.activated.emit).toHaveBeenCalled();
    });

    it('emitActivated: shouldn`t emit `activated` if `active` is false', () => {
      spyOn(component.activated, 'emit');

      component.active = false;
      component['emitActivated']();

      expect(component.activated.emit).not.toHaveBeenCalled();
    });

    it('setDisplayOnHide: should set `elementRef` display none if `hide` is true', () => {
      component.hide = true;
      component['setDisplayOnHide']();

      expect(component['elementRef'].nativeElement.style.display).toBe('none');
    });

    it('setDisplayOnHide: should set `elementRef` display empty if `hide` is false', () => {
      component.hide = false;
      component['setDisplayOnHide']();

      expect(component['elementRef'].nativeElement.style.display).toBe('');
    });
  });

  describe('Templates:', () => {
    it('should add disabled class if `disabled` is true', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-button-disabled')).toBeTruthy();
    });

    it('shouldn`t add disabled class if `disabled` is false', () => {
      component.disabled = false;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-button-disabled')).toBeFalsy();
    });

    it(`shouldn't contains 'tabindex="0"' if 'disabled' is 'true'.`, () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-button-md[tabindex="0"]')).toBeFalsy();
    });

    it(`should contains 'tabindex="0"' if 'disabled' is 'false'.`, () => {
      component.disabled = false;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-button-md[tabindex="0"]')).toBeTruthy();
    });

    it('should add active class if `active` is true', () => {
      component.active = true;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-button-active')).toBeTruthy();
    });

    it('shouldn`t add active class if `active` is false', () => {
      component.active = false;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-button-active')).toBeFalsy();
    });

    it('should add sm class if `small` is true', () => {
      component.small = true;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-button-sm')).toBeTruthy();
    });

    it('shouldn`t add sm class if `small` is false', () => {
      component.small = false;
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-tab-button-sm')).toBeFalsy();
    });

    it('should have label', () => {
      const label = 'Tab';

      component.label = label;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-tab-button-label').innerHTML).toContain(label);
    });

    it('should call `onClick` if `enter` is pressed in `po-tab-button-md`.', () => {
      const eventEnterKey = new KeyboardEvent('keyup', { 'key': 'Enter' });
      const poTabButton = fixture.debugElement.query(By.css('.po-tab-button-md')).nativeElement;

      spyOn(component, <any>'onClick');
      poTabButton.dispatchEvent(eventEnterKey);

      expect(component['onClick']).toHaveBeenCalled();
    });
  });
});
