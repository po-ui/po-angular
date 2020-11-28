import { PoModalBaseComponent } from './po-modal-base.component';

import { expectPropertiesValues, expectSettersMethod } from './../../util-test/util-expect.spec';
import { PoLanguageService } from '../../services';

describe('PoModalBaseComponent:', () => {
  let component: PoModalBaseComponent;

  beforeEach(() => {
    component = new PoModalBaseComponent(new PoLanguageService());
  });

  it('should create component hidden', () => {
    expect(component instanceof PoModalBaseComponent).toBeTruthy();
    expect(component['isHidden']).toBeTruthy();
  });

  it('should be call open method', () => {
    component.open();
    expect(component['isHidden']).toBeFalsy();
  });

  it('should be call close method', () => {
    component.close();
    expect(component['isHidden']).toBeTruthy();
  });

  it('should update property `p-size` with valid values', () => {
    const validValues = ['sm', 'md', 'lg', 'xl', 'auto'];

    expectPropertiesValues(component, 'size', validValues, validValues);
  });

  it('should update property `p-size` with `md` when invalid values', () => {
    const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

    expectPropertiesValues(component, 'size', invalidValues, 'md');
  });

  it('should be update property p-click-out', () => {
    expectSettersMethod(component, 'setClickOut', undefined, 'clickOut', false);
    expectSettersMethod(component, 'setClickOut', '', 'clickOut', false);
    expectSettersMethod(component, 'setClickOut', false, 'clickOut', false);
    expectSettersMethod(component, 'setClickOut', true, 'clickOut', true);
    expectSettersMethod(component, 'setClickOut', 'true', 'clickOut', true);
    expectSettersMethod(component, 'setClickOut', 'false', 'clickOut', false);
  });

  it('should emit `onClosedX` if xClosed is true', () => {
    spyOn(component.onXClosed, 'emit');

    component.close(true);

    expect(component.onXClosed.emit).toHaveBeenCalled();
  });

  it('should not emit `onClosedX` if xClosed is false', () => {
    spyOn(component.onXClosed, 'emit');

    component.close(false);

    expect(component.onXClosed.emit).not.toHaveBeenCalled();
  });

  it('should complete primaryAction when is incomplete in validPrimaryAction', () => {
    component.primaryAction = {
      action: undefined,
      label: undefined
    };

    component.validPrimaryAction();

    expect(component.primaryAction.label).toBe(component.literals.close);
    expect(component.primaryAction.action).not.toBeUndefined();

    spyOn(component, 'close');
    component.primaryAction.action();
    expect(component.close).toHaveBeenCalled();
  });

  it('should complete primaryAction when is undefined in validPrimaryAction', () => {
    component.primaryAction = undefined;
    component.validPrimaryAction();
    expect(component.primaryAction.label).toBe(component.literals.close);
    expect(component.primaryAction.action).not.toBeUndefined();

    spyOn(component, 'close');
    component.primaryAction.action();
    expect(component.close).toHaveBeenCalled();
  });

  it('should keep values in primaryAction when is complete', () => {
    component.primaryAction = {
      action: () => 'value',
      label: 'Confirm'
    };
    component.validPrimaryAction();
    expect(component.primaryAction.label).toBe('Confirm');
    expect(component.primaryAction.action()).toBe('value');
  });

  describe('Properties:', () => {
    const invalidValues = [0, 2018, 'string', false, null, undefined];
    const validValues = [true, '', 1];

    it('p-hide-close: should update when set valid values.', () => {
      expectPropertiesValues(component, 'hideClose', validValues, true);
    });

    it('p-hide-close: shouldn´t update when set invalid values.', () => {
      expectPropertiesValues(component, 'hideClose', invalidValues, false);
    });
  });
});
