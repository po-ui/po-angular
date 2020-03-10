import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { expectSettersMethod, configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoCleanComponent } from './../po-clean/po-clean.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoNumberComponent } from './po-number.component';

describe('PoNumberComponent:', () => {
  let component: PoNumberComponent;
  let fixture: ComponentFixture<PoNumberComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoNumberComponent, PoFieldContainerComponent, PoCleanComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoNumberComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.clean = true;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create button clean', () => {
    expect(nativeElement.querySelector('po-clean')).not.toBeNull();
  });

  it('should have a Label', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Label de teste');
  });

  it('should have a Help', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Help de teste');
  });

  it('should be max and min', () => {
    expectSettersMethod(component, 'setMax', '', 'max', undefined);
    expectSettersMethod(component, 'setMax', '10', 'max', 10);

    expectSettersMethod(component, 'setMin', '', 'min', undefined);
    expectSettersMethod(component, 'setMin', '10', 'min', 10);
  });

  it('should return null in extraValidation()', () => {
    component.min = 0;
    component.max = 0;

    expect(component.extraValidation(new FormControl(null))).toBeNull();
  });

  it('should call minFailed', () => {
    component.min = 4;

    expect(component.validate(new FormControl('2'))).not.toBeNull();
  });

  it('should call maxFailed', () => {
    component.max = 5;

    expect(component.validate(new FormControl('10'))).not.toBeNull();
  });

  describe('Templates: ', () => {
    it('tabindex: should set tabindex to -1 when `po-number` is disabled.', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input:disabled[tabindex="-1"]')).toBeTruthy();
    });

    it('tabindex: should set tabindex to 0 when `po-number` is enabled.', () => {
      component.disabled = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-input[tabindex="0"]')).toBeTruthy();
    });

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
