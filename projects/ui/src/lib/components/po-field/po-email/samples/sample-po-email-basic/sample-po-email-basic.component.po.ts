import { browser, by, element } from 'protractor';

export class SamplePoEmailBasicComponentPO {
  private sampleName = 'sample-po-email-basic';

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poEmailInput() {
    return element(by.css(`${this.sampleName} po-email .po-field-container-content input[type="email"]`));
  }
}
