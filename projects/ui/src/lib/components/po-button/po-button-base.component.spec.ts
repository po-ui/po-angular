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

  it('should update property `p-type` with `secondary` if `danger` is true', () => {
    component.danger = true;
    const expectedValue = 'secondary';
    expect(component.type).toEqual(expectedValue);
  });
});
