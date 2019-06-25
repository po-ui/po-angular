import { SamplePoEmailBasicComponentPO } from './sample-po-email-basic.component.po';

describe('SamplePoEmailBasic E2E', () => {
  const email = new SamplePoEmailBasicComponentPO();

  beforeEach(() => {
    email.navigateTo();
  });

  it('Check if the element Po Email is present', () => {
    expect(email.poEmailInput.isPresent()).toBeTruthy();
  });
});
