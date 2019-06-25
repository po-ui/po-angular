import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoUrlComponent } from './po-url.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoCleanComponent } from './../po-clean/po-clean.component';

describe('PoUrlComponent:', () => {
  let component: PoUrlComponent;
  let fixture: ComponentFixture<PoUrlComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoUrlComponent,
        PoFieldContainerComponent,
        PoCleanComponent,
        PoFieldContainerBottomComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoUrlComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.clean = true;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should return null in extraValidation()', () => {
    expect(component.extraValidation(null)).toBeNull();
  });

  describe('Methods:', () => {

    it('ngAfterViewInit: should add keyup eventListener if `onChangePropagate` is null', fakeAsync(() => {
      component.onChangePropagate = null;

      spyOn(component.inputEl.nativeElement, 'addEventListener');

      component.ngAfterViewInit();
      tick();

      expect(component.inputEl.nativeElement.addEventListener).toHaveBeenCalledWith('keyup', component['listener']);
    }));

    it('ngAfterViewInit: shouldn`t add keyup eventListener if `onChangePropagate` is not null', fakeAsync(() => {
      component.onChangePropagate = () => {};

      spyOn(component.inputEl.nativeElement, 'addEventListener');

      component.ngAfterViewInit();
      tick();

      expect(component.inputEl.nativeElement.addEventListener).not.toHaveBeenCalled();
    }));

    it('ngOnDestroy: should remove keyup event listener if `onChangePropagate` is null', () => {
      component.onChangePropagate = null;

      spyOn(component.inputEl.nativeElement, 'removeEventListener');

      component.ngOnDestroy();

      expect(component.inputEl.nativeElement.removeEventListener).toHaveBeenCalledWith('keyup', component['listener']);
    });

    it('ngOnDestroy: shouldn`t remove keyup eventListener if `onChangePropagate` is not null', () => {
      component.onChangePropagate = () => {};

      spyOn(component.inputEl.nativeElement, 'removeEventListener');

      component.ngOnDestroy();

      expect(component.inputEl.nativeElement.removeEventListener).not.toHaveBeenCalled();
    });

  });

  describe('Templates:', () => {

    const eventKeyup = new KeyboardEvent('keyup', { 'key': 'a' });

    it('should have `world` icon', () => {
      expect(fixture.debugElement.nativeElement.querySelector('.po-icon-world')).toBeTruthy();
    });

    it('should call `getScreenValue` and `verifyPattern` on input keyup', fakeAsync(() => {
      spyOn(component, 'getScreenValue').and.returnValue('test');
      spyOn(component, 'verifyPattern');

      component.onChangePropagate = null;
      component.ngAfterViewInit();
      tick(200);

      const input = component.inputEl.nativeElement;
      input.dispatchEvent(eventKeyup);

      fixture.detectChanges();

      expect(component.getScreenValue).toHaveBeenCalled();
      expect(component.verifyPattern).toHaveBeenCalled();
    }));

    it(`should show optional if the field isn't 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = false;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeTruthy();
    });

    it(`shouldn't show optional if the field is 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = true;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it(`shouldn't show optional if the field isn't 'required', has 'label' but 'p-optional' is false.`, () => {
      component.required = true;
      component.optional = false;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

  });

});
