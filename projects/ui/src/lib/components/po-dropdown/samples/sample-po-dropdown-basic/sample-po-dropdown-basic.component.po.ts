import { browser, by, element } from 'protractor';

export class SamplePoDropdownBasicComponentPO {
  private sampleName = 'sample-po-dropdown-basic';

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poDropdown() {
    return element(by.css(`${this.sampleName} .dropdown .button-dropdown`));
  }

  get poDropdownContent() {
    return element.all(by.css(`${this.sampleName} .dropdown .dropdown-content li a`));
  }
}
