import { PoDialogPage } from './sample-po-dialog-labs.component.po';

describe('Po-Dialog E2E', () => {
  const dialog: PoDialogPage = new PoDialogPage();

  beforeEach(() => {
    dialog.navigateTo();
  });

  it('Open the modal dialog', () => {
    dialog.poButtonDialog.click();
    expect(dialog.poModal.isDisplayed()).toBeTruthy();
  });

  it('Cleaning field and checking button', () => {
    dialog.cleanInputTitle.click();
    expect(dialog.poButtonDialog.isEnabled()).toBeFalsy();
    dialog.cleanInputMensage.click();
    expect(dialog.poButtonDialog.isEnabled()).toBeFalsy();
  });

  it('Testing radio option ´Alert Dialog´', () => {
    dialog.getRadioAlert().click();
    dialog.poButtonDialog.click();
    expect(dialog.modalButtonOk.isDisplayed()).toBeTruthy();
    dialog.modalButtonOk.click();
    expect(dialog.poModal.isPresent()).toBeFalsy();
  });

  it('Change the inputs texts', () => {
    dialog.cleanInputTitle.click();
    dialog.inputTitle.sendKeys('This is the title!');
    dialog.cleanInputMensage.click();
    dialog.inputMensage.sendKeys('This is the mensage :D');
    expect(dialog.poButtonDialog.isEnabled()).toBeTruthy();
  });

  it('Clean input TITLE and check button', () => {
    dialog.cleanInputTitle.click();
    expect(dialog.poButtonDialog.isEnabled()).toBeFalsy();
  });

  it('Clean input MENSAGE and check button', () => {
    dialog.cleanInputMensage.click();
    expect(dialog.poButtonDialog.isEnabled()).toBeFalsy();
  });
});
