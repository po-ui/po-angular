import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite, expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoFieldContainerComponent } from './po-field-container.component';
import { poFieldContainerLiterals } from './po-field-container-literals';

import { PoLabelModule } from '../../po-label/po-label.module';

describe('PoFieldContainerComponent:', () => {
  let component: PoFieldContainerComponent;
  let fixture: ComponentFixture<PoFieldContainerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoLabelModule],
      declarations: [PoFieldContainerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoFieldContainerComponent);
    component = fixture.componentInstance;
    component.literals = poFieldContainerLiterals['en'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('p-optional: should update property with `true` if valid values', () => {
      const validValues = ['', true, 'true'];

      expectPropertiesValues(component, 'optional', validValues, true);
    });

    it('p-optional: should update propert with `false` if invalid values', () => {
      const invalidValues = ['false', false, 'abc', undefined, null];

      expectPropertiesValues(component, 'optional', invalidValues, false);
    });

    it('p-required: should update property with `true` if valid values', () => {
      const validValues = ['', true, 'true'];

      expectPropertiesValues(component, 'required', validValues, true);
    });

    it('p-required: should update propert with `false` if invalid values', () => {
      const invalidValues = ['false', false, 'abc', undefined, null];

      expectPropertiesValues(component, 'required', invalidValues, false);
    });

    it('p-show-required: should update property with `true` if valid values', () => {
      const validValues = ['', true, 'true'];

      expectPropertiesValues(component, 'required', validValues, true);
    });

    it('p-show-required: should update propert with `false` if invalid values', () => {
      const invalidValues = ['false', false, 'abc', undefined, null];

      expectPropertiesValues(component, 'required', invalidValues, false);
    });
  });

  describe('Templates:', () => {
    const fieldHelp = 'div.po-field-help';

    it('should have label', () => {
      component.label = 'Label de teste';
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.innerHTML).toContain('Label de teste');
    });

    it('should have help', () => {
      component.help = 'Help de teste';
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.innerHTML).toContain('Help de teste');
    });

    it('shouldn`t show `po-field-help` element if `help` is false.', () => {
      component.help = undefined;
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector(fieldHelp)).toBeNull();
    });

    it('should show `po-field-help` element if `help` is true.', () => {
      component.help = 'Text to help';
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector(fieldHelp)).toBeTruthy();
    });

    it('should show optional property when have optional and have help property', () => {
      component.optional = true;
      component.help = 'help';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-label-requirement')).not.toBeNull();
    });

    it('should show optional property when have optional and have label property', () => {
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-label-requirement')).not.toBeNull();
    });

    it('should show optional property when have optional and have label and help property', () => {
      component.optional = true;
      component.label = 'label';
      component.help = 'help';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-label-requirement')).not.toBeNull();
    });

    it('should not show optional property when optional is true and not have label and not have help property', () => {
      component.optional = true;
      component.label = undefined;
      component.help = undefined;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-label-requirement')).toBeNull();
    });

    it('should show optional and verify literal.optional', () => {
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      const requirement = fixture.debugElement.nativeElement.querySelector('.po-label-requirement');

      expect(requirement).toBeTruthy();
      expect(requirement.innerHTML).toBe(component.literals['optional']);
    });

    it('should show required property when required and showRequired property are "true"', () => {
      component.required = true;
      component.showRequired = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-label-requirement')).not.toBeNull();
    });

    it('should show required and verify literal.required', () => {
      component.required = true;
      component.showRequired = true;
      component.label = 'label';

      fixture.detectChanges();

      const requirement = fixture.debugElement.nativeElement.querySelector('.po-label-requirement');

      expect(requirement).toBeTruthy();
      expect(requirement.innerHTML).toBe(component.literals['required']);
    });
  });

  describe('updateTooltip:', () => {
    it('should set showTip to true if text is ellipsed', () => {
      const mockEl = {
        scrollWidth: 120,
        clientWidth: 100
      } as any;
      spyOn<any>(component, 'getMeasurableEl').and.returnValue(mockEl);
      component.showTip = false;
      spyOn(component['cdr'], 'markForCheck');

      component.updateTooltip();

      expect(component.showTip).toBeTrue();
      expect(component['cdr'].markForCheck).toHaveBeenCalled();
    });

    it('should set showTip to false if text is not ellipsed', () => {
      const mockEl = {
        scrollWidth: 100,
        clientWidth: 120
      } as any;
      spyOn<any>(component, 'getMeasurableEl').and.returnValue(mockEl);
      component.showTip = true;
      spyOn(component['cdr'], 'markForCheck');

      component.updateTooltip();

      expect(component.showTip).toBeFalse();
      expect(component['cdr'].markForCheck).toHaveBeenCalled();
    });

    it('should not change showTip if isEllipsed equals showTip', () => {
      const mockEl = {
        scrollWidth: 100,
        clientWidth: 120
      } as any;
      spyOn<any>(component, 'getMeasurableEl').and.returnValue(mockEl);
      component.showTip = false;
      spyOn(component['cdr'], 'markForCheck');

      component.updateTooltip();

      expect(component.showTip).toBeFalse();
      expect(component['cdr'].markForCheck).toHaveBeenCalled();
    });

    it('should return if getMeasurableEl returns null', () => {
      spyOn<any>(component, 'getMeasurableEl').and.returnValue(null);
      component.showTip = false;
      const markForCheckSpy = spyOn(component['cdr'], 'markForCheck');

      component.updateTooltip();

      expect(component.showTip).toBeFalse();
      expect(markForCheckSpy).not.toHaveBeenCalled();
    });
  });
  describe('ngOnChanges (helper popover):', () => {
    it('should call `openHelperPopover` when `showHelperComponent` changes and `showHelperComponent()` returns true', () => {
      component['helperEl'] = {
        openHelperPopover: jasmine.createSpy('openHelperPopover'),
        closeHelperPopover: jasmine.createSpy('closeHelperPopover')
      } as any;

      spyOn(component as any, 'showHelperComponent').and.returnValue(true);

      const changes: any = {
        showHelperComponent: {
          previousValue: false,
          currentValue: true,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component['helperEl'].openHelperPopover).toHaveBeenCalled();
      expect(component['helperEl'].closeHelperPopover).not.toHaveBeenCalled();
    });

    it('should call `closeHelperPopover` when `showHelperComponent` changes and `showHelperComponent()` returns false', () => {
      component['helperEl'] = {
        openHelperPopover: jasmine.createSpy('openHelperPopover'),
        closeHelperPopover: jasmine.createSpy('closeHelperPopover')
      } as any;

      spyOn(component as any, 'showHelperComponent').and.returnValue(false);

      const changes: any = {
        showHelperComponent: {
          previousValue: true,
          currentValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component['helperEl'].closeHelperPopover).toHaveBeenCalled();
      expect(component['helperEl'].openHelperPopover).not.toHaveBeenCalled();
    });
  });
});
