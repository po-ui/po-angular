import { browser, by, element } from 'protractor';

export class SamplePoLoginBasicComponentPO {
  private sampleName = 'sample-po-login-basic';

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poLoginInput() {
    return element(by.css(`${this.sampleName} po-login .po-field-container-content input[type="text"]`));
  }
}
