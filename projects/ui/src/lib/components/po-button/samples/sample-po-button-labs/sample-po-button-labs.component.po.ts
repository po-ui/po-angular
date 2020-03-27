import { browser, by, element } from 'protractor';

export class SamplePoButtonLabsComponentPO {
  private sampleName = 'sample-po-button-labs';

  private poCheckboxGroupProperties = 'po-checkbox-group[name="properties"] .po-checkbox-group-input';
  private poCheckboxGroupPropertiesLabel = '.po-checkbox-group-label';
  private poRadioGroupLabel = '.po-radio-group-label';

  private getPoButtonProperties(prop) {
    return element(
      by.css(
        `${this.sampleName} ${this.poCheckboxGroupProperties}[value="${prop}"]+${this.poCheckboxGroupPropertiesLabel}`
      )
    );
  }

  private getPoButtonIcon(icon) {
    return element(
      by.css(
        `${this.sampleName} po-radio-group[name="icon"] .po-radio-group-input[value="${icon}"]+${this.poRadioGroupLabel}`
      )
    );
  }

  private getPoButtonType(type) {
    return element(
      by.css(
        `${this.sampleName} po-radio-group[name="type"] .po-radio-group-input[value="${type}"]+${this.poRadioGroupLabel}`
      )
    );
  }

  navigateTo() {
    return browser.get(browser.baseUrl + '/documentation/po-button?view=web' + '/documentation/po-button?view=web');
  }

  get poButton() {
    return element(by.css(`${this.sampleName} .po-button`));
  }

  get poButtonIcon() {
    return element(by.css(`${this.sampleName} po-button span.po-icon`));
  }

  get poModal() {
    return element(by.css('.po-modal-content'));
  }

  get poModalOk() {
    return this.poModal.element(by.css('.po-button'));
  }

  get poCheckboxSmall() {
    return this.getPoButtonProperties('small');
  }

  get poCheckboxDisable() {
    return this.getPoButtonProperties('disabled');
  }

  get poRadioLogoPO() {
    return this.getPoButtonIcon('po-icon-news');
  }

  get poRadioCalendar() {
    return this.getPoButtonIcon('po-icon-calendar');
  }

  get poRadioUser() {
    return this.getPoButtonIcon('po-icon-user');
  }
  get poRadioNone() {
    return this.getPoButtonIcon('undefined');
  }

  get poRadioDefault() {
    return this.getPoButtonType('default');
  }

  get poRadioDanger() {
    return this.getPoButtonType('danger');
  }

  get poRadioPrimary() {
    return this.getPoButtonType('primary');
  }

  get poRadioLink() {
    return this.getPoButtonType('link');
  }

  get poInputClean() {
    return element(by.tagName(`${this.sampleName} po-clean span`));
  }

  get poInputGroup() {
    return element(by.css(`${this.sampleName} po-input`));
  }
}
