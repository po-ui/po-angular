import { browser, by, element } from 'protractor';

export class PoSwitchPage {
  private sampleSwitch = 'sample-po-switch-labs';

  private boxLabel = '.po-checkbox-group-label';

  private _poSwitch;

  get poSwitch() {
    if (!this._poSwitch) {
      this._poSwitch = element(by.css(`${this.sampleSwitch} .po-switch-container`));
    }
    return this._poSwitch;
  }

  get poCheckboxDisabled() {
    return this.getPoCheckBox('disabled');
  }

  get poInputLabelSwitch() {
    return this.getPoInputLabel('label');
  }

  get poInputLabelOn() {
    return this.getPoInputLabel('labelOn');
  }

  get poInputLabelOff() {
    return this.getPoInputLabel('labelOff');
  }

  get poFieldTitle() {
    return element(by.css(`${this.sampleSwitch} .po-label`));
  }

  get poSwitchLabel() {
    return element(by.css(`${this.sampleSwitch} .po-switch[name="poSwitch"] .po-switch-label`));
  }

  get poFieldOptional() {
    return element(by.css(`${this.sampleSwitch} po-switch .po-label-requirement`));
  }

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  private getPoCheckBox(checkbox: string) {
    return element(
      by.css(`${this.sampleSwitch} [name="properties"] .po-checkbox-group-input[value="${checkbox}"]+${this.boxLabel}`)
    );
  }

  private getPoInputLabel(labelName) {
    return element(by.css(`${this.sampleSwitch} po-input [name="${labelName}"]`));
  }
}
