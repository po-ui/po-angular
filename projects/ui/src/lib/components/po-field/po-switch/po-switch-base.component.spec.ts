import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectPropertiesValues, expectSettersMethod } from '../../../util-test/util-expect.spec';

import { PoSwitchBaseComponent } from './po-switch-base.component';
import { PoSwitchLabelPosition } from './po-switch-label-position.enum';

describe('PoSwitchBaseComponent:', () => {
  let component: PoSwitchBaseComponent;
  let fakeInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChangeDetectorRef]
    });

    const changeDetector = TestBed.inject(ChangeDetectorRef);

    component = new PoSwitchBaseComponent(changeDetector);

    fakeInstance = {
      disabled: false,
      switchValue: false,
      changeValue: (value: any) => {},
      changeDetector: {
        markForCheck: () => {}
      },
      propagateChange: (value: any) => {},
      ngModelChange: {
        emit: (value: any) => {}
      },
      ngControl: {
        control: {
          setValidators: ([]) => {}
        }
      }
    };
  });

  it('should be created', () => {
    component.registerOnChange(() => {});
    component.registerOnTouched(() => {});
    expect(component).toBeTruthy();
  });

  it('should be update property p-label-on', () => {
    expectSettersMethod(component, 'setLabelOn', '', 'labelOn', 'true');
    expectSettersMethod(component, 'setLabelOn', 'On', 'labelOn', 'On');
  });

  it('should be update property p-label-off', () => {
    expectSettersMethod(component, 'setLabelOff', '', 'labelOff', 'false');
    expectSettersMethod(component, 'setLabelOff', 'Off', 'labelOff', 'Off');
  });

  it('should be update property p-label-position', () => {
    expectSettersMethod(component, 'setLabelPosition', '', 'labelPosition', PoSwitchLabelPosition.Right);
    expectSettersMethod(
      component,
      'setLabelPosition',
      PoSwitchLabelPosition.Left,
      'labelPosition',
      PoSwitchLabelPosition.Left
    );
  });

  it('shouldn`t call changeValue on eventClick if disabled = true', () => {
    fakeInstance.disabled = true;

    spyOn(fakeInstance, 'changeValue');
    component.eventClick.call(fakeInstance);
    expect(fakeInstance.changeValue).not.toHaveBeenCalled();
  });

  it('should call changeValue on eventClick', () => {
    fakeInstance.disabled = false;

    spyOn(fakeInstance, 'changeValue');
    component.eventClick.call(fakeInstance);
    expect(fakeInstance.changeValue).toHaveBeenCalled();
  });

  it('should update switchValue on changeValue (propagateChange)', () => {
    component.switchValue = false;
    component.propagateChange = (value: any) => {}; // simula o propagateChange

    spyOn(component, 'propagateChange');
    spyOn(component.change, 'emit');

    component.changeValue(true);

    expect(component.switchValue).toBeTruthy();
    expect(component.propagateChange).toHaveBeenCalledWith(true);
    expect(component.change.emit).toHaveBeenCalledWith(true);
  });

  it('should update switchValue on changeValue (ngModelChange)', () => {
    component.switchValue = false;
    component.propagateChange = undefined;

    spyOn(component.ngModelChange, 'emit');
    spyOn(component.change, 'emit');

    component.changeValue(true);

    expect(component.switchValue).toBeTruthy();
    expect(component.ngModelChange.emit).toHaveBeenCalledWith(true);
    expect(component.change.emit).toHaveBeenCalledWith(true);
  });

  it('shouldn`t updated switchValue on changeValue if new value equal old value', () => {
    component.switchValue = true;
    component.propagateChange = (value: any) => {}; // simula o propagateChange

    spyOn(component, 'propagateChange');
    spyOn(component.change, 'emit');

    component.changeValue(true);

    expect(component.propagateChange).not.toHaveBeenCalled();
    expect(component.change.emit).not.toHaveBeenCalled();
  });

  it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
    const expectedValue = true;
    component.setDisabledState(expectedValue);
    expect(component.disabled).toBe(expectedValue);
  });

  it('should updated switchValue on writeValue', () => {
    component.switchValue = true;

    component['changeDetector'] = <any>{ markForCheck: () => {} };
    spyOn(component['changeDetector'], 'markForCheck');

    component.writeValue(false);

    expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
    expect(component.switchValue).toBeFalsy();
  });

  it('shouldn`t updated switchValue on writeValue if new value equals old value', () => {
    component.switchValue = true;

    component['changeDetector'] = <any>{ markForCheck: () => {} };

    spyOn(component['changeDetector'], 'markForCheck');

    component.writeValue(true);

    expect(component['changeDetector'].markForCheck).not.toHaveBeenCalled();
    expect(component.switchValue).toBeTruthy();
  });

  describe('Methods:', () => {
    it('changeValue: should call `change.emit` when switch value is changed', () => {
      component.switchValue = true;

      spyOn(component.change, 'emit');
      component.changeValue(false);

      expect(component.change.emit).toHaveBeenCalledWith(false);
    });

    it('changeValue: shouldn`t call `change.emit` when switch value is not changed', () => {
      component.switchValue = true;

      spyOn(component.change, 'emit');
      component.changeValue(true);

      expect(component.change.emit).not.toHaveBeenCalled();
    });

    it('changeValue: should call `propagateChange` when switch value is changed and have a propagateChange', () => {
      component.switchValue = true;

      component.propagateChange = value => {};

      spyOn(component, 'propagateChange');
      spyOn(component.ngModelChange, 'emit');
      component.changeValue(false);

      expect(component.propagateChange).toHaveBeenCalledWith(false);
      expect(component.ngModelChange.emit).not.toHaveBeenCalled();
    });

    it('changeValue: should call `ngModelChange` when switch value is changed and not have a propagateChange', () => {
      component.switchValue = true;

      component.propagateChange = undefined;

      spyOn(component.ngModelChange, 'emit');
      component.changeValue(false);

      expect(component.ngModelChange.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('Properties:', () => {
    it('p-disabled: should be update with valid and invalid values.', () => {
      const trueValues = [true, 'true', 1, '', [], {}];
      const falseValues = [false, 'false', 0, null, undefined, NaN];

      expectPropertiesValues(component, 'disabled', trueValues, true);
      expectPropertiesValues(component, 'disabled', falseValues, false);
    });
  });
});
