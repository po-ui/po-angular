import { browser, by, element } from 'protractor';

export class SamplePoStepperLabsComponentPO {
  private sampleName = 'sample-po-stepper-labs';

  private poRadioGroupLabel = '.po-radio-group-label';

  navigateTo() {
    return browser.get(browser.baseUrl + '/documentation/po-stepper?view=web' + '/documentation/po-stepper?view=web');
  }

  get poStepper() {
    return element(by.css(`${this.sampleName} .po-stepper`));
  }
}
