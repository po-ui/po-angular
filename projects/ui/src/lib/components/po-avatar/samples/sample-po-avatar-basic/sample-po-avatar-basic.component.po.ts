import { browser, by, element } from 'protractor';

export class SamplePoAvatarBasicComponentPO {
  private sampleName = 'sample-po-avatar-basic';

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poAvatar() {
    return element(by.css(`${this.sampleName} .po-avatar`));
  }
}
