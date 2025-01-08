import { PoFieldModel } from './po-field.model';

class Field extends PoFieldModel<any> {
  onWriteValue() {}
}

describe('PoFieldModel', () => {
  let component: Field;

  beforeEach(() => {
    component = new Field();
  });

  it('should be created', () => {
    expect(component instanceof Field).toBeTruthy();
  });

  it('registerOnChange: should set propagateChange property', () => {
    const fnChange = () => {};

    component.registerOnChange(fnChange);

    expect(component['propagateChange']).toBe(fnChange);
  });

  it('registerOnTouched: should set ounTouched property', () => {
    const fnTouched = () => {};

    component.registerOnTouched(fnTouched);

    expect(component['onTouched']).toBe(fnTouched);
  });

  it(`updateModel: should call propagateChange with model param`, () => {
    const expectedValue = 'newValue';
    component['propagateChange'] = () => {};

    const spyPropagateChange = spyOn(component, <any>'propagateChange');

    component['updateModel'](expectedValue);

    expect(spyPropagateChange).toHaveBeenCalledWith(expectedValue);
  });

  it(`updateModel: shouldn't call propagateChange if propagateChange is falsy`, () => {
    const expectedValue = 'newValue';

    component['propagateChange'] = undefined;

    component['updateModel'](expectedValue);

    expect(component['propagateChange']).toBeUndefined();
  });

  it('setDisabledState: should set disabled property', () => {
    const isDisabled = true;

    component.setDisabledState(isDisabled);

    expect(component.disabled).toBe(true);
  });

  it('writeValue: should call onWriteValue with value', () => {
    const expectedValue = false;

    const spyOnWriteValue = spyOn(component, <any>'onWriteValue');

    component.writeValue(expectedValue);

    expect(spyOnWriteValue).toHaveBeenCalledWith(expectedValue);
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

  it('should emit change', () => {
    spyOn(component.change, 'emit');
    component.emitChange('test');

    expect(component.change.emit).toHaveBeenCalled();
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
