import { browser, by, element } from 'protractor';

export class SamplePoStepperBasicComponentPO {
  private sampleName = 'sample-po-stepper-basic';

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poStepper() {
    return element(by.css(`${this.sampleName} .po-stepper`));
  }
}
