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

    const spyPropagateChange = vi.spyOn(component as any, 'propagateChange');

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
    const markForCheck = vi.spyOn(component['cd'] as any, 'markForCheck');

    component.setDisabledState(isDisabled);

    expect(component.disabled).toBe(true);
    expect(markForCheck).toHaveBeenCalled();
  });

  it('writeValue: should call onWriteValue with value', () => {
    const expectedValue = false;

    const spyOnWriteValue = vi.spyOn(component as any, 'onWriteValue');

    component.writeValue(expectedValue);

    expect(spyOnWriteValue).toHaveBeenCalledWith(expectedValue);
  });

  describe('emitAdditionalHelp:', () => {
    it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
      (component as any).label = 'this.label';
      vi.spyOn(component.additionalHelp as any, 'emit');
      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

      component.emitAdditionalHelp();

      expect(component.additionalHelp.emit).toHaveBeenCalled();
    });

    it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
      vi.spyOn(component.additionalHelp as any, 'emit');
      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

      component.emitAdditionalHelp();

      expect(component.additionalHelp.emit).not.toHaveBeenCalled();
    });
  });

  it('should emit change', () => {
    vi.spyOn(component.change as any, 'emit');
    component.emitChange('test');

    expect(component.change.emit).toHaveBeenCalled();
  });

  describe('getAdditionalHelpTooltip:', () => {
    it('should return null when isAdditionalHelpEventTriggered returns true', () => {
      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

      const result = component.getAdditionalHelpTooltip();

      expect(result).toBeNull();
    });

    it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
      const tooltip = 'Test Tooltip';
      component.additionalHelpTooltip = tooltip;
      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

      const result = component.getAdditionalHelpTooltip();

      expect(result).toBe(tooltip);
    });

    it('should return undefined when additionalHelpTooltip is undefined and isAdditionalHelpEventTriggered returns false', () => {
      component.additionalHelpTooltip = undefined;
      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

      const result = component.getAdditionalHelpTooltip();

      expect(result).toBeUndefined();
    });
  });

  describe('showAdditionalHelp:', () => {
    let helperEl: any;

    beforeEach(() => {
      helperEl = {
        openHelperPopover: vi.fn(),
        closeHelperPopover: vi.fn(),
        helperIsVisible: vi.fn().mockReturnValue(false)
      };
    });

    it('should call closeHelperPopover and return early when helperHtmlElement is visible', () => {
      (component as any).label = '';
      component.additionalHelpTooltip = undefined;
      component.displayAdditionalHelp = false;

      helperEl.helperIsVisible.mockReturnValue(true);

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.openHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBe(true);
    });

    it('should emit additionalHelp when isHelpEvt is true and then open popover if not visible', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined;

      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
      vi.spyOn(component.additionalHelp as any, 'emit');

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBe(true);
    });

    it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined;

      const helperOpt = { eventOnClick: vi.fn() };

      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

      const result = component.showAdditionalHelp(helperEl, helperOpt);

      expect(helperOpt.eventOnClick).toHaveBeenCalledTimes(1);
      expect(helperEl.helperIsVisible).not.toHaveBeenCalled();
      expect(helperEl.openHelperPopover).not.toHaveBeenCalled();
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBe(true);
    });

    it('should enter the block via additionalHelpTooltip and open popover', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;

      component.additionalHelpTooltip = 'any text';
      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

      const result = component.showAdditionalHelp(helperEl, undefined);
      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBe(true);
    });

    it('should not call eventOnClick when helper is a string and should proceed to open popover', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined;

      const helperString = 'any string';
      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

      const result = component.showAdditionalHelp(helperEl, helperString);

      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBe(true);
    });

    it('should enter the block via helperHtmlElement when others are falsy and open popover', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined;

      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBe(true);
    });

    it('should just toggle and return when label is truthy (outer if is false)', () => {
      (component as any).label = 'any label';
      component.displayAdditionalHelp = false;

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(result).toBe(true);
      expect(component.displayAdditionalHelp).toBe(true);
      expect(helperEl.helperIsVisible).not.toHaveBeenCalled();
      expect(helperEl.openHelperPopover).not.toHaveBeenCalled();
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
    });

    it('should enter via isHelpEvt when helper and tooltip are falsy, emit and open popover', () => {
      (component as any).label = '';
      component.displayAdditionalHelp = false;
      component.additionalHelpTooltip = undefined;

      vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
      vi.spyOn(component.additionalHelp as any, 'emit');

      const result = component.showAdditionalHelp(helperEl, undefined);

      expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
      expect(helperEl.helperIsVisible).toHaveBeenCalled();
      expect(helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
      expect(helperEl.closeHelperPopover).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
      expect(component.displayAdditionalHelp).toBe(true);
    });

    it('should toggle `displayAdditionalHelp` from false to true', () => {
      component.displayAdditionalHelp = false;

      const result = component.showAdditionalHelp();

      expect(result).toBe(true);
      expect(component.displayAdditionalHelp).toBe(true);
    });

    it('should toggle `displayAdditionalHelp` from true to false', () => {
      component.displayAdditionalHelp = true;

      const result = component.showAdditionalHelp();

      expect(result).toBe(false);
      expect(component.displayAdditionalHelp).toBe(false);
    });
  });
});
