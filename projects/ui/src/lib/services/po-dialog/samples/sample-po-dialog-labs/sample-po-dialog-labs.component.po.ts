import { browser, by, element } from 'protractor';

export class PoDialogPage {
  private sampleDialog = 'sample-po-dialog-labs';

  private poClean = 'po-clean span';

  private _poButtonDialog;

  private getPoInput(inputName: string) {
    return element(by.css(`${this.sampleDialog} po-input input[name="${inputName}"]`));
  }

  private getPoCleanInput(inputName: string) {
    return element(by.css(`${this.sampleDialog} po-input[name="${inputName}"] ${this.poClean}`));
  }

  private getPoRadio(radioName: string) {
    return element(
      by.css(
        `${this.sampleDialog} po-radio-group[name="dialogOptions"] input[value="${radioName}"]+.po-radio-group-label`
      )
    );
  }

  private getModalButton(buttonLabel: string) {
    return element(by.cssContainingText(`.po-modal po-button button`, `${buttonLabel}`));
  }

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  get poButtonDialog() {
    if (!this._poButtonDialog) {
      this._poButtonDialog = element(by.css(`${this.sampleDialog} po-button[name="openDialog"] .po-button`));
    }

    return this._poButtonDialog;
  }

  get cleanInputTitle() {
    return this.getPoCleanInput('title');
  }

  get cleanInputMensage() {
    return this.getPoCleanInput('mensage');
  }

  get inputTitle() {
    return this.getPoInput('title');
  }

  get inputMensage() {
    return this.getPoInput('mensage');
  }

  getRadioAlert() {
    return this.getPoRadio('alert');
  }

  getRadioConfirm() {
    return this.getPoRadio('confirm');
  }

  get poModal() {
    return element(by.css('.po-modal-content'));
  }

  get modalButtonOk() {
    return this.getModalButton('Ok');
  }

  get modalButtonCancel() {
    return this.getModalButton('Cancelar');
  }

  get modalButtonConfirm() {
    return this.getModalButton('Confirmar');
  }
}
