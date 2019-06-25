import { browser, by, element } from 'protractor';

export class SamplePoButtonBasicComponentPO {
  private sampleName = 'sample-po-button-basic';

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poButton() {
    return element(by.css(`${this.sampleName} .po-button`));
  }
}
