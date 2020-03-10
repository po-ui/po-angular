import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoStepperBaseComponent } from './po-stepper-base.component';
import { PoStepperStatus } from './enums/po-stepper-status.enum';

describe('PoStepperBaseComponent:', () => {
  const component = new PoStepperBaseComponent();

  it('should be created', () => {
    expect(component instanceof PoStepperBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-sequential: should update property with `true` if valid values', () => {
      const validValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'sequential', validValues, true);
    });

    it('p-sequential: should update property with `false` if invalid values', () => {
      const invalidValues = [false, 'false', 0, undefined, null];

      expectPropertiesValues(component, 'sequential', invalidValues, false);
    });

    it('p-step: should set property with valid values and active first step', () => {
      const validValues = [1, 2, 3];

      component.steps = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }];

      expectPropertiesValues(component, 'step', validValues, validValues);
      expect(component.steps[0].status).toBe(PoStepperStatus.Active);
    });

    it('p-step: shouldn`t set property with invalid values', () => {
      const invalidValues = [0, 3, undefined, null, {}, ''];

      component.steps = [{ label: 'Step 1' }];

      expectPropertiesValues(component, 'step', invalidValues, 1);
    });

    it('p-steps: should update property with empty `array` if invalid values', () => {
      const invalidValues = [false, 0, [], undefined, null, {}, ''];

      expectPropertiesValues(component, 'steps', invalidValues, []);
    });

    it('p-steps: should update property with `array` with status default and initial step 1', () => {
      component.steps = [{ label: 'Step 1' }, { label: 'Step 2' }];

      expect(component.steps[0].status).toBe(PoStepperStatus.Active);
      expect(component.steps[1].status).toBe(PoStepperStatus.Default);
      expect(component.step).toBe(1);
    });

    it('p-orientation: should update property with `horizontal` when invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string', [], {}];

      expectPropertiesValues(component, 'orientation', invalidValues, 'horizontal');
    });

    it('p-orientation: should update property with valid values', () => {
      const validValues = ['horizontal', 'vertical'];

      expectPropertiesValues(component, 'orientation', validValues, validValues);
    });
  });
});
