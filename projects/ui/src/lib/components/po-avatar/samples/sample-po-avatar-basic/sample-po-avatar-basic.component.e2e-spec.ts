import { SamplePoAvatarBasicComponentPO } from './sample-po-avatar-basic.component.po';

describe('SamplePoAvatarBasic E2E', () => {
  const avatar = new SamplePoAvatarBasicComponentPO();

  beforeEach(() => {
    avatar.navigateTo();
  });

  it('Check if the element Po Avatar is present', () => {
    expect(avatar.poAvatar.isPresent()).toBeTruthy();
  });
});
