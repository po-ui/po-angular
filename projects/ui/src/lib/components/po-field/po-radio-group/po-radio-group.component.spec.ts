import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as UtilsFunctions from '../../../utils/util';
import { removeDuplicatedOptions } from '../../../utils/util';

import { PoFieldContainerBottomComponent } from '../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoRadioComponent } from '../po-radio/po-radio.component';
import { PoRadioGroupBaseComponent } from './po-radio-group-base.component';
import { PoRadioGroupComponent } from './po-radio-group.component';

describe('PoRadioGroupComponent:', () => {
  let component: PoRadioGroupComponent;
  let fixture: ComponentFixture<PoRadioGroupComponent>;

  let debugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PoRadioGroupComponent,
        PoFieldContainerComponent,
        PoFieldContainerBottomComponent,
        PoRadioComponent
      ],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(PoRadioGroupComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.options = [{ value: '1', label: '1' }];

    debugElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoRadioGroupComponent).toBeTruthy();
    expect(component instanceof PoRadioGroupBaseComponent).toBeTruthy();
  });

  it('should have help', () => {
    fixture.detectChanges();
    expect(debugElement.innerHTML).toContain('Help de teste');
  });

  it('should call changeValue when clicked and enabled', () => {
    component['onTouched'] = value => {};
    spyOn(component, <any>'onTouched');
    spyOn(component, 'changeValue');

    component.eventClick('valor', false);

    expect(component.changeValue).toHaveBeenCalledWith('valor');
    expect(component['onTouched']).toHaveBeenCalledWith();
  });

  it('shouldn`t call changeValue when clicked and disabled', () => {
    component['onTouched'] = value => {};
    spyOn(component, <any>'onTouched');
    spyOn(component, 'changeValue');

    component.eventClick('valor', true);

    expect(component.changeValue).not.toHaveBeenCalledWith('valor');
    expect(component['onTouched']).not.toHaveBeenCalledWith();
  });

  it('eventClick: shouldn´t throw error if onTouched is falsy when clicked and enabled', () => {
    component['onTouched'] = null;

    const fnError = () => component.eventClick('valor', false);

    expect(fnError).not.toThrow();
  });

  it('eventClick: shouldn´t throw error if onTouched is falsy when clicked and disabled', () => {
    component['onTouched'] = null;

    const fnError = () => component.eventClick('valor', true);

    expect(fnError).not.toThrow();
  });

  it('should return null when not exists a input with this value', () => {
    expect(component.getElementByValue('2')).toBeNull();
  });

  it('should not call removeDuplicatedOptions', () => {
    const fakeThis = {
      differ: {
        diff: (opt: any) => false
      },
      cd: {
        markForCheck: () => {}
      }
    };
    spyOn(UtilsFunctions, 'removeDuplicatedOptions');
    component.ngDoCheck.call(fakeThis);
    expect(removeDuplicatedOptions).not.toHaveBeenCalled();
  });

  describe('Methods:', () => {
    const fakeEventArrowKey: any = {
      keyCode: 37,
      which: 37
    };

    it('ngAfterViewInit: should call `focus` if `autoFocus` is true.', () => {
      component.autoFocus = true;

      const spyFocus = spyOn(component, 'focus');
      component.ngAfterViewInit();

      expect(spyFocus).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn´t call `focus` if `autoFocus` is false.', () => {
      component.autoFocus = false;

      const spyFocus = spyOn(component, 'focus');
      component.ngAfterViewInit();

      expect(spyFocus).not.toHaveBeenCalled();
    });

    describe('getErrorPattern:', () => {
      it('should return true in hasInvalidClass if fieldErrorMessage', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.inputEl.nativeElement.value = '';
        component.fieldErrorMessage = 'Field Invalid';
        component.required = true;
        expect(component.hasInvalidClass()).toBeTruthy();
        expect(component.getErrorPattern()).toBe('Field Invalid');
      });

      it('should return empty if fieldErrorMessage is undefined', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.inputEl.nativeElement.value = '';
        component.fieldErrorMessage = undefined;
        expect(component.getErrorPattern()).toBe('');
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
      it('should call `focus` of radio', () => {
        component.options = [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ];

        fixture.detectChanges();

        spyOn(component.radioLabels.toArray()[0], 'focus');

        component.focus();

        expect(component.radioLabels.toArray()[0].focus).toHaveBeenCalled();
      });

      it('should call second radio option if the first option is disabled', () => {
        component.options = [
          { label: 'Option 1', value: '1', disabled: true },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' }
        ];

        fixture.detectChanges();

        spyOn(component.radioLabels.toArray()[0], 'focus');
        spyOn(component.radioLabels.toArray()[1], 'focus');

        component.focus();

        expect(component.radioLabels.toArray()[0].focus).not.toHaveBeenCalled();
        expect(component.radioLabels.toArray()[1].focus).toHaveBeenCalled();
      });

      it('shouldn`t call `focus` of radio if `disabled` property of component is true', () => {
        component.options = [
          { label: 'Option 1', value: '1', disabled: true },
          { label: 'Option 2', value: '2' }
        ];
        component.disabled = true;

        fixture.detectChanges();

        spyOn(component.radioLabels.toArray()[0], 'focus');
        spyOn(component.radioLabels.toArray()[1], 'focus');

        component.focus();

        expect(component.radioLabels.toArray()[0].focus).not.toHaveBeenCalled();
        expect(component.radioLabels.toArray()[1].focus).not.toHaveBeenCalled();
      });

      it('shouldn`t call `focus` of radio if `undefined` property of component is true', () => {
        component.options = [{ label: 'Option 1', value: '1', disabled: true }];
        component.disabled = false;

        fixture.detectChanges();

        const spy = spyOn(component.radioLabels.toArray()[0], 'focus');

        component.focus();

        expect(spy).not.toHaveBeenCalled();
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

    it('p-keydown: should emit event', () => {
      const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(component.keydown, 'emit');

      component.onKeyDown(fakeEvent);

      expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
    });

    describe('onKeyUp:', () => {
      it('should call `changeValue` when `isArrowKey` is true.', () => {
        spyOn(component, 'changeValue');
        component.onKeyUp(fakeEventArrowKey, 1);
        expect(component.changeValue).toHaveBeenCalled();
      });

      it('should`nt call `changeValue` when `isArrowKey` is false.', () => {
        const fakeEvent: any = {
          keyCode: 30,
          which: 20
        };

        spyOn(component, <any>'isArrowKey').and.returnValue(false);
        spyOn(component, 'changeValue');

        component.onKeyUp(fakeEvent, 1);

        expect(component['isArrowKey']).toHaveBeenCalledWith(30);
        expect(component.changeValue).not.toHaveBeenCalled();
      });

      it('should`nt call `changeValue` when `isArrowKey` is false.', () => {
        const fakeEvent: any = {
          which: 20
        };

        spyOn(component, <any>'isArrowKey').and.returnValue(false);
        spyOn(component, 'changeValue');

        component.onKeyUp(fakeEvent, 1);

        expect(component['isArrowKey']).toHaveBeenCalledWith(20);
        expect(component.changeValue).not.toHaveBeenCalled();
      });
    });

    it('isArrowKey: should return true when key is between 37 and 40.', () => {
      expect(component['isArrowKey'](37)).toBeTruthy();
      expect(component['isArrowKey'](38)).toBeTruthy();
      expect(component['isArrowKey'](39)).toBeTruthy();
      expect(component['isArrowKey'](40)).toBeTruthy();
    });

    it('isArrowKey: should return false when key is not between 37 and 40.', () => {
      expect(component['isArrowKey'](36)).toBeFalsy();
      expect(component['isArrowKey'](41)).toBeFalsy();
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
    const eventKeyBoard = document.createEvent('KeyboardEvent');
    eventKeyBoard.initEvent('keyup', true, true);
    Object.defineProperty(eventKeyBoard, 'keyCode', { value: 37 });

    it('shouldn`t contain `po-clickable` class if input is disabled', () => {
      component.options = [{ label: 'Po', value: 'po', disabled: true }];
      component.disabled = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-radio-group-label.po-clickable')).toBeNull();
    });
  });
});
