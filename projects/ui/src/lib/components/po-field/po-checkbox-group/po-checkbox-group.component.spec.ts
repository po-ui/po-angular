import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCheckboxComponent } from '../po-checkbox/po-checkbox.component';
import { PoCheckboxGroupComponent } from './po-checkbox-group.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

describe('PoCheckboxGroupComponent:', () => {
  let changeDetector: any;
  let component: PoCheckboxGroupComponent;
  let fixture: ComponentFixture<PoCheckboxGroupComponent>;
  let nativeElement: any;

  const fakeInstance = {
    changeValue: (value: any) => {},
    checkOptionModel: (value: any) => {},
    changeDetector: {
      detectChanges: () => {}
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoCheckboxGroupComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PoCheckboxGroupComponent);

    component = fixture.componentInstance;
    component.label = 'Label';
    component.help = 'Help';
    component.name = 'Model';
    component.options = [
      { value: '1', label: '1' },
      { value: '2', label: '2', disabled: true }
    ];

    changeDetector = fixture.componentRef.injector.get(ChangeDetectorRef);
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    fixture.debugElement.injector.get(NG_VALIDATORS);

    changeDetector.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create 2 checkbox options', () => {
    expect(nativeElement.querySelectorAll('po-checkbox').length).toBe(2);
  });

  it('should call setValidators on ngAfterViewChecked', () => {
    spyOn(fakeInstance.changeDetector, 'detectChanges');
    component.ngAfterViewChecked.call(fakeInstance);
    expect(fakeInstance.changeDetector.detectChanges).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should call `focus` if `autoFocus` is true.', () => {
      component.autoFocus = true;

      const spyFocus = spyOn(component, <any>'focus');

      component.ngAfterViewInit();

      expect(spyFocus).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn´t call `focus` if `autoFocus` is false.', () => {
      component.autoFocus = false;

      const spyFocus = spyOn(component, <any>'focus');

      component.ngAfterViewInit();

      expect(spyFocus).not.toHaveBeenCalled();
    });

    describe('onBlur:', () => {
      let setupTest;
      let checkboxMock;

      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          spyOn(component, 'showAdditionalHelp');
        };

        checkboxMock = {
          checkboxLabel: { nativeElement: document.createElement('input') }
        } as PoCheckboxComponent;
      });

      it('should call showAdditionalHelp when the tooltip is displayed', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: false });
        component.onBlur(checkboxMock);
        expect(component.showAdditionalHelp).toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when tooltip is not displayed', () => {
        setupTest('Mensagem de apoio adicional.', false, { observed: false });
        component.onBlur(checkboxMock);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when additionalHelp event is true', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: true });
        component.onBlur(checkboxMock);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });
    });

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        spyOn(component.additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        spyOn(component.additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });
    });

    describe('focus:', () => {
      const checkbox1 = document.createElement('po-checkbox');
      const checkbox2 = document.createElement('po-checkbox');
      const checkboxLabel = [
        {
          checkboxLabel: {
            nativeElement: checkbox1
          }
        },
        {
          checkboxLabel: {
            nativeElement: checkbox2
          }
        }
      ] as any;

      it('should call `focus` of checkbox.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1' },
          { label: 'teste2', value: 'teste2' }
        ];

        component.checkboxLabels = checkboxLabel;
        changeDetector.detectChanges();

        spyOn(component.checkboxLabels[0].checkboxLabel.nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels[0].checkboxLabel.nativeElement.focus).toHaveBeenCalled();
      });

      it('shouldn`t call `focus` of checkbox if option is `disabled`.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1', disabled: true },
          { label: 'teste2', value: 'teste2' }
        ];

        component.checkboxLabels = checkboxLabel;
        changeDetector.detectChanges();

        spyOn(component.checkboxLabels[0].checkboxLabel.nativeElement, 'focus');
        spyOn(component.checkboxLabels[1].checkboxLabel.nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels[0].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
        expect(component.checkboxLabels[1].checkboxLabel.nativeElement.focus).toHaveBeenCalled();
      });

      it('shouldn`t call `focus` if component is `disabled`.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1' },
          { label: 'teste2', value: 'teste2' }
        ];
        component.disabled = true;

        component.checkboxLabels = checkboxLabel;
        changeDetector.detectChanges();

        spyOn(component.checkboxLabels[0].checkboxLabel.nativeElement, 'focus');
        spyOn(component.checkboxLabels[1].checkboxLabel.nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels[0].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
        expect(component.checkboxLabels[1].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
      });

      it('shouldn`t call `focus` if all checkboxes are `disabled`.', () => {
        component.options = [
          { label: 'teste1', value: 'teste1', disabled: true },
          { label: 'teste2', value: 'teste2', disabled: true }
        ];

        component.checkboxLabels = checkboxLabel;
        changeDetector.detectChanges();

        spyOn(component.checkboxLabels[0].checkboxLabel.nativeElement, 'focus');
        spyOn(component.checkboxLabels[1].checkboxLabel.nativeElement, 'focus');

        component.focus();

        expect(component.checkboxLabels[0].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
        expect(component.checkboxLabels[1].checkboxLabel.nativeElement.focus).not.toHaveBeenCalled();
      });
    });

    describe('getAdditionalHelpTooltip:', () => {
      it('should return null when isAdditionalHelpEventTriggered returns true', () => {
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });

      it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
        const tooltip = 'Test Tooltip';
        component.additionalHelpTooltip = tooltip;
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBe(tooltip);
      });

      it('should return undefined when additionalHelpTooltip is undefined and isAdditionalHelpEventTriggered returns false', () => {
        component.additionalHelpTooltip = undefined;
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeUndefined();
      });
    });

    describe('getErrorPattern:', () => {
      it('should return true in hasInvalidClass if fieldErrorMessage', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = 'Field Invalid';
        component.required = true;
        expect(component.hasInvalidClass()).toBeTruthy();
        expect(component.getErrorPattern()).toBe('Field Invalid');
      });

      it('should return empty if fieldErrorMessage is undefined', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = undefined;
        expect(component.getErrorPattern()).toBe('');
      });
    });

    it('trackByFn: should return index', () => {
      const index = 1;
      expect(component.trackByFn(index)).toBe(index);
    });

    describe('onKeyDown:', () => {
      let option;
      let fakeEvent: any;
      let checkboxMock: PoCheckboxComponent;

      beforeEach(() => {
        option = {
          label: 'teste',
          value: 'teste'
        };

        fakeEvent = {
          which: 32,
          keyCode: 32,
          preventDefault: () => {}
        };

        checkboxMock = {
          checkboxLabel: { nativeElement: document.createElement('input') },
          focus: jasmine.createSpy('focus')
        } as unknown as PoCheckboxComponent;
      });

      it('should call `checkOption` and `preventDefault` when event which from spacebar', () => {
        spyOn(component, 'checkOption');
        spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, option, checkboxMock);

        expect(fakeEvent.preventDefault).toHaveBeenCalled();
        expect(component.checkOption).toHaveBeenCalledWith(option);
      });

      it('shouldn`t call `checkOption` and `preventDefault` when event which and event keyCode from tab', () => {
        fakeEvent.which = 9;
        fakeEvent.keyCode = 9;

        spyOn(component, 'checkOption');
        spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, option, checkboxMock);

        expect(component.checkOption).not.toHaveBeenCalled();
        expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      });

      it('should call `checkOption` and `preventDefault` when event keyCode from spacebar key and event which undefined', () => {
        fakeEvent.which = undefined;

        spyOn(component, 'checkOption');
        spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent, option, checkboxMock);

        expect(fakeEvent.preventDefault).toHaveBeenCalled();
        expect(component.checkOption).toHaveBeenCalledWith(option);
      });

      it('should emit event when field is focused', () => {
        spyOn(component.keydown, 'emit');
        spyOnProperty(document, 'activeElement', 'get').and.returnValue(checkboxMock.checkboxLabel.nativeElement);

        component.onKeyDown(fakeEvent, option, checkboxMock);

        expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
      });
    });

    describe('showAdditionalHelp:', () => {
      it('should toggle `displayAdditionalHelp` from false to true', () => {
        component.displayAdditionalHelp = false;

        const result = component.showAdditionalHelp();

        expect(result).toBeTrue();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should toggle `displayAdditionalHelp` from true to false', () => {
        component.displayAdditionalHelp = true;

        const result = component.showAdditionalHelp();

        expect(result).toBeFalse();
        expect(component.displayAdditionalHelp).toBeFalse();
      });
    });
  });

  describe('Templates:', () => {
    it('shouldn`t set `po-clickable` class if `disabled` is true.', () => {
      component.options = [
        { value: '1', label: '1' },
        { value: '2', label: '2' }
      ];
      component.disabled = true;

      changeDetector.detectChanges();

      expect(nativeElement.querySelectorAll('label.po-checkbox-group-label.po-clickable')[0]).toBeFalsy();
      expect(nativeElement.querySelectorAll('label.po-checkbox-group-label.po-clickable')[1]).toBeFalsy();
    });
  });
});
