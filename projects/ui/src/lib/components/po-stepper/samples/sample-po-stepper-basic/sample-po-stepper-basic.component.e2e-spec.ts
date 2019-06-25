import { SamplePoStepperBasicComponentPO } from './sample-po-stepper-basic.component.po';

describe('SamplePoStepperBasic E2E', () => {
  const stepper = new SamplePoStepperBasicComponentPO();

  beforeEach(() => {
    stepper.navigateTo();
  });

  it('Check if the element Po Stepper is present', () => {
    expect(stepper.poStepper.isPresent()).toBeTruthy();
  });
});
