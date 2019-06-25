import { SamplePoButtonBasicComponentPO } from './sample-po-button-basic.component.po';

describe('SamplePoButtonBasic E2E', () => {
  const button = new SamplePoButtonBasicComponentPO();

  beforeEach(() => {
    button.navigateTo();
  });

  it('Check if the element Po Button is present', () => {
    expect(button.poButton.isPresent()).toBeTruthy();
  });
});
