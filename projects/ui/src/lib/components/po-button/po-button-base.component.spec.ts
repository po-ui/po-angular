import { PoButtonBaseComponent } from './po-button-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoButtonKind } from './po-button-kind.enum';
import { PoButtonSize } from './po-button-size.enum';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('PoButtonBaseComponent', () => {
  let component: PoButtonBaseComponent;

  beforeEach(() => {
    component = new PoButtonBaseComponent();
  });

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

  it('should set property `p-small` with true if p-size is equal `small`', () => {
    component.size = 'small';

    expect(component.small).toBeTrue();
  });

  it('should update property `p-kind` with valid values', () => {
    component.danger = false;
    const validValues = ['primary', 'secondary', 'tertiary'];

    expectPropertiesValues(component, 'kind', validValues, validValues);
  });

  it('should update property `p-kind` with `secondary` when invalid values', () => {
    const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

    expectPropertiesValues(component, 'kind', invalidValues, 'secondary');
  });

  it('should set `p-danger` with false if `p-kind` is tertiary', () => {
    component.kind = PoButtonKind.tertiary;
    component.danger = true;
    expect(component.danger).toBe(false);
  });

  it('should set `p-danger` with true if `p-kind` is not tertiary', () => {
    component.kind = PoButtonKind.primary;
    component.danger = true;
    expect(component.danger).toBe(true);
  });

  it('should update property `p-size` with valid values', () => {
    const validValues = ['medium', 'large'];

    expectPropertiesValues(component, 'size', validValues, validValues);
  });

  it('should update property `p-size` with `medium` when invalid values', () => {
    const invalidValues = ['extraSmall', 'extraLarge'];

    expectPropertiesValues(component, 'size', invalidValues, 'medium');
  });

  it('should update property `p-size` with `small` if `p-small` was declared in first', () => {
    component.small = true;
    component.size = PoButtonSize.large;

    expect(component.size).toBe('small');
  });

  it('should ignore property `p-small` if `p-size` was declared in first with value different of `small`', () => {
    component.size = PoButtonSize.large;
    component.small = true;

    expect(component.size).toBe('large');
  });
});
