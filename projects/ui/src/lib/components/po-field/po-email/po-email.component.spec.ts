import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoEmailComponent } from './po-email.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoCleanComponent } from './../po-clean/po-clean.component';
import { PoIconModule } from '../../po-icon';

describe('PoEmailComponent:', () => {
  let component: PoEmailComponent;
  let fixture: ComponentFixture<PoEmailComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoIconModule],
      declarations: [PoEmailComponent, PoFieldContainerComponent, PoCleanComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoEmailComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.clean = true;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should return null in extraValidation()', () => {
    fixture.detectChanges();
    expect(component.extraValidation(null)).toBeNull();
  });

  describe('Methods:', () => {
    describe('ngAfterViewInit:', () => {
      let inputFocus: jasmine.Spy;

      beforeEach(() => {
        inputFocus = spyOn(component, 'focus');
      });

      it('should call `focus` if autoFocus is true.', () => {
        component.autoFocus = true;
        component.ngAfterViewInit();
        expect(inputFocus).toHaveBeenCalled();
      });

      it('should not call `focus` if autoFocus is false.', () => {
        component.autoFocus = false;
        component.ngAfterViewInit();
        expect(inputFocus).not.toHaveBeenCalled();
      });

      it('should add keyup eventListener if `onChangePropagate` is null', fakeAsync(() => {
        component.onChangePropagate = null;

        spyOn(component.inputEl.nativeElement, 'addEventListener');

        component.ngAfterViewInit();
        tick();

        expect(component.inputEl.nativeElement.addEventListener).toHaveBeenCalledWith('keyup', component['listener']);
      }));

      it('shouldn`t add keyup eventListener if `onChangePropagate` is not null', fakeAsync(() => {
        component.onChangePropagate = () => {};

        spyOn(component.inputEl.nativeElement, 'addEventListener');

        component.ngAfterViewInit();
        tick();

        expect(component.inputEl.nativeElement.addEventListener).not.toHaveBeenCalled();
      }));
    });

    it('ngOnDestroy: should remove keyup event listener if `onChangePropagate` is null', () => {
      component.onChangePropagate = null;

      spyOn(component.inputEl.nativeElement, 'removeEventListener');

      component.ngAfterViewInit();
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

    it('should have `mail` icon', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('.po-icon-mail')).toBeTruthy();
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
      flush();
    }));
  });

  describe('Integration:', () => {
    it(`should return null on validate if email is valid`, () => {
      expect(component.validate(new UntypedFormControl('JOHN@EMAIL.COM'))).toBe(null);
      expect(component.validate(new UntypedFormControl('JOHN@email.com'))).toBe(null);
      expect(component.validate(new UntypedFormControl('JOHN@EMAIL.EMAILEXTENSION'))).toBe(null);
    });

    it(`should return '{ pattern: { valid: false } }' on validate if email is invalid`, () => {
      const patternError = { pattern: { valid: false } };

      expect(component.validate(new UntypedFormControl('JOHN@'))).toEqual(patternError);
      expect(component.validate(new UntypedFormControl('JOHN@EMAIL.'))).toEqual(patternError);
      expect(component.validate(new UntypedFormControl('JOHN'))).toEqual(patternError);
      expect(
        component.validate(
          new UntypedFormControl('JOHN@EMAIL.EMAILEXTENSIONWITHMORETHANSIXTYSIXCHARACTERSBECAUSEWENEEDANERRORCONDITION')
        )
      ).toEqual(patternError);
    });
  });
});
