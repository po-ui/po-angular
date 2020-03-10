import { SamplePoStepperLabsComponentPO } from './sample-po-stepper-labs.component.po';

describe('SamplePoStepperLabs E2E', () => {
  const stepper = new SamplePoStepperLabsComponentPO();

  beforeAll(() => {
    stepper.navigateTo();
  });

  it('Check if the element Stepper is present', () => {
    expect(stepper.poStepper.isPresent()).toBeTruthy();
  });
});
