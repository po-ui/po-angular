import { browser, by, element } from 'protractor';

export class SamplePoDatepickerBasicComponentPO {
  private sampleDatepicker = 'sample-po-datepicker-basic';

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poDatepicker() {
    return element(by.css(`${this.sampleDatepicker} .po-calendar`));
  }

  get poDatepickerIcon() {
    return element(by.css(`${this.sampleDatepicker} po-field-container .po-field-icon, .po-icon-calendar`));
  }
}
