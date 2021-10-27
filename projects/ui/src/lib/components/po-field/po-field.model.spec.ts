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

  it('should emit change', () => {
    spyOn(component.change, 'emit');
    component.emitChange('test');

    expect(component.change.emit).toHaveBeenCalled();
  });
});
