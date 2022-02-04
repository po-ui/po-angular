import { PoButtonBaseComponent } from './po-button-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';

describe('PoButtonBaseComponent', () => {
  const component = new PoButtonBaseComponent();

  const booleanValidTrueValues = [true, 'true', 1, ''];
  const booleanValidFalseValues = [false, 'false', 0];
  const booleanInvalidValues = [undefined, null, 2, 'string'];

  it('should be created', () => {
    expect(component instanceof PoButtonBaseComponent).toBeTruthy();
  });

  it('should update property `p-disabled` with valid values', () => {
    expectPropertiesValues(component, 'disabled', booleanValidTrueValues, true);
    expectPropertiesValues(component, 'disabled', booleanValidFalseValues, false);
  });

  it('should update property `p-disabled` with `false` when invalid values', () => {
    expectPropertiesValues(component, 'disabled', booleanInvalidValues, false);
  });

  it('should update property `p-small` with valid values', () => {
    expectPropertiesValues(component, 'small', booleanValidTrueValues, true);
    expectPropertiesValues(component, 'small', booleanValidFalseValues, false);
  });

  it('should update property `p-small` with `false` when invalid values', () => {
    expectPropertiesValues(component, 'small', booleanInvalidValues, false);
  });

  it('should update property `p-large` with valid values', () => {
    expectPropertiesValues(component, 'large', booleanValidTrueValues, true);
    expectPropertiesValues(component, 'large', booleanValidFalseValues, false);
  });

  it('should update property `p-large` with `false` when invalid values', () => {
    expectPropertiesValues(component, 'large', booleanInvalidValues, false);
  });

  it('should update property `p-type` with `primary`', () => {
    const validValues = ['primary'];
    component.danger = false;

    expectPropertiesValues(component, 'type', validValues, 'primary');
  });

  it('should update property `p-type` with `secondary`', () => {
    const validValues = ['secondary'];
    component.danger = false;

    expectPropertiesValues(component, 'type', validValues, 'secondary');
  });

  it('should update property `p-type` with `tertiary`', () => {
    const validValues = ['tertiary'];
    component.danger = false;

    expectPropertiesValues(component, 'type', validValues, 'tertiary');
  });

  it('should update property `p-type` with `tertiary` if `link`', () => {
    const validValues = ['link'];
    component.danger = false;

    expectPropertiesValues(component, 'type', validValues, 'tertiary');
  });

  it('should update property `p-type` with `secondary` if `danger`', () => {
    const validValues = ['danger'];

    expectPropertiesValues(component, 'type', validValues, 'secondary');
  });

  it('should update property `p-type` with `secondary` if `default`', () => {
    const validValues = ['default'];
    component.danger = false;

    expectPropertiesValues(component, 'type', validValues, 'secondary');
  });

  it('should update property `p-type` with `default` when invalid values', () => {
    const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

    expectPropertiesValues(component, 'type', invalidValues, 'secondary');
  });

  it('should update property `p-type` with `secondary` if `danger` is true and type is tertiary', () => {
    component.type = 'tertiary';
    component.danger = true;
    const expectedValue = 'secondary';
    expect(component.type).toEqual(expectedValue);
  });

  it('should update the size of the button with `medium` if `p-small` and `p-large` are true', () => {
    component.small = true;
    component.large = true;

    expect(component.size).toEqual('medium');
  });

  it('should update the size of the button with `large` if `p-small` is false and `p-large` is true', () => {
    component.small = false;
    component.large = true;

    expect(component.size).toEqual('large');
  });

  it('should update the size of the button with `medium` if `p-small` and `p-large` are false', () => {
    component.small = false;
    component.large = false;

    expect(component.size).toEqual('medium');
  });
});
