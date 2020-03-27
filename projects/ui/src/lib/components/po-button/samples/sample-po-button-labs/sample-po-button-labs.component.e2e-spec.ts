import { SamplePoButtonLabsComponentPO } from './sample-po-button-labs.component.po';

describe('SamplePoButtonLabs E2E', () => {
  const button = new SamplePoButtonLabsComponentPO();

  beforeAll(() => {
    button.navigateTo();
  });

  it('Check if the element Button is present and open modal and close', () => {
    expect(button.poButton.isPresent()).toBeTruthy();

    button.poButton.click();

    expect(button.poModal.isPresent()).toBeTruthy();

    button.poModalOk.click();

    expect(button.poModal.isPresent()).toBeFalsy();
  });

  it('Check if properties are applied', () => {
    button.poCheckboxSmall.click();

    expect(button.poButton.getAttribute('class')).toContain('po-button-sm');

    button.poCheckboxDisable.click();

    expect(button.poButton.isEnabled()).toBeFalsy();
  });

  it('Check `po-button` show icon `po-icon-news` after select icon `po-icon-news`', () => {
    button.poRadioLogoPO.click();

    expect(button.poButtonIcon.getAttribute('class')).toContain('po-icon-news');
  });

  it('Check `po-button` show icon `po-icon-user` after select icon `po-icon-user`', () => {
    button.poRadioUser.click();

    expect(button.poButtonIcon.getAttribute('class')).toContain('po-icon-user');
  });

  it('Check `po-button` show icon `po-icon-calendar` after select icon `po-icon-calendar`', () => {
    button.poRadioCalendar.click();

    expect(button.poButtonIcon.getAttribute('class')).toContain('po-icon-calendar');
    // expect(element(by.css('span .po-icon'))).toBeTruthy();
    // expect(button.poButtonIcon.isPresent()).toBeTruthy();
  });

  it('Check `po-button` hide icon after select `none`', () => {
    button.poRadioNone.click();

    expect(button.poButtonIcon.isPresent()).toBeFalsy();
  });

  it('Apply ´default´ type to `po-button`', () => {
    button.poRadioDefault.click();

    expect(button.poButton.getAttribute('class')).toContain('po-button');

    expect(button.poButton.getAttribute('class')).not.toContain('po-button-primary');
    expect(button.poButton.getAttribute('class')).not.toContain('po-button-danger');
    expect(button.poButton.getAttribute('class')).not.toContain('po-button-link');
  });

  it('Apply ´primary´ type to `po-button`', () => {
    button.poRadioPrimary.click();

    expect(button.poButton.getAttribute('class')).toContain('po-button-primary');
  });

  it('Apply ´danger´ type to `po-button`', () => {
    button.poRadioDanger.click();

    expect(button.poButton.getAttribute('class')).toContain('po-button-danger');
  });

  it('Apply ´link´ type to `po-button`', () => {
    button.poRadioLink.click();

    expect(button.poButton.getAttribute('class')).toContain('po-button-link');
  });

  it('Check if `po-input` is required after clean', () => {
    button.poInputClean.click();

    expect(button.poInputGroup.getAttribute('class')).toContain('ng-invalid');
  });
});
