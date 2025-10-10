import { PoFieldModel } from './po-field.model';

class Field extends PoFieldModel<any> {
  onWriteValue() {}
}

describe('PoFieldModel', () => {
  let component: Field;

  beforeEach(() => {
    const changeDetector: any = { markForCheck: () => {} };
    component = new Field(changeDetector);
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
    const markForCheck = spyOn(component['cd'], 'markForCheck');

    component.setDisabledState(isDisabled);

    expect(component.disabled).toBe(true);
    expect(markForCheck).toHaveBeenCalled();
  });

  it('writeValue: should call onWriteValue with value', () => {
    const expectedValue = false;

    const spyOnWriteValue = spyOn(component, <any>'onWriteValue');

    component.writeValue(expectedValue);

    expect(spyOnWriteValue).toHaveBeenCalledWith(expectedValue);
  });

  describe('emitAdditionalHelp:', () => {
    it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
      (component as any).label = 'this.label';
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
    let helperEl: any;

    beforeEach(() => {
      helperEl = {
        openHelperPopover: jasmine.createSpy('openHelperPopover'),
        closeHelperPopover: jasmine.createSpy('closeHelperPopover'),
        helperIsVisible: jasmine.createSpy('helperIsVisible').and.returnValue(false)
      };
    });

    it('should call closeHelperPopover and return early when helperHtmlElement is visible', () => {
      (component as any).label = '';
      component.additionalHelpTooltip = undefined as any;
      component.displayAdditionalHelp = false;

      helperEl.helperIsVisible.and.returnValue(true);

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.openHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBeTrue();
    });

    it('should emit additionalHelp when isHelpEvt is true and then open popover if not visible', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined as any;

      spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);
      spyOn(component.additionalHelp, 'emit');

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBeTrue();
    });

    it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined as any;

      const helperOpt = { eventOnClick: jasmine.createSpy('eventOnClick') };

      spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

      const result = component.showAdditionalHelp(helperEl, helperOpt);

      expect(helperOpt.eventOnClick).toHaveBeenCalledTimes(1);
      expect(helperEl.helperIsVisible).not.toHaveBeenCalled();
      expect(helperEl.openHelperPopover).not.toHaveBeenCalled();
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBeTrue();
    });

    it('should enter the block via additionalHelpTooltip and open popover', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;

      component.additionalHelpTooltip = 'any text';
      spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

      const result = component.showAdditionalHelp(helperEl, undefined);
      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBeTrue();
    });

    it('should not call eventOnClick when helper is a string and should proceed to open popover', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined as any;

      const helperString = 'any string';
      spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

      const result = component.showAdditionalHelp(helperEl, helperString);

      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBeTrue();
    });

    it('should enter the block via helperHtmlElement when others are falsy and open popover', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined as any;

      spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBeTrue();
    });

    it('should just toggle and return when label is truthy (outer if is false)', () => {
      (component as any).label = 'any label';
      component.displayAdditionalHelp = false;

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(result).toBeTrue();
      expect(component.displayAdditionalHelp).toBeTrue();
      expect(helperEl.helperIsVisible).not.toHaveBeenCalled();
      expect(helperEl.openHelperPopover).not.toHaveBeenCalled();
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
    });

    it('should enter via isHelpEvt when helper and tooltip are falsy, emit and open popover', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined as any;

      spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);
      spyOn(component.additionalHelp, 'emit');

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBeTrue();
    });

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
