import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoInputComponent } from './po-input.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoCleanComponent } from './../po-clean/po-clean.component';
import { PoIconModule } from '../../po-icon';

describe('PoInputComponent: ', () => {
  let component: PoInputComponent;
  let fixture: ComponentFixture<PoInputComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoIconModule],
      declarations: [PoInputComponent, PoFieldContainerComponent, PoCleanComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoInputComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.clean = true;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create button clean', () => {
    fixture.detectChanges();
    expect(nativeElement.querySelector('po-clean')).not.toBeNull();
  });

  it('should have a Help', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Help de teste');
  });

  it('should return null in extraValidation', () => {
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
    });
  });

  describe('Templates: ', () => {
    it('shouldn`t have an icon.', () => {
      expect(nativeElement.querySelector('.po-field-icon-container-left')).toBeFalsy();
    });

    it('should includes an icon.', () => {
      component.icon = 'po-icon-settings';
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-settings')).toBeTruthy();
    });

    it('should attribute `po-field-icon-disabled` class when input is disabled.', () => {
      component.icon = 'po-icon-settings';
      component.disabled = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeTruthy();
    });

    it('shouldn`t attribute `po-field-icon-disabled` class when input is not disabled.', () => {
      component.icon = 'po-icon-settings';
      component.disabled = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeFalsy();
    });

    it('should show po-clean if `clean` is true and `disabled` and `readonly` are false', () => {
      component.clean = true;
      component.disabled = false;
      component.readonly = false;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBeTruthy();
    });

    it('shouldn`t show po-clean if `clean` is true and `disabled` is true', () => {
      component.clean = true;
      component.disabled = true;

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBe(null);
    });

    it('shouldn`t show po-clean if `clean` is true and `readonly` is true and `disabled` is false', () => {
      component.clean = true;
      component.disabled = false;
      component.readonly = true;

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBe(null);
    });

    it('shouldn`t show po-clean if `clean` is false', () => {
      component.clean = false;

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBe(null);
    });
  });
});
