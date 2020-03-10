import { SamplePoLoginBasicComponentPO } from './sample-po-login-basic.component.po';

describe('SamplePoLoginBasic E2E', () => {
  const loginPO = new SamplePoLoginBasicComponentPO();

  beforeEach(() => {
    loginPO.navigateTo();
  });

  it('check if the element Po Login is present', () => {
    expect(loginPO.poLoginInput.isPresent()).toBeTruthy();
  });
});
